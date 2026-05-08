import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AttendanceScreen() {
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchAttendanceStatus();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      setLoading(true);
      // Assuming GET /attendance/today returns { status: 'clocked_in' | 'clocked_out', time: '...', ... }
      const response = await axiosClient.get('/attendance/today');
      setAttendanceStatus(response.data);
    } catch (error) {
      console.log('Error fetching attendance status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockInOut = async (type) => {
    try {
      setLoading(true);
      // Assuming POST /attendance/clock with type 'in' or 'out'
      await axiosClient.post('/attendance/clock', { type });
      Alert.alert('Success', `Successfully clocked ${type}`);
      fetchAttendanceStatus();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isClockedIn = attendanceStatus?.status === 'clocked_in';

  return (
    <View className="flex-1 bg-gray-50 p-6 items-center">
      <View className="bg-white w-full rounded-2xl shadow-sm p-8 items-center mb-8 mt-10">
        <Text className="text-gray-500 text-lg mb-2">Current Time</Text>
        <Text className="text-4xl font-bold text-primary tracking-widest">{formatTime(currentTime)}</Text>
        <Text className="text-gray-500 mt-2">{currentTime.toDateString()}</Text>
      </View>

      {loading && !attendanceStatus ? (
        <ActivityIndicator size="large" color="#1A365D" />
      ) : (
        <View className="w-full items-center">
          <TouchableOpacity
            className={`w-48 h-48 rounded-full items-center justify-center shadow-md ${
              isClockedIn ? 'bg-red-500' : 'bg-green-500'
            }`}
            onPress={() => handleClockInOut(isClockedIn ? 'out' : 'in')}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <>
                <Icon name={isClockedIn ? 'logout' : 'login'} size={40} color="white" />
                <Text className="text-white text-xl font-bold mt-2">
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          <Text className="text-gray-500 mt-6 text-center">
            {isClockedIn 
              ? `You clocked in at ${attendanceStatus?.clockInTime || 'an unknown time'}. Don't forget to clock out!`
              : 'You are currently not clocked in.'}
          </Text>
        </View>
      )}
    </View>
  );
}
