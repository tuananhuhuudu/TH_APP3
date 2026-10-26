import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import CourseListScreen from '../screens/courses/CourseListScreen';
import {stackScreenOptions} from './HomeStack';
import {CourseStackParamList, ROUTES} from './routes';

const Stack = createNativeStackNavigator<CourseStackParamList>();

export default function CourseStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={ROUTES.COURSE_LIST}
        component={CourseListScreen}
        options={{title: 'Mon hoc'}}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{title: 'Chi tiet mon hoc'}}
      />
    </Stack.Navigator>
  );
}
