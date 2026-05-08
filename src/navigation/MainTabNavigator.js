import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen       from '../screens/main/DashboardScreen';
import AttendanceScreen      from '../screens/main/AttendanceScreen';
import TasksScreen           from '../screens/main/TasksScreen';
import LeaveScreen           from '../screens/main/LeaveScreen';
import PayslipScreen         from '../screens/main/PayslipScreen';
import NotificationsScreen   from '../screens/main/NotificationsScreen';
import ProfileScreen         from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Dashboard',      component: DashboardScreen,     icon: ['view-dashboard', 'view-dashboard-outline'] },
  { name: 'Attendance',     component: AttendanceScreen,    icon: ['clock-check', 'clock-check-outline'] },
  { name: 'Tasks',          component: TasksScreen,         icon: ['clipboard-list', 'clipboard-list-outline'] },
  { name: 'Leaves',         component: LeaveScreen,         icon: ['calendar-account', 'calendar-account-outline'] },
  { name: 'Payslips',       component: PayslipScreen,       icon: ['cash-multiple', 'cash-multiple'] },
  { name: 'Notifications',  component: NotificationsScreen, icon: ['bell', 'bell-outline'] },
  { name: 'Profile',        component: ProfileScreen,       icon: ['account-circle', 'account-circle-outline'] },
];

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const tab = TABS.find((t) => t.name === route.name);
          const iconName = tab ? tab.icon[focused ? 0 : 1] : 'circle';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1A365D',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: { backgroundColor: '#1A365D' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}
