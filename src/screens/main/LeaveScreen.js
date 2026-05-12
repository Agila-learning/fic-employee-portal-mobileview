import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1A365D';

const STATUS_STYLES = {
  approved: { bg: '#dcfce7', text: '#166534' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
  default:  { bg: '#fef9c3', text: '#854d0e' },
};

export default function LeaveScreen() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/operations/leave');
      setLeaves(response.data || []);
    } catch {
      setLeaves([
        { _id: '1', reason: 'Sick Leave', startDate: '2023-10-15', endDate: '2023-10-16', status: 'Approved' },
        { _id: '2', reason: 'Family Function', startDate: '2023-11-20', endDate: '2023-11-22', status: 'Pending' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitLeaveRequest = async () => {
    if (!reason || !startDate || !endDate) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      await axiosClient.post('/operations/leave', { reason, startDate, endDate });
      Alert.alert('Success', 'Leave request submitted successfully');
      setModalVisible(false);
      setReason(''); setStartDate(''); setEndDate('');
      fetchLeaves();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.default;

  const renderLeave = ({ item }) => {
    const isApproved = item.status?.toLowerCase() === 'approved';
    const isPending = item.status?.toLowerCase() === 'pending';
    
    return (
      <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-slate-50">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold text-slate-800 leading-6">{item.reason}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${
            isApproved ? 'bg-success/10' : isPending ? 'bg-warning/10' : 'bg-destructive/10'
          }`}>
            <Text className={`text-[10px] font-black uppercase ${
              isApproved ? 'text-success' : isPending ? 'text-warning' : 'text-destructive'
            }`}>{item.status}</Text>
          </View>
        </View>
        <View className="flex-row items-center bg-slate-50 self-start px-3 py-1.5 rounded-xl">
          <Icon name="calendar-range" size={14} color="#64748b" />
          <Text className="text-xs text-slate-500 font-medium ml-2">
            {item.startDate} to {item.endDate}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-black text-slate-800">My Leaves</Text>
          <Text className="text-slate-400 text-xs font-medium">Manage your requests</Text>
        </View>
        <TouchableOpacity 
          className="bg-primary flex-row items-center px-5 py-3 rounded-2xl shadow-lg shadow-primary/30"
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Apply</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size="large" color="#094fbc" />
        </View>
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item._id}
          renderItem={renderLeave}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <View className="bg-slate-100 p-8 rounded-full mb-6">
                <Icon name="calendar-blank-outline" size={60} color="#94a3b8" />
              </View>
              <Text className="text-slate-400 font-bold text-lg">No leave requests</Text>
              <Text className="text-slate-300 text-center mt-2 px-10">
                You haven't applied for any leave yet.
              </Text>
            </View>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-black text-slate-800">Apply Leave</Text>
              <TouchableOpacity 
                className="bg-slate-100 p-2 rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="space-y-5">
              <View>
                <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Reason</Text>
                <TextInput 
                  className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-800 text-base"
                  placeholder="E.g. Sick leave, Family trip" 
                  placeholderTextColor="#94a3b8" 
                  value={reason} 
                  onChangeText={setReason} 
                />
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">Start Date</Text>
                  <TextInput 
                    className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-800 text-base"
                    placeholder="YYYY-MM-DD" 
                    placeholderTextColor="#94a3b8" 
                    value={startDate} 
                    onChangeText={setStartDate} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">End Date</Text>
                  <TextInput 
                    className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-800 text-base"
                    placeholder="YYYY-MM-DD" 
                    placeholderTextColor="#94a3b8" 
                    value={endDate} 
                    onChangeText={setEndDate} 
                  />
                </View>
              </View>

              <TouchableOpacity 
                className={`mt-6 py-5 rounded-2xl items-center shadow-lg shadow-primary/30 ${
                  submitting ? 'bg-primary/70' : 'bg-primary'
                }`}
                onPress={submitLeaveRequest} 
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-black tracking-tight">Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
