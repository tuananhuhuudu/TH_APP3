import {NavigatorScreenParams} from '@react-navigation/native';
import {Assignment, ClassSession, Course, GradeItem} from '../types';

export type MainTabParamList = {
  Home: undefined;
  Courses: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CourseDetail: {course: Course};
  SessionDetail: {session: ClassSession};
  AssignmentDetail: {assignment: Assignment};
  GradeDetail: {grade: GradeItem};
};
