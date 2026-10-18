import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import CoursesScreen from '../screens/CoursesScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import {colors} from '../utils/theme';
import {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        // Tab bar chỉ dùng chữ. Không trả về null thì React Navigation vẫn
        // chừa chỗ và vẽ icon mặc định.
        tabBarIcon: () => null,
        tabBarIconStyle: styles.tabIconHidden,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Tổng quan', tabBarLabel: 'Tổng quan'}}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{title: 'Môn học', tabBarLabel: 'Môn học'}}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{title: 'Thời khoá biểu', tabBarLabel: 'TKB'}}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{title: 'Bài tập', tabBarLabel: 'Bài tập'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Cá nhân', tabBarLabel: 'Cá nhân'}}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: '700',
  },
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    height: 52,
    paddingBottom: 4,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIconHidden: {
    display: 'none',
  },
});

export default MainTabNavigator;
