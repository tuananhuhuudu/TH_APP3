import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AssignmentDetailScreen from '../screens/AssignmentDetailScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import GradeDetailScreen from '../screens/GradeDetailScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import {colors} from '../utils/theme';
import MainTabNavigator from './MainTabNavigator';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.primary},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: '700'},
          headerBackTitle: 'Quay lại',
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{title: 'Chi tiết môn học'}}
        />
        <Stack.Screen
          name="SessionDetail"
          component={SessionDetailScreen}
          options={{title: 'Chi tiết buổi học'}}
        />
        <Stack.Screen
          name="AssignmentDetail"
          component={AssignmentDetailScreen}
          options={{title: 'Chi tiết bài tập'}}
        />
        <Stack.Screen
          name="GradeDetail"
          component={GradeDetailScreen}
          options={{title: 'Chi tiết kết quả'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
