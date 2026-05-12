import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, StyleSheet } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminLeaveScreen() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All');

  const BRANCHES = ['All', 'Chennai', 'Bangalore', 'Thirupattur', 'Krishnagiri', 'Vellore', 'Work From Home'];

  useEffect(() => { fetchRequests(); }, []);

  useEffect(() => {
    if (selectedBranch === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(r => 
        (r.branch === selectedBranch) || 
        (r.user_id?.branch === selectedBranch) ||
        (r.user?.branch === selectedBranch)
      ));
    }
  }, [selectedBranch, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/operations/leave');
      setRequests(res.data || []);
    } catch (error) {
      console.error('Leave fetch error', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axiosClient.patch(`/operations/leave/${id}`, { status });
      Alert.alert('Success', `Leave ${status} successfully`);
      fetchRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to update leave status');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      // Handle potential formats and keys
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Fallback for YYYY-MM-DD if Date constructor fails
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return 'N/A';
      }
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchRequests(); };

  const renderItem = ({ item }) => (
    <View className="bg-white mx-6 mb-4 p-6 rounded-[35px] shadow-sm border border-slate-50">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center">
          <Icon name="calendar-account" size={24} color="#6366f1" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-base font-bold text-slate-800">{item.user_id?.name || item.user?.name || item.name || 'Staff Member'}</Text>
          <Text className="text-xs text-slate-400 font-medium">{item.leave_type || item.reason || 'General Leave'} · {item.user_id?.branch || item.user?.branch || item.branch || 'Office'}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : styles.statusApproved]}>
          <Text style={[styles.statusText, item.status === 'pending' ? styles.statusTextPending : styles.statusTextApproved]}>{item.status}</Text>
        </View>
      </View>

      <View className="bg-slate-50 p-4 rounded-2xl mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[10px] font-black text-slate-400 uppercase">Start Date</Text>
          <Text className="text-[10px] font-black text-slate-400 uppercase">End Date</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs font-bold text-slate-700">{formatDate(item.startDate || item.start_date || item.fromDate || item.from_date)}</Text>
          <Text className="text-xs font-bold text-slate-700">{formatDate(item.endDate || item.end_date || item.toDate || item.to_date)}</Text>
        </View>
        <Text className="text-[10px] font-black text-slate-400 uppercase mt-4 mb-1">Reason</Text>
        <Text className="text-xs text-slate-600 leading-4">{item.reason || 'No reason provided'}</Text>
      </View>

      {item.status === 'pending' && (
        <View className="flex-row space-x-3">
          <TouchableOpacity 
            onPress={() => handleAction(item._id, 'approved')}
            className="flex-1 bg-success py-3 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-xs">Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleAction(item._id, 'rejected')}
            className="flex-1 bg-destructive py-3 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-xs">Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background pt-6">
      <View className="px-6 mb-6">
        <Text className="text-2xl font-black text-slate-800 tracking-tight">Leave Approvals</Text>
        <Text className="text-slate-400 text-xs font-medium">Review and manage requests</Text>
      </View>

      <View className="mb-6">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BRANCHES}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedBranch(item)}
              style={[styles.branchBtn, selectedBranch === item && styles.branchBtnActive]}
            >
              <Text style={[styles.branchText, selectedBranch === item && styles.branchTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#094fbc" className="mt-20" />
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Icon name="calendar-blank-outline" size={60} color="#cbd5e1" />
              <Text className="text-slate-400 mt-4">No leave requests found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  branchBtn: { marginRight: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 100, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9' },
  branchBtnActive: { backgroundColor: '#094fbc', borderColor: '#094fbc' },
  branchText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  branchTextActive: { color: '#ffffff' },
  statusBadge: { px: 8, py: 4, borderRadius: 6 },
  statusPending: { backgroundColor: '#fef3c7' },
  statusApproved: { backgroundColor: '#dcfce7' },
  statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  statusTextPending: { color: '#d97706' },
  statusTextApproved: { color: '#16a34a' }
});
