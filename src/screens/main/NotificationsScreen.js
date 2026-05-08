import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ICON_MAP = {
  announcement: { icon: 'bullhorn-outline', color: '#3b82f6', bg: '#eff6ff' },
  task:         { icon: 'clipboard-list-outline', color: '#8b5cf6', bg: '#f5f3ff' },
  leave:        { icon: 'calendar-check-outline', color: '#10b981', bg: '#ecfdf5' },
  salary:       { icon: 'cash-multiple', color: '#f59e0b', bg: '#fffbeb' },
  default:      { icon: 'bell-outline', color: '#64748b', bg: '#f1f5f9' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const DEMO = [
  { _id: 'n1', type: 'announcement', title: 'Office Closed – Public Holiday', message: 'The office will remain closed on 15th August.', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), read: false },
  { _id: 'n2', type: 'task', title: 'New Task Assigned', message: 'You have been assigned: "Prepare Q2 Report".', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), read: false },
  { _id: 'n3', type: 'leave', title: 'Leave Approved', message: 'Your leave request for 10th Aug has been approved.', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
  { _id: 'n4', type: 'salary', title: 'Payslip Available', message: 'Your July 2025 payslip has been generated.', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), read: true },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/notifications/my');
      setNotifications(res.data || []);
    } catch {
      setNotifications(DEMO);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderItem = ({ item }) => {
    const style = ICON_MAP[item.type] || ICON_MAP.default;
    return (
      <TouchableOpacity
        onPress={() => markRead(item._id)}
        className={`flex-row items-start mx-4 mb-3 p-4 rounded-2xl border ${
          item.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'
        }`}
      >
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3 mt-0.5"
          style={{ backgroundColor: style.bg }}
        >
          <Icon name={style.icon} size={22} color={style.color} />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-bold text-gray-800 flex-1 pr-2" numberOfLines={1}>
              {item.title}
            </Text>
            {!item.read && (
              <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            )}
          </View>
          <Text className="text-gray-500 text-sm" numberOfLines={2}>
            {item.message}
          </Text>
          <Text className="text-gray-400 text-xs mt-2">{timeAgo(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#1A365D] pt-6 pb-6 px-5 mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">Notifications</Text>
          {unreadCount > 0 && (
            <Text className="text-blue-200 text-sm mt-1">{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="bg-white/20 px-3 py-1.5 rounded-full"
          >
            <Text className="text-white text-xs font-semibold">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A365D" className="mt-16" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Icon name="bell-sleep-outline" size={64} color="#cbd5e1" />
              <Text className="text-gray-400 text-lg mt-4">No notifications yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
