import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Assignment,
  ClassSession,
  Course,
  GradeItem,
  StudentProfile,
} from '../types';
import {
  sampleAssignments,
  sampleCourses,
  sampleGrades,
  sampleProfile,
  sampleSessions,
} from './sampleData';

const STORAGE_KEY_ASSIGNMENTS = '@th_app3/assignments';
const STORAGE_KEY_PROFILE = '@th_app3/profile';

type ProfileUpdate = Pick<StudentProfile, 'fullName' | 'email' | 'phone'>;

type AppContextValue = {
  courses: Course[];
  sessions: ClassSession[];
  assignments: Assignment[];
  grades: GradeItem[];
  profile: StudentProfile;
  loading: boolean;
  toggleAssignment: (id: string) => void;
  updateProfile: (update: ProfileUpdate) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [courses] = useState<Course[]>(sampleCourses);
  const [sessions] = useState<ClassSession[]>(sampleSessions);
  const [grades] = useState<GradeItem[]>(sampleGrades);
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [profile, setProfile] = useState<StudentProfile>(sampleProfile);
  const [loading, setLoading] = useState(true);

  // Nạp dữ liệu đã lưu khi mở ứng dụng.
  useEffect(() => {
    let active = true;

    async function loadStoredData() {
      try {
        const [assignmentsJson, profileJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_ASSIGNMENTS),
          AsyncStorage.getItem(STORAGE_KEY_PROFILE),
        ]);

        if (!active) {
          return;
        }

        if (assignmentsJson) {
          const savedStates: Record<string, boolean> =
            JSON.parse(assignmentsJson);
          setAssignments(prev =>
            prev.map(item =>
              savedStates[item.id] === undefined
                ? item
                : {...item, done: savedStates[item.id]},
            ),
          );
        }

        if (profileJson) {
          setProfile(prev => ({...prev, ...JSON.parse(profileJson)}));
        }
      } catch (error) {
        console.warn('Không đọc được dữ liệu đã lưu', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStoredData();
    return () => {
      active = false;
    };
  }, []);

  const toggleAssignment = useCallback((id: string) => {
    setAssignments(prev => {
      const next = prev.map(item =>
        item.id === id ? {...item, done: !item.done} : item,
      );

      const states = next.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = item.done;
        return acc;
      }, {});

      AsyncStorage.setItem(
        STORAGE_KEY_ASSIGNMENTS,
        JSON.stringify(states),
      ).catch(error => console.warn('Không lưu được bài tập', error));

      return next;
    });
  }, []);

  const updateProfile = useCallback((update: ProfileUpdate) => {
    setProfile(prev => {
      const next = {...prev, ...update};
      AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(next)).catch(
        error => console.warn('Không lưu được hồ sơ', error),
      );
      return next;
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      courses,
      sessions,
      assignments,
      grades,
      profile,
      loading,
      toggleAssignment,
      updateProfile,
    }),
    [
      courses,
      sessions,
      assignments,
      grades,
      profile,
      loading,
      toggleAssignment,
      updateProfile,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp phải được dùng bên trong AppProvider');
  }
  return context;
}
