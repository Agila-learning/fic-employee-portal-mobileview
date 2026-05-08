import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LeaveScreen() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form state
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/operations/leave');
      setLeaves(response.data || []);
    } catch (error) {
      console.log('Error fetching leaves', error);
      // Fallback dummy data
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

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const renderLeave = ({ item }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{item.reason}</Text>
        <View className={`px-2 py-1 rounded-md ${getStatusColor(item.status).split(' ')[1]}`}>
          <Text className={`text-xs font-bold ${getStatusColor(item.status).split(' ')[0]}`}>{item.status}</Text>
        </View>
      </View>
      <View className="flex-row items-center mt-1 text-gray-600">
        <Icon name="calendar-range" size={16} color="#6b7280" />
        <Text className="text-gray-600 ml-2">{item.startDate} to {item.endDate}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-primary">My Leaves</Text>
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={20} color="white" />
          <Text className="text-white font-medium ml-1">Apply</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A365D" className="mt-10" />
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={item => item._id}
          renderItem={renderLeave}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Icon name="calendar-blank-outline" size={60} color="#cbd5e1" />
              <Text className="text-gray-400 text-lg mt-4">No leave requests found</Text>
            </View>
          }
        />
      )}

      {/* Apply Leave Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-2/3">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">Apply Leave</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-1">Reason</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-black"
                  placeholder="E.g. Sick leave, Family trip"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>

              <View className="flex-row justify-between">
                <View className="w-[48%]">
                  <Text className="text-gray-700 font-medium mb-1">Start Date</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-black"
                    placeholder="YYYY-MM-DD"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                <View className="w-[48%]">
                  <Text className="text-gray-700 font-medium mb-1">End Date</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-black"
                    placeholder="YYYY-MM-DD"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              <TouchableOpacity 
                className="bg-primary rounded-lg py-4 mt-6 items-center"
                onPress={submitLeaveRequest}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
