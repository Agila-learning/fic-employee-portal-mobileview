import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QUICK_ACTIONS = [
  { label: 'Employees',     tab: 'Employees',     icon: 'account-group',           color: '#3b82f6' },
  { label: 'Tasks',         tab: 'Tasks',         icon: 'clipboard-list-outline',  color: '#22c55e', adminTab: 'AdminTasks' },
  { label: 'Approvals',     tab: 'Approvals',     icon: 'check-decagram-outline',  color: '#a855f7' },
  { label: 'Reports',       tab: 'Reports',       icon: 'file-chart-outline',      color: '#06b6d4', adminTab: 'AdminReports' },
  { label: 'Salary',        tab: 'Salary',        icon: 'cash-multiple',           color: '#f97316' },
  { label: 'Profile',       tab: 'Profile',       icon: 'account-circle-outline',  color: '#64748b' },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const isAdmin = ['admin', 'super-admin', 'md', 'sub-admin'].includes(user?.role);

  useEffect(() => { 
    const timer = setTimeout(() => fetchDashboard(), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoadingStats(true);
      if (isAdmin) {
        const empRes = await axiosClient.get('/operations/attendance');
        setStats(prev => ({ ...prev, totalEmployees: empRes.data?.length || 0, presentToday: empRes.data?.filter(a => a.status === 'present').length || 0 }));
        const leaveRes = await axiosClient.get('/operations/leave');
        setStats(prev => ({ ...prev, pendingLeaves: leaveRes.data?.filter(l => l.status === 'pending').length || 0 }));
      } else {
        const leadRes = await axiosClient.get('/leads');
        setStats({
          totalLeads: leadRes.data?.length || 0,
          convertedLeads: leadRes.data?.filter(l => l.status === 'converted').length || 0,
          successLeads: leadRes.data?.filter(l => l.status === 'success').length || 0
        });
      }
    } catch (error) {
      console.error('Dashboard error', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchDashboard(); setRefreshing(false); };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="bg-primary pt-12 pb-16 px-6 rounded-b-[40px] shadow-2xl">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-blue-100 text-sm font-medium">Hello,</Text>
            <Text className="text-white text-3xl font-bold mt-1 tracking-tight">{user?.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <Icon name="bell-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-4 bg-white/10 self-start px-3 py-1 rounded-full">
          <Icon name="shield-star" size={14} color="#fbbf24" />
          <Text className="text-white text-xs font-semibold ml-1 capitalize">
            {user?.role || 'Admin'} · {isAdmin ? 'All Branches' : (user?.branch || 'HQ')}
          </Text>
        </View>
      </View>

      <View className="flex-row px-4 -mt-10 space-x-3">
        {loadingStats ? (
          <View className="flex-1 bg-white p-6 rounded-3xl items-center"><ActivityIndicator color="#094fbc" /></View>
        ) : (
          <>
            {isAdmin ? (
              <>
                <StatCard 
                  icon="account-group" color="#3b82f6" label="Total Staff" value={stats?.totalEmployees ?? '0'} 
                  onPress={() => navigation.navigate('Employees')}
                />
                <StatCard 
                  icon="account-check" color="#10b981" label="Present Today" value={stats?.presentToday ?? '0'} 
                  onPress={() => navigation.navigate('Employees')}
                />
                <StatCard 
                  icon="calendar-clock" color="#f59e0b" label="Pending Leaves" value={stats?.pendingLeaves ?? '0'} 
                  onPress={() => navigation.navigate('Approvals')}
                />
              </>
            ) : (
              <>
                <StatCard icon="file-document-outline" color="#3b82f6" label="Total Leads" value={stats?.totalLeads ?? '0'} />
                <StatCard icon="check-decagram-outline" color="#10b981" label="Converted" value={stats?.convertedLeads ?? '0'} />
                <StatCard icon="trophy-outline" color="#f59e0b" label="Success" value={stats?.successLeads ?? '0'} />
              </>
            )}
          </>
        )}
      </View>

      <View className="px-6 mt-8">
        <Text className="text-lg font-bold text-foreground mb-4">Announcements</Text>
        <View className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 items-center justify-center">
          <Icon name="bullhorn-variant" size={30} color="#6366f1" />
          <Text className="text-indigo-600 font-bold mt-2">No active announcements</Text>
        </View>
      </View>

      <View className="px-6 mt-8 mb-12">
        <Text className="text-lg font-bold text-foreground mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between">
          {QUICK_ACTIONS.filter(a => isAdmin ? true : !['Reports'].includes(a.label)).map((action) => (
            <TouchableOpacity
              key={action.label}
              className="bg-white w-[30%] mb-4 p-4 rounded-3xl items-center shadow-sm border-t-4"
              style={{ borderTopColor: action.color }}
              onPress={() => navigation.navigate(isAdmin && action.adminTab ? action.adminTab : action.tab)}
            >
              <View className="p-2 rounded-xl" style={{ backgroundColor: `${action.color}15` }}>
                <Icon name={action.icon} size={26} color={action.color} />
              </View>
              <Text className="text-[10px] font-bold text-slate-600 mt-2 text-center">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, color, label, value, onPress }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      className="flex-1 bg-white p-4 rounded-3xl items-center shadow-lg"
    >
      <View className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <Text className="text-xl font-black text-slate-800 mt-2">{value}</Text>
      <Text className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter">{label}</Text>
    </TouchableOpacity>
  );
}
