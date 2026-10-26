import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useAppData} from '../context/AppDataContext';
import colors from '../theme/colors';
import typography from '../theme/typography';
import AssignmentStack from './AssignmentStack';
import CourseStack from './CourseStack';
import ProfileStack from './ProfileStack';
import ScheduleStack from './ScheduleStack';
import HomeStack from './HomeStack';
import {MainTabParamList, ROUTES} from './routes';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Bieu tuong dang chu de khong phu thuoc thu vien icon ben ngoai. */
function TabIcon({label, color}: {label: string; color: string}) {
  return <Text style={[styles.icon, {color}]}>{label}</Text>;
}

/**
 * Tao san ham render icon cho moi tab o pham vi module.
 * Dinh nghia truc tiep trong than AppNavigator se tao component moi
 * sau moi lan render, khien React dung lai toan bo cay ben duoi.
 */
function makeTabIcon(label: string) {
  return function renderTabIcon({color}: {color: string}) {
    return <TabIcon label={label} color={color} />;
  };
}

const TAB_ICONS = {
  home: makeTabIcon('TQ'),
  course: makeTabIcon('MH'),
  schedule: makeTabIcon('TK'),
  assignment: makeTabIcon('BT'),
  profile: makeTabIcon('CN'),
};

export default function AppNavigator() {
  const {assignments} = useAppData();
  const todoCount = assignments.filter(a => a.status === 'todo').length;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.label,
          tabBarStyle: styles.bar,
        }}>
        <Tab.Screen
          name={ROUTES.HOME_TAB}
          component={HomeStack}
          options={{
            title: 'Tong quan',
            tabBarIcon: TAB_ICONS.home,
          }}
        />
        <Tab.Screen
          name={ROUTES.COURSE_TAB}
          component={CourseStack}
          options={{
            title: 'Mon hoc',
            tabBarIcon: TAB_ICONS.course,
          }}
        />
        <Tab.Screen
          name={ROUTES.SCHEDULE_TAB}
          component={ScheduleStack}
          options={{
            title: 'TKB',
            tabBarIcon: TAB_ICONS.schedule,
          }}
        />
        <Tab.Screen
          name={ROUTES.ASSIGNMENT_TAB}
          component={AssignmentStack}
          options={{
            title: 'Bai tap',
            tabBarIcon: TAB_ICONS.assignment,
            tabBarBadge: todoCount > 0 ? todoCount : undefined,
          }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_TAB}
          component={ProfileStack}
          options={{
            title: 'Ca nhan',
            tabBarIcon: TAB_ICONS.profile,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  label: {
    ...typography.small,
  },
  icon: {
    ...typography.captionBold,
  },
});
