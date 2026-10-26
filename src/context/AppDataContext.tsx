import React, {createContext, useCallback, useContext, useMemo} from 'react';
import * as assignmentService from '../api/assignmentService';
import * as courseService from '../api/courseService';
import * as gradeService from '../api/gradeService';
import * as sessionService from '../api/sessionService';
import * as studentService from '../api/studentService';
import useCachedQuery from '../hooks/useCachedQuery';
import {CACHE_KEYS} from '../storage/keys';
import * as outbox from '../storage/outbox';
import {nowISO} from '../utils/date';
import {
  ApiError,
  Assignment,
  AssignmentStatus,
  ClassSession,
  Course,
  Grade,
  Student,
} from '../types';
import {useSync} from './SyncContext';

type AppDataContextValue = {
  student: Student | null;
  courses: Course[];
  sessions: ClassSession[];
  assignments: Assignment[];
  grades: Grade[];

  loading: {
    student: boolean;
    courses: boolean;
    sessions: boolean;
    assignments: boolean;
    grades: boolean;
  };
  error: {
    student: ApiError | null;
    courses: ApiError | null;
    sessions: ApiError | null;
    assignments: ApiError | null;
    grades: ApiError | null;
  };
  refreshing: {
    student: boolean;
    courses: boolean;
    sessions: boolean;
    assignments: boolean;
    grades: boolean;
  };
  lastUpdated: {
    student: string | null;
    courses: string | null;
    sessions: string | null;
    assignments: string | null;
    grades: string | null;
  };

  refreshStudent: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  refreshAssignments: () => Promise<void>;
  refreshGrades: () => Promise<void>;

  toggleAssignmentStatus: (assignment: Assignment) => Promise<void>;
  createAssignment: (data: Partial<Assignment>) => Promise<void>;
  updateStudent: (data: Partial<Student>) => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({children}: {children: React.ReactNode}) {
  const {isOnline, refreshPending} = useSync();

  const studentQuery = useCachedQuery<Student>(CACHE_KEYS.student, () =>
    studentService.getById(),
  );
  const coursesQuery = useCachedQuery<Course[]>(
    CACHE_KEYS.courses,
    courseService.getAll,
  );
  const sessionsQuery = useCachedQuery<ClassSession[]>(
    CACHE_KEYS.sessions,
    sessionService.getAll,
  );
  const assignmentsQuery = useCachedQuery<Assignment[]>(
    CACHE_KEYS.assignments,
    assignmentService.getAll,
  );
  const gradesQuery = useCachedQuery<Grade[]>(
    CACHE_KEYS.grades,
    gradeService.getAll,
  );

  /**
   * Doi trang thai bai tap theo kieu cap nhat lac quan:
   * giao dien doi ngay, neu API loi thi hoan tac.
   * Khi offline thi dua thao tac vao hang doi.
   */
  const toggleAssignmentStatus = useCallback(
    async (assignment: Assignment) => {
      const nextStatus: AssignmentStatus =
        assignment.status === 'done' ? 'todo' : 'done';
      const updatedAt = nowISO();
      const previousStatus = assignment.status;

      assignmentsQuery.setData(prev =>
        (prev ?? []).map(item =>
          item.id === assignment.id
            ? {...item, status: nextStatus, updatedAt}
            : item,
        ),
      );

      const body = {status: nextStatus, updatedAt};
      const url = `/assignments/${assignment.id}`;

      if (!isOnline) {
        await outbox.enqueue({
          method: 'PATCH',
          url,
          body,
          baseUpdatedAt: assignment.updatedAt,
        });
        await refreshPending();
        return;
      }

      try {
        await assignmentService.update(assignment.id, body);
      } catch (error) {
        assignmentsQuery.setData(prev =>
          (prev ?? []).map(item =>
            item.id === assignment.id
              ? {...item, status: previousStatus, updatedAt: assignment.updatedAt}
              : item,
          ),
        );
        throw error;
      }
    },
    [assignmentsQuery, isOnline, refreshPending],
  );

  const createAssignment = useCallback(
    async (data: Partial<Assignment>) => {
      const updatedAt = nowISO();
      const payload: Partial<Assignment> = {...data, status: 'todo', updatedAt};

      if (!isOnline) {
        const tempId = `tmp-${Date.now()}`;
        const optimistic = {...payload, id: tempId} as Assignment;
        assignmentsQuery.setData(prev => [...(prev ?? []), optimistic]);
        await outbox.enqueue({method: 'POST', url: '/assignments', body: optimistic});
        await refreshPending();
        return;
      }

      const created = await assignmentService.create(payload);
      assignmentsQuery.setData(prev => [...(prev ?? []), created]);
    },
    [assignmentsQuery, isOnline, refreshPending],
  );

  const updateStudent = useCallback(
    async (data: Partial<Student>) => {
      const current = studentQuery.data;
      const updatedAt = nowISO();
      const body = {...data, updatedAt};

      studentQuery.setData(prev => (prev ? {...prev, ...body} : prev));

      if (!isOnline) {
        await outbox.enqueue({
          method: 'PATCH',
          url: `/students/${studentService.STUDENT_ID}`,
          body,
          baseUpdatedAt: current?.updatedAt,
        });
        await refreshPending();
        return;
      }

      try {
        await studentService.update(studentService.STUDENT_ID, body);
      } catch (error) {
        studentQuery.setData(() => current);
        throw error;
      }
    },
    [studentQuery, isOnline, refreshPending],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      student: studentQuery.data,
      courses: coursesQuery.data ?? [],
      sessions: sessionsQuery.data ?? [],
      assignments: assignmentsQuery.data ?? [],
      grades: gradesQuery.data ?? [],

      loading: {
        student: studentQuery.loading,
        courses: coursesQuery.loading,
        sessions: sessionsQuery.loading,
        assignments: assignmentsQuery.loading,
        grades: gradesQuery.loading,
      },
      error: {
        student: studentQuery.error,
        courses: coursesQuery.error,
        sessions: sessionsQuery.error,
        assignments: assignmentsQuery.error,
        grades: gradesQuery.error,
      },
      refreshing: {
        student: studentQuery.refreshing,
        courses: coursesQuery.refreshing,
        sessions: sessionsQuery.refreshing,
        assignments: assignmentsQuery.refreshing,
        grades: gradesQuery.refreshing,
      },
      lastUpdated: {
        student: studentQuery.lastUpdated,
        courses: coursesQuery.lastUpdated,
        sessions: sessionsQuery.lastUpdated,
        assignments: assignmentsQuery.lastUpdated,
        grades: gradesQuery.lastUpdated,
      },

      refreshStudent: studentQuery.refresh,
      refreshCourses: coursesQuery.refresh,
      refreshSessions: sessionsQuery.refresh,
      refreshAssignments: assignmentsQuery.refresh,
      refreshGrades: gradesQuery.refresh,

      toggleAssignmentStatus,
      createAssignment,
      updateStudent,
    }),
    [
      studentQuery,
      coursesQuery,
      sessionsQuery,
      assignmentsQuery,
      gradesQuery,
      toggleAssignmentStatus,
      createAssignment,
      updateStudent,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phai duoc dung ben trong AppDataProvider');
  }
  return context;
}
