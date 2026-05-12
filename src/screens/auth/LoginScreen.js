import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-6 py-10"
      >
        {/* Header / Logo Section */}
        <View className="items-center mt-12 mb-10">
          <View className="bg-primary p-5 rounded-3xl shadow-lg shadow-primary/30">
            <Icon name="shield-account" size={50} color="white" />
          </View>
          <Text className="text-3xl font-bold text-primary mt-6 tracking-tight">
            FIC Portal
          </Text>
          <Text className="text-muted-foreground mt-2 text-center">
            Professional Employee Access
          </Text>
        </View>
        
        {/* Login Form */}
        <View className="space-y-5">
          {/* Email Field */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-white border border-border rounded-2xl px-4 py-1 shadow-sm">
              <Icon name="email-outline" size={20} color="#64748b" />
              <TextInput
                className="flex-1 h-12 ml-3 text-foreground text-base"
                placeholder="name@company.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          {/* Password Field */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Password</Text>
            <View className="flex-row items-center bg-white border border-border rounded-2xl px-4 py-1 shadow-sm">
              <Icon name="lock-outline" size={20} color="#64748b" />
              <TextInput
                className="flex-1 h-12 ml-3 text-foreground text-base"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity className="self-end mt-1">
            <Text className="text-primary font-semibold text-sm">Forgot Password?</Text>
          </TouchableOpacity>
          
          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
            className={`mt-6 py-4 rounded-2xl items-center shadow-md shadow-primary/20 ${
              loading ? 'bg-primary/70' : 'bg-primary'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Footer */}
        <View className="mt-auto pt-10 items-center">
          <Text className="text-muted-foreground text-xs">
            © 2026 Agila Learning. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
