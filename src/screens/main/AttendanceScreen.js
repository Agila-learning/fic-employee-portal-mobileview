import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1A365D';

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
      await axiosClient.post('/attendance/clock', { type });
      Alert.alert('Success', `Successfully clocked ${type}`);
      fetchAttendanceStatus();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const isClockedIn = attendanceStatus?.status === 'clocked_in';

  return (
    <View className="flex-1 bg-background px-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Card */}
        <View className="bg-white w-full rounded-[40px] py-10 items-center mt-8 mb-8 shadow-2xl shadow-primary/20">
          <Text className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-widest">
            Current Time
          </Text>
          <Text className="text-4xl font-black text-primary tracking-tighter">
            {formatTime(currentTime)}
          </Text>
          <Text className="text-slate-400 text-sm mt-2 font-medium">
            {currentTime.toDateString()}
          </Text>
        </View>

        {/* Clock In/Out Section */}
        <View className="items-center">
          <TouchableOpacity
            onPress={() => handleClockInOut(isClockedIn ? 'out' : 'in')}
            disabled={loading}
            activeOpacity={0.8}
            className={`w-52 h-52 rounded-full items-center justify-center shadow-2xl ${
              isClockedIn ? 'bg-destructive shadow-destructive/30' : 'bg-success shadow-success/30'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <View className="items-center">
                <Icon name={isClockedIn ? 'logout' : 'login'} size={50} color="white" />
                <Text className="text-white text-xl font-black mt-2">
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View className="bg-white/50 px-6 py-4 rounded-3xl mt-8 w-full border border-slate-100">
            <Text className="text-slate-600 text-center text-sm leading-5">
              {isClockedIn
                ? `You clocked in at ${attendanceStatus?.clockInTime || '--:--'}. Have a productive day!`
                : 'Ready to start your shift? Don\'t forget to clock in!'}
            </Text>
          </View>
        </View>

        {/* History Section */}
        <View className="mt-10 mb-10">
          <View className="flex-row justify-between items-center mb-4 px-2">
            <Text className="text-lg font-bold text-foreground">Recent History</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-3xl p-4 shadow-sm">
            {[1, 2, 3].map((_, i) => (
              <View key={i} className={`flex-row justify-between items-center py-4 ${i < 2 ? 'border-b border-slate-50' : ''}`}>
                <View>
                  <Text className="text-sm font-bold text-slate-800">May {10-i}, 2026</Text>
                  <Text className="text-xs text-slate-400 mt-0.5">09:00 AM - 06:00 PM</Text>
                </View>
                <View className="bg-success/10 px-3 py-1 rounded-full">
                  <Text className="text-success text-[10px] font-bold uppercase">Present</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
