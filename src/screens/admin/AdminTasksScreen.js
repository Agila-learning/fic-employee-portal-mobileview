import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, ScrollView } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminTasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', branch: 'Chennai' });

  const BRANCHES = ['All', 'Chennai', 'Bangalore', 'Thirupattur', 'Krishnagiri', 'Vellore'];

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes] = await Promise.all([
        axiosClient.get('/utility/tasks'),
        axiosClient.get('/users')
      ]);
      setTasks(tasksRes.data || []);
      setEmployees(usersRes.data || []);
    } catch (error) {
      console.error('Task fetch error', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assigned_to) {
      Alert.alert('Error', 'Title and Employee are required');
      return;
    }
    try {
      await axiosClient.post('/utility/tasks', newTask);
      Alert.alert('Success', 'Task assigned');
      setShowModal(false);
      fetchInitialData();
    } catch (error) {
      Alert.alert('Error', 'Failed to assign task');
    }
  };

  return (
    <View className="flex-1 bg-background pt-6">
      <View className="px-6 mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-black text-slate-800">Task Management</Text>
          <Text className="text-slate-400 text-xs font-medium">Assign work to staff</Text>
        </View>
        <TouchableOpacity onPress={() => setShowModal(true)} className="bg-primary w-12 h-12 rounded-2xl items-center justify-center">
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BRANCHES}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedBranch(item)}
              className={`mr-2 px-6 py-2 rounded-full ${selectedBranch === item ? 'bg-slate-800' : 'bg-white border border-slate-100'}`}
            >
              <Text className={`text-xs font-bold ${selectedBranch === item ? 'text-white' : 'text-slate-500'}`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={tasks.filter(t => selectedBranch === 'All' || t.assigned_to?.branch === selectedBranch)}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View className="bg-white mx-6 mb-4 p-5 rounded-[30px] shadow-sm border border-slate-50">
            <View className="flex-row justify-between">
              <Text className="text-base font-bold text-slate-800">{item.title}</Text>
              <View className="bg-warning/10 px-2 py-1 rounded-md">
                <Text className="text-[10px] text-warning font-black uppercase">{item.status}</Text>
              </View>
            </View>
            <Text className="text-xs text-slate-400 mt-2" numberOfLines={2}>{item.description}</Text>
            <View className="flex-row items-center mt-4 pt-4 border-t border-slate-50">
              <Icon name="account-outline" size={14} color="#64748b" />
              <Text className="text-xs text-slate-500 font-bold ml-2">
                {item.assigned_to?.name || 'Unknown'} · {item.assigned_to?.branch || 'HQ'}
              </Text>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchInitialData} />}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-slate-800">Assign New Task</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Icon name="close" size={24} color="#64748b" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xs font-black text-slate-400 uppercase mb-2">Title</Text>
              <TextInput className="bg-slate-50 p-4 rounded-2xl mb-4 font-bold" value={newTask.title} onChangeText={v => setNewTask({...newTask, title: v})} />

              <Text className="text-xs font-black text-slate-400 uppercase mb-2">Description</Text>
              <TextInput className="bg-slate-50 p-4 rounded-2xl mb-4 font-bold" multiline value={newTask.description} onChangeText={v => setNewTask({...newTask, description: v})} />

              <Text className="text-xs font-black text-slate-400 uppercase mb-4">Select Employee</Text>
              <View className="bg-slate-50 rounded-2xl p-4 h-64 mb-6">
                <FlatList
                  data={employees}
                  keyExtractor={e => e._id}
                  renderItem={({ item: emp }) => (
                    <TouchableOpacity 
                      onPress={() => setNewTask({...newTask, assigned_to: emp._id})}
                      className={`flex-row justify-between p-3 mb-2 rounded-xl ${newTask.assigned_to === emp._id ? 'bg-primary' : 'bg-white'}`}
                    >
                      <Text className={`text-xs font-bold ${newTask.assigned_to === emp._id ? 'text-white' : 'text-slate-700'}`}>{emp.name}</Text>
                      <Text className={`text-[10px] ${newTask.assigned_to === emp._id ? 'text-white/70' : 'text-slate-400'}`}>{emp.branch}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              <TouchableOpacity onPress={handleCreateTask} className="bg-primary py-5 rounded-2xl items-center">
                <Text className="text-white font-black">Assign Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
