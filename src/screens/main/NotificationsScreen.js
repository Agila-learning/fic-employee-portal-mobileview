import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1A365D';

const ICON_MAP = {
  announcement: { icon: 'bullhorn-outline',        color: '#3b82f6', bg: '#eff6ff' },
  task:         { icon: 'clipboard-list-outline',   color: '#8b5cf6', bg: '#f5f3ff' },
  leave:        { icon: 'calendar-check-outline',   color: '#10b981', bg: '#ecfdf5' },
  salary:       { icon: 'cash-multiple',            color: '#f59e0b', bg: '#fffbeb' },
  default:      { icon: 'bell-outline',             color: '#64748b', bg: '#f1f5f9' },
};

const DEMO = [
  { _id: 'n1', type: 'announcement', title: 'Office Closed – Public Holiday', message: 'The office will remain closed on 15th August.', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), read: false },
  { _id: 'n2', type: 'task',         title: 'New Task Assigned',              message: 'You have been assigned: "Prepare Q2 Report".', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), read: false },
  { _id: 'n3', type: 'leave',        title: 'Leave Approved',                 message: 'Your leave request for 10th Aug has been approved.', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
  { _id: 'n4', type: 'salary',       title: 'Payslip Available',              message: 'Your July 2025 payslip has been generated.', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), read: true },
];

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

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

  const onRefresh = async () => { setRefreshing(true); await fetchNotifications(); setRefreshing(false); };

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderItem = ({ item }) => {
    const s = ICON_MAP[item.type] || ICON_MAP.default;
    return (
      <TouchableOpacity
        onPress={() => markRead(item._id)}
        style={[styles.notifCard, item.read ? styles.notifRead : styles.notifUnread]}
      >
        <View style={[styles.notifIcon, { backgroundColor: s.bg }]}>
          <Icon name={s.icon} size={22} color={s.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.notifRow}>
            <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notifMsg} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.notifTime}>{timeAgo(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.unreadCount}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="bell-sleep-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: PRIMARY, paddingTop: 24, paddingBottom: 24,
    paddingHorizontal: 20, marginBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  heading: { color: '#ffffff', fontSize: 22, fontWeight: '700' },
  unreadCount: { color: '#bfdbfe', fontSize: 14, marginTop: 4 },
  markAllBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  markAllText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginBottom: 12, padding: 16, borderRadius: 20, borderWidth: 1,
  },
  notifRead:   { backgroundColor: '#ffffff', borderColor: '#f1f5f9' },
  notifUnread: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  notifRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937', flex: 1, paddingRight: 8 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6' },
  notifMsg: { fontSize: 13, color: '#6b7280' },
  notifTime: { fontSize: 11, color: '#94a3b8', marginTop: 6 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#94a3b8', marginTop: 16 },
});
