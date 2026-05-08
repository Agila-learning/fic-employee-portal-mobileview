import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/tasks/employee'); // Assuming this endpoint exists
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.log('Error fetching tasks', error);
      // Fallback dummy data for demo purposes if backend endpoint is different
      setTasks([
        { _id: '1', title: 'Complete monthly report', description: 'Compile the sales data for October.', status: 'Pending', dueDate: '2023-11-05' },
        { _id: '2', title: 'Client meeting prep', description: 'Prepare slides for the ABC Corp meeting.', status: 'In Progress', dueDate: '2023-10-28' },
        { _id: '3', title: 'Update internal CRM', description: 'Add new lead details.', status: 'Completed', dueDate: '2023-10-20' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTask = ({ item }) => (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold text-gray-800 flex-1 pr-2">{item.title}</Text>
        <View className={`px-2 py-1 rounded-md ${getStatusColor(item.status).split(' ')[0]}`}>
          <Text className={`text-xs font-bold ${getStatusColor(item.status).split(' ')[1]}`}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 mb-3">{item.description}</Text>
      <View className="flex-row items-center mt-2 border-t border-gray-100 pt-3">
        <Icon name="calendar-clock" size={16} color="#6b7280" />
        <Text className="text-xs text-gray-500 ml-1">Due: {item.dueDate}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-primary">My Tasks</Text>
        <TouchableOpacity onPress={fetchTasks} className="p-2 bg-white rounded-full shadow-sm">
          <Icon name="refresh" size={24} color="#1A365D" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A365D" className="mt-10" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item._id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Icon name="clipboard-check-outline" size={60} color="#cbd5e1" />
              <Text className="text-gray-400 text-lg mt-4">No tasks assigned to you</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
