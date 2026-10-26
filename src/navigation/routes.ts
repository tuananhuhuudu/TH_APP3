/** Ten man hinh khai bao mot lan, khong viet chuoi truc tiep khi goi navigate. */

export const ROUTES = {
  HOME_TAB: 'HomeTab',
  COURSE_TAB: 'CourseTab',
  SCHEDULE_TAB: 'ScheduleTab',
  ASSIGNMENT_TAB: 'AssignmentTab',
  PROFILE_TAB: 'ProfileTab',

  HOME: 'Home',

  COURSE_LIST: 'CourseList',
  COURSE_DETAIL: 'CourseDetail',

  SCHEDULE: 'Schedule',
  SESSION_DETAIL: 'SessionDetail',

  ASSIGNMENT_LIST: 'AssignmentList',
  ASSIGNMENT_DETAIL: 'AssignmentDetail',
  ASSIGNMENT_FORM: 'AssignmentForm',

  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  GRADE_LIST: 'GradeList',
  GRADE_DETAIL: 'GradeDetail',
} as const;

/** Man hinh chi tiet chi nhan id qua route.params. */
export type HomeStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.COURSE_DETAIL]: {id: number};
  [ROUTES.ASSIGNMENT_DETAIL]: {id: number | string};
};

export type CourseStackParamList = {
  [ROUTES.COURSE_LIST]: undefined;
  [ROUTES.COURSE_DETAIL]: {id: number};
};

export type ScheduleStackParamList = {
  [ROUTES.SCHEDULE]: undefined;
  [ROUTES.SESSION_DETAIL]: {id: number};
};

export type AssignmentStackParamList = {
  [ROUTES.ASSIGNMENT_LIST]: undefined;
  [ROUTES.ASSIGNMENT_DETAIL]: {id: number | string};
  [ROUTES.ASSIGNMENT_FORM]: undefined;
};

export type ProfileStackParamList = {
  [ROUTES.PROFILE]: undefined;
  [ROUTES.EDIT_PROFILE]: undefined;
  [ROUTES.GRADE_LIST]: undefined;
  [ROUTES.GRADE_DETAIL]: {id: number};
};

export type MainTabParamList = {
  [ROUTES.HOME_TAB]: undefined;
  [ROUTES.COURSE_TAB]: undefined;
  [ROUTES.SCHEDULE_TAB]: undefined;
  [ROUTES.ASSIGNMENT_TAB]: undefined;
  [ROUTES.PROFILE_TAB]: undefined;
};
