import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Dimensions, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AuthScreen({ setAuth }) {
  const isDark = useColorScheme() === 'dark';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // High-Fidelity Mock Login using the entered name
    const finalName = username.trim() || 'Alex Johnson';
    const finalUsername = username.trim().toLowerCase().replace(' ', '_') || 'alex_j.99';
    
    setAuth({
      username: finalUsername,
      name: finalName,
      avatar: 'https://i.pravatar.cc/150?img=68',
      bio: 'New profile! 🚀'
    });
  };

  return (
    <LinearGradient colors={['#000', '#1a1a1a']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <Text style={styles.logo}>ReelRush</Text>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=68' }} 
              style={styles.profilePrev} 
            />
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>

          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder="Username, email or mobile number"
              placeholderTextColor="#8e8e8e"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8e8e8e"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgotten password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Log in</Text>
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.line} /><Text style={styles.orText}>OR</Text><View style={styles.line} />
            </View>

            {/* Changed from Facebook to Google */}
            <TouchableOpacity style={styles.googleBtn}>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.googleText}>Log in with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <TouchableOpacity style={styles.signupBtn}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Text style={styles.signupText}>Sign up.</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, justifyContent: 'center' },
  topSection: { alignItems: 'center', marginBottom: 40, marginTop: 50 },
  logo: { fontSize: 42, color: '#fff', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif', marginBottom: 30 },
  profilePrev: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#3797f0', marginBottom: 15 },
  welcomeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  formSection: { width: '100%' },
  input: { backgroundColor: '#262626', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotText: { color: '#3797f0', fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#3797f0', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  orText: { color: '#8e8e8e', marginHorizontal: 15, fontWeight: 'bold' },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 },
  googleText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  footer: { marginTop: 'auto', paddingBottom: 30, alignItems: 'center' },
  footerLine: { width: '100%', height: 1, backgroundColor: '#333', marginBottom: 20 },
  signupBtn: { flexDirection: 'row' },
  footerText: { color: '#8e8e8e' },
  signupText: { color: '#fff', fontWeight: 'bold' }
});
