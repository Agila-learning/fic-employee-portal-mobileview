import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50 justify-center p-6"
    >
      <View className="mb-10 items-center">
        <View className="bg-primary rounded-full p-4 mb-4">
          <Icon name="shield-account" size={50} color="white" />
        </View>
        <Text className="text-3xl font-bold text-primary">FIC Portal</Text>
        <Text className="text-gray-500 mt-2">Employee Mobile Access</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 font-medium mb-1">Email</Text>
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3">
            <Icon name="email-outline" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-black"
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <Text className="text-gray-700 font-medium mb-1">Password</Text>
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3">
            <Icon name="lock-outline" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-black"
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-primary rounded-lg py-4 mt-4 flex-row justify-center items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
