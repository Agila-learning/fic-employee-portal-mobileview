import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QUICK_ACTIONS = [
  { label: 'Attendance',     tab: 'Attendance',    icon: 'clock-check-outline',    color: '#3b82f6', border: 'border-blue-500' },
  { label: 'Tasks',          tab: 'Tasks',         icon: 'clipboard-list-outline', color: '#22c55e', border: 'border-green-500' },
  { label: 'Leaves',         tab: 'Leaves',        icon: 'calendar-account-outline',color: '#a855f7',border: 'border-purple-500' },
  { label: 'Payslips',       tab: 'Payslips',      icon: 'cash-multiple',          color: '#f97316', border: 'border-orange-500' },
  { label: 'Notifications',  tab: 'Notifications', icon: 'bell-outline',           color: '#06b6d4', border: 'border-cyan-500' },
  { label: 'Profile',        tab: 'Profile',       icon: 'account-circle-outline', color: '#64748b', border: 'border-slate-400' },
];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const DEMO_ACTIVITY = [
  { _id: 'a1', dot: 'bg-green-500', text: 'Clocked in at 09:00 AM',            time: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'a2', dot: 'bg-blue-500',  text: 'Task "Update CRM" assigned to you', time: new Date(Date.now() - 7200000).toISOString() },
  { _id: 'a3', dot: 'bg-purple-500',text: 'Leave request approved',            time: new Date(Date.now() - 86400000).toISOString() },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(DEMO_ACTIVITY);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      setLoadingStats(true);
      const res = await axiosClient.get('/dashboard/summary');
      setStats(res.data);
      if (res.data?.recentActivity?.length) setActivity(res.data.recentActivity);
    } catch {
      // Use default demo data silently
    } finally {
      setLoadingStats(false);
    }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchDashboard(); setRefreshing(false); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Banner */}
      <View className="bg-[#1A365D] px-5 pt-8 pb-10">
        <Text className="text-blue-200 text-sm">{greeting()},</Text>
        <Text className="text-white text-2xl font-extrabold mt-0.5">{user?.name || 'Employee'}</Text>
        <Text className="text-blue-300 text-xs mt-1 capitalize">{user?.role || 'Staff'} · {user?.branch || 'HQ'}</Text>
      </View>

      {/* Stats Row — overlaps banner */}
      <View className="flex-row mx-4 -mt-5 mb-4 gap-3">
        {loadingStats ? (
          <View className="flex-1 bg-white rounded-2xl shadow-sm p-4 items-center">
            <ActivityIndicator color="#1A365D" />
          </View>
        ) : (
          <>
            <StatCard icon="clock-check-outline" color="#3b82f6" label="Present Days" value={stats?.presentDays ?? '—'} />
            <StatCard icon="clipboard-list-outline" color="#22c55e" label="Pending Tasks" value={stats?.pendingTasks ?? '—'} />
            <StatCard icon="calendar-account-outline" color="#a855f7" label="Leaves Left" value={stats?.leavesLeft ?? '—'} />
          </>
        )}
      </View>

      {/* Quick Actions Grid */}
      <Text className="text-base font-bold text-gray-700 mx-4 mb-3">Quick Actions</Text>
      <View className="flex-row flex-wrap mx-4 gap-3 mb-6">
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.tab}
            className={`bg-white w-[30%] p-3.5 rounded-2xl shadow-sm items-center border-t-4 ${action.border}`}
            onPress={() => navigation.navigate(action.tab)}
          >
            <Icon name={action.icon} size={28} color={action.color} />
            <Text className="mt-2 text-xs font-semibold text-gray-700 text-center">{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <Text className="text-base font-bold text-gray-700 mx-4 mb-3">Recent Activity</Text>
      <View className="bg-white mx-4 rounded-2xl shadow-sm px-5 py-3 mb-10">
        {activity.map((item, idx) => (
          <View key={item._id} className={`flex-row items-start py-3 ${idx < activity.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <View className={`w-2.5 h-2.5 rounded-full ${item.dot || 'bg-gray-300'} mt-1.5 mr-3`} />
            <View className="flex-1">
              <Text className="text-gray-700 text-sm">{item.text}</Text>
              {item.time && (
                <Text className="text-gray-400 text-xs mt-0.5">{timeAgo(item.time)}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, color, label, value }) {
  return (
    <View className="flex-1 bg-white rounded-2xl shadow-sm p-3 items-center">
      <Icon name={icon} size={22} color={color} />
      <Text className="text-xl font-extrabold text-gray-800 mt-1">{value}</Text>
      <Text className="text-gray-400 text-[10px] text-center mt-0.5">{label}</Text>
    </View>
  );
}
