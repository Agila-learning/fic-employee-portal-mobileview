import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1A365D';

const INFO_ROWS = [
  { label: 'Employee ID', field: 'employeeId', icon: 'identifier' },
  { label: 'Department',  field: 'department', icon: 'domain' },
  { label: 'Branch',      field: 'branch',     icon: 'map-marker-outline' },
  { label: 'Role',        field: 'role',        icon: 'shield-account-outline' },
  { label: 'Email',       field: 'email',       icon: 'email-outline' },
  { label: 'Phone',       field: 'phone',       icon: 'phone-outline' },
];

function InfoRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-4 border-b border-slate-50">
      <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-4">
        <Icon name={icon} size={20} color="#094fbc" />
      </View>
      <View className="flex-1">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</Text>
        <Text className="text-base text-slate-800 font-semibold mt-0.5">{value || '—'}</Text>
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
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Premium Hero Section */}
      <View className="bg-primary pt-14 pb-20 items-center rounded-b-[50px] shadow-2xl shadow-primary/40">
        <View className="w-28 h-28 rounded-[40px] bg-white items-center justify-center shadow-xl border-4 border-white/20">
          <Text className="text-primary text-4xl font-black">{initials}</Text>
        </View>
        <Text className="text-white text-2xl font-black mt-6 tracking-tight">
          {user?.name || 'Employee'}
        </Text>
        <View className="bg-white/20 px-4 py-1.5 rounded-full mt-2 backdrop-blur-md">
          <Text className="text-white text-xs font-bold uppercase tracking-widest">
            {user?.role || 'Staff'}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View className="bg-white mx-6 -mt-10 rounded-[40px] p-6 shadow-xl border border-slate-50">
        {INFO_ROWS.map(({ label, field, icon }) => (
          <InfoRow key={field} icon={icon} label={label} value={user?.[field]} />
        ))}
      </View>

      {/* Account Actions */}
      <View className="bg-white mx-6 mt-6 rounded-[40px] p-6 shadow-xl border border-slate-50">
        <TouchableOpacity className="flex-row items-center py-4 border-b border-slate-50">
          <View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mr-4">
            <Icon name="lock-reset" size={20} color="#64748b" />
          </View>
          <Text className="flex-1 text-base font-bold text-slate-700">Change Password</Text>
          <Icon name="chevron-right" size={20} color="#cbd5e1" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center py-4 border-b border-slate-50">
          <View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mr-4">
            <Icon name="bell-cog-outline" size={20} color="#64748b" />
          </View>
          <Text className="flex-1 text-base font-bold text-slate-700">Notifications</Text>
          <Icon name="chevron-right" size={20} color="#cbd5e1" />
        </TouchableOpacity>
        
        <View className="flex-row items-center py-4">
          <View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mr-4">
            <Icon name="information-outline" size={20} color="#64748b" />
          </View>
          <Text className="flex-1 text-base font-bold text-slate-700">App Version</Text>
          <Text className="text-slate-400 font-bold">v1.2.0</Text>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity 
        onPress={handleLogout} 
        className="mx-6 mt-8 mb-12 bg-destructive/10 border border-destructive/20 py-5 rounded-[30px] flex-row items-center justify-center shadow-lg shadow-destructive/5"
      >
        <Icon name="logout" size={20} color="#dc2626" />
        <Text className="text-destructive font-black text-lg ml-3">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
