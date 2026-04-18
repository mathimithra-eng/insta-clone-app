import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CallScreen({ route, navigation }) {
  const { user, type } = route.params;
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={styles.container}>
      {/* Background Image Blurred */}
      <Image source={{ uri: user.avatar }} style={StyleSheet.absoluteFill} blurRadius={10} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />

      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.encrypted}>
            <Ionicons name="lock-closed" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={styles.encryptedText}>End-to-end encrypted</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.callStatus}>{callTime > 0 ? formatTime(callTime) : 'Calling...'}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsSpeaker(!isSpeaker)}>
              <View style={[styles.iconCircle, isSpeaker && styles.activeIcon]}>
                <Ionicons name="volume-high" size={28} color="#fff" />
              </View>
              <Text style={styles.controlLabel}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <View style={styles.iconCircle}>
                <Ionicons name="videocam" size={28} color="#fff" />
              </View>
              <Text style={styles.controlLabel}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsMuted(!isMuted)}>
              <View style={[styles.iconCircle, isMuted && styles.activeIcon]}>
                <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
              </View>
              <Text style={styles.controlLabel}>Mute</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.endCallBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, justifyContent: 'space-between' },
  header: { padding: 20, alignItems: 'center' },
  encrypted: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  encryptedText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 5 },
  userInfo: { alignItems: 'center', marginTop: 50 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  username: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  callStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 18, marginTop: 10 },
  footer: { paddingBottom: 50, alignItems: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
  controlBtn: { alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  activeIcon: { backgroundColor: 'rgba(255,255,255,0.4)' },
  controlLabel: { color: '#fff', fontSize: 12 },
  endCallBtn: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#ff3b30', justifyContent: 'center', alignItems: 'center' }
});
