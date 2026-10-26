import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import {stackScreenOptions} from './HomeStack';
import {ROUTES, ScheduleStackParamList} from './routes';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={ROUTES.SCHEDULE}
        component={ScheduleScreen}
        options={{title: 'Thoi khoa bieu'}}
      />
      <Stack.Screen
        name={ROUTES.SESSION_DETAIL}
        component={SessionDetailScreen}
        options={{title: 'Chi tiet buoi hoc'}}
      />
    </Stack.Navigator>
  );
}
