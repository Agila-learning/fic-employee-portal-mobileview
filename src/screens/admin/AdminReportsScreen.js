import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Linking, StyleSheet } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [period, setPeriod] = useState('Daily');

  const BRANCHES = ['All', 'Chennai', 'Bangalore', 'Thirupattur', 'Krishnagiri', 'Vellore', 'Work From Home'];
  const PERIODS = ['Daily', 'Weekly', 'Monthly'];

  useEffect(() => { fetchReports(); }, [selectedBranch, period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/reports?branch=${selectedBranch}&period=${period.toLowerCase()}`);
      setReports(res.data || []);
    } catch (error) {
      console.error('Reports fetch error', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownload = () => {
    const url = `https://forgeindiaconnect.in/api/reports/export?branch=${selectedBranch}&period=${period.toLowerCase()}`;
    Alert.alert(
      'Export Data',
      `Download ${period} reports for ${selectedBranch} in CSV format?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => Linking.openURL(url) }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background pt-6">
      <View className="px-6 mb-6 flex-row justify-between items-end">
        <View>
          <Text className="text-2xl font-black text-slate-800 tracking-tight">Work Reports</Text>
          <Text className="text-slate-400 text-xs font-medium">Summaries for {period} range</Text>
        </View>
        <TouchableOpacity onPress={handleDownload} className="bg-success/10 p-3 rounded-2xl flex-row items-center">
          <Icon name="file-excel-outline" size={20} color="#22c55e" />
          <Text className="text-success text-[10px] font-black ml-1 uppercase">Export</Text>
        </TouchableOpacity>
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
          data={reports}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View className="bg-white mx-6 mb-4 p-6 rounded-[35px] shadow-sm border border-slate-50">
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center"><Icon name="account" size={20} color="#094fbc" /></View>
                  <View className="ml-3">
                    <Text className="text-sm font-black text-slate-800">{item.user_id?.name || item.name || 'Employee'}</Text>
                    <Text className="text-[10px] text-slate-400 font-bold uppercase">{item.department || 'Staff'}</Text>
                  </View>
                </View>
                <Text className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  {item.report_date ? new Date(item.report_date).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <View className="bg-slate-50 p-4 rounded-2xl mb-2">
                <Text className="text-[10px] font-black text-primary uppercase mb-1">Morning</Text>
                <Text className="text-xs text-slate-600">{item.morning_description}</Text>
              </View>
              <View className="bg-slate-50 p-4 rounded-2xl">
                <Text className="text-[10px] font-black text-indigo-500 uppercase mb-1">Afternoon</Text>
                <Text className="text-xs text-slate-600">{item.afternoon_description}</Text>
              </View>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchReports} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Icon name="file-search-outline" size={60} color="#cbd5e1" />
              <Text className="text-slate-400 mt-4">No reports found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#f8fafc' },
  periodBtnActive: { backgroundColor: '#1e293b' },
  periodText: { fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' },
  periodTextActive: { color: '#ffffff' },
  branchBtn: { marginRight: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 100, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9' },
  branchBtnActive: { backgroundColor: '#094fbc', borderColor: '#094fbc' },
  branchText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  branchTextActive: { color: '#ffffff' }
});
