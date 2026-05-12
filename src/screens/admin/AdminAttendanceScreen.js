import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminAttendanceScreen() {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [period, setPeriod] = useState('Daily');

  const BRANCHES = ['All', 'Chennai', 'Bangalore', 'Thirupattur', 'Krishnagiri', 'Vellore', 'Work From Home'];
  const PERIODS = ['Daily', 'Weekly', 'Monthly'];

  useEffect(() => { fetchAllAttendance(); }, [period]);

  useEffect(() => {
    if (selectedBranch === 'All') {
      setFilteredAttendance(attendance);
    } else {
      setFilteredAttendance(attendance.filter(a => 
        (a.branch === selectedBranch) || (a.user_id?.branch === selectedBranch)
      ));
    }
  }, [selectedBranch, attendance]);

  const fetchAllAttendance = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/operations/attendance?period=${period.toLowerCase()}`);
      setAttendance(res.data || []);
    } catch (error) {
      console.error('Attendance fetch error', error);
      setAttendance([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const onRefresh = () => { setRefreshing(true); fetchAllAttendance(); };

  const renderItem = ({ item }) => (
    <View className="bg-white mx-6 mb-4 p-5 rounded-[30px] shadow-sm border border-slate-50">
      <View className="flex-row items-center mb-4">
        <View className={`w-12 h-12 rounded-2xl items-center justify-center ${
          item.status === 'present' ? 'bg-success/10' : item.status === 'absent' ? 'bg-destructive/10' : 'bg-warning/10'
        }`}>
          <Icon 
            name={item.status === 'present' ? 'account-check' : item.status === 'absent' ? 'account-remove' : 'account-clock'} 
            size={24} 
            color={item.status === 'present' ? '#22c55e' : item.status === 'absent' ? '#ef4444' : '#f59e0b'} 
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-base font-bold text-slate-800">{item.user_id?.name || item.name || 'Staff Member'}</Text>
          <Text className="text-xs text-slate-400 font-medium">{item.user_id?.department || item.department || 'General Staff'}</Text>
        </View>
        <View className="bg-slate-50 px-2 py-1 rounded-md">
          <Text className="text-[10px] font-black text-slate-400 uppercase">{item.user_id?.branch || item.branch || 'Office'}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between pt-4 border-t border-slate-50">
        <View>
          <Text className="text-[10px] text-slate-400 uppercase font-black mb-1">Check In</Text>
          <Text className="text-sm font-black text-primary">{formatTime(item.check_in)}</Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-slate-400 uppercase font-black mb-1">Check Out</Text>
          <Text className="text-sm font-black text-slate-600">{formatTime(item.check_out)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background pt-6">
      <View className="px-6 mb-4">
        <Text className="text-2xl font-black text-slate-800 tracking-tight">Employee Status</Text>
        <Text className="text-slate-400 text-xs font-medium">Monitoring {period} Activity</Text>
      </View>

      <View className="mb-4 flex-row px-6 space-x-2">
        {PERIODS.map(p => (
          <TouchableOpacity 
            key={p} 
            onPress={() => setPeriod(p)}
            style={[styles.periodBtn, period === p && styles.periodBtnActive]}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
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
          data={filteredAttendance}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Icon name="account-search-outline" size={60} color="#cbd5e1" />
              <Text className="text-slate-400 mt-4">No records found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  periodBtn: { flex: 1, py: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#f8fafc' },
  periodBtnActive: { backgroundColor: '#1e293b' },
  periodText: { fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' },
  periodTextActive: { color: '#ffffff' },
  branchBtn: { marginRight: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 100, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9' },
  branchBtnActive: { backgroundColor: '#094fbc', borderColor: '#094fbc' },
  branchText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  branchTextActive: { color: '#ffffff' }
});
