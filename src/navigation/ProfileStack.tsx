import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import {stackScreenOptions} from './HomeStack';
import {ProfileStackParamList, ROUTES} from './routes';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{title: 'Ca nhan'}}
      />
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{title: 'Chinh sua thong tin'}}
      />
      <Stack.Screen
        name={ROUTES.GRADE_LIST}
        component={GradeListScreen}
        options={{title: 'Ket qua hoc tap'}}
      />
      <Stack.Screen
        name={ROUTES.GRADE_DETAIL}
        component={GradeDetailScreen}
        options={{title: 'Chi tiet ket qua'}}
      />
    </Stack.Navigator>
  );
}
