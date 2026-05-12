import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';

import DashboardScreen       from '../screens/main/DashboardScreen';
import AttendanceScreen      from '../screens/main/AttendanceScreen';
import TasksScreen           from '../screens/main/TasksScreen';
import LeaveScreen           from '../screens/main/LeaveScreen';
import PayslipScreen         from '../screens/main/PayslipScreen';
import NotificationsScreen   from '../screens/main/NotificationsScreen';
import ProfileScreen         from '../screens/main/ProfileScreen';

// Admin Screens
import AdminAttendanceScreen from '../screens/admin/AdminAttendanceScreen';
import AdminLeaveScreen      from '../screens/admin/AdminLeaveScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const isAdmin = ['admin', 'super-admin', 'md', 'sub-admin'].includes(role);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          else if (route.name === 'Employees') iconName = focused ? 'account-group' : 'account-group-outline';
          else if (route.name === 'Attendance') iconName = focused ? 'clock-check' : 'clock-check-outline';
          else if (route.name === 'Approvals') iconName = focused ? 'check-decagram' : 'check-decagram-outline';
          else if (route.name === 'Salary') iconName = focused ? 'cash-multiple' : 'cash-multiple';
          else if (route.name === 'Tasks') iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
          else if (route.name === 'Leaves') iconName = focused ? 'calendar-account' : 'calendar-account-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account-circle' : 'account-circle-outline';
          return <Icon name={iconName || 'circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#094fbc',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          backgroundColor: '#ffffff',
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: -4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      
      {/* Admin Tabs */}
      <Tab.Screen 
        name="Employees" 
        component={AdminAttendanceScreen} 
        options={{ tabBarButton: isAdmin ? undefined : () => null }}
      />
      <Tab.Screen 
        name="Approvals" 
        component={AdminLeaveScreen} 
        options={{ tabBarButton: isAdmin ? undefined : () => null }}
      />
      
      {/* Employee Tabs */}
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{ tabBarButton: !isAdmin ? undefined : () => null }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{ tabBarButton: !isAdmin ? undefined : () => null }}
      />
      <Tab.Screen 
        name="Leaves" 
        component={LeaveScreen} 
        options={{ tabBarButton: !isAdmin ? undefined : () => null }}
      />
      
      <Tab.Screen name="Salary" component={PayslipScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
