import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import HomeScreen from '../screens/home/HomeScreen';
import colors from '../theme/colors';
import {HomeStackParamList, ROUTES} from './routes';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const stackScreenOptions = {
  headerStyle: {backgroundColor: colors.primary},
  headerTintColor: colors.white,
  headerTitleStyle: {fontWeight: '700' as const},
  headerBackTitle: 'Quay lai',
  contentStyle: {backgroundColor: colors.background},
};

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{title: 'Tong quan'}}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{title: 'Chi tiet mon hoc'}}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{title: 'Chi tiet bai tap'}}
      />
    </Stack.Navigator>
  );
}
