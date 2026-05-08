import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const INFO_ROWS = [
  { label: 'Employee ID', field: 'employeeId', icon: 'identifier' },
  { label: 'Department', field: 'department', icon: 'domain' },
  { label: 'Branch',     field: 'branch',     icon: 'map-marker-outline' },
  { label: 'Role',       field: 'role',        icon: 'shield-account-outline' },
  { label: 'Email',      field: 'email',       icon: 'email-outline' },
  { label: 'Phone',      field: 'phone',       icon: 'phone-outline' },
];

function InfoRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-3.5 border-b border-gray-100">
      <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
        <Icon name={icon} size={18} color="#1A365D" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400 mb-0.5">{label}</Text>
        <Text className="text-gray-800 font-medium">{value || '—'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const initials = (user?.name || 'E')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero */}
      <View className="bg-[#1A365D] pt-10 pb-12 items-center">
        <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-3 shadow-md">
          <Text className="text-[#1A365D] text-4xl font-extrabold">{initials}</Text>
        </View>
        <Text className="text-white text-xl font-bold">{user?.name || 'Employee'}</Text>
        <Text className="text-blue-200 text-sm mt-1 capitalize">{user?.role || 'Staff'}</Text>
      </View>

      {/* Info Card */}
      <View className="bg-white mx-4 -mt-6 rounded-2xl shadow-sm px-5 py-2 mb-4">
        {INFO_ROWS.map(({ label, field, icon }) => (
          <InfoRow key={field} icon={icon} label={label} value={user?.[field]} />
        ))}
      </View>

      {/* Account Actions */}
      <View className="bg-white mx-4 rounded-2xl shadow-sm px-5 py-2 mb-6">
        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
          <Icon name="lock-reset" size={20} color="#1A365D" />
          <Text className="ml-3 text-gray-700 font-medium flex-1">Change Password</Text>
          <Icon name="chevron-right" size={20} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
          <Icon name="bell-cog-outline" size={20} color="#1A365D" />
          <Text className="ml-3 text-gray-700 font-medium flex-1">Notification Preferences</Text>
          <Icon name="chevron-right" size={20} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-4">
          <Icon name="information-outline" size={20} color="#1A365D" />
          <Text className="ml-3 text-gray-700 font-medium flex-1">App Version</Text>
          <Text className="text-gray-400 text-sm">v1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mx-4 bg-red-50 border border-red-200 rounded-2xl py-4 flex-row items-center justify-center mb-10"
      >
        <Icon name="logout" size={20} color="#ef4444" />
        <Text className="text-red-500 font-bold text-base ml-2">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
