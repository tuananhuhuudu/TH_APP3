import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import {stackScreenOptions} from './HomeStack';
import {AssignmentStackParamList, ROUTES} from './routes';

const Stack = createNativeStackNavigator<AssignmentStackParamList>();

export default function AssignmentStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_LIST}
        component={AssignmentListScreen}
        options={{title: 'Bai tap'}}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{title: 'Chi tiet bai tap'}}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_FORM}
        component={AssignmentFormScreen}
        options={{title: 'Them bai tap'}}
      />
    </Stack.Navigator>
  );
}
