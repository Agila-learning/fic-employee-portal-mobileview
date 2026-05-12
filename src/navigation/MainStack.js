import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import AdminTasksScreen from '../screens/admin/AdminTasksScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AdminTasks" component={AdminTasksScreen} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
    </Stack.Navigator>
  );
}
