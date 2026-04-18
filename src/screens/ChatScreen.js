import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

export default function ChatScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const user = route.params?.user || { username: 'Chat User', avatar: 'https://i.pravatar.cc/150?img=1' };
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState(null);
  
  const [messages, setMessages] = useState([
    { id: '1', type: 'reel', user: 'flexwithmydog', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800', caption: 'Pretty little monster', isMe: false },
    { id: 'date', type: 'date', text: 'Today 9:01 AM' },
    { id: '2', type: 'reel', user: 'cinebodhi.exe', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', caption: 'Peak Childhood Memories 🥹❤️', isMe: false, status: 'Seen 5h ago' }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: message, isMe: true, type: 'text' }]);
      setMessage('');
    }
  };

  const openCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.granted) {
      const res = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
      if (!res.canceled) setMessages(prev => [...prev, { id: Date.now().toString(), type: 'image', image: res.assets[0].uri, isMe: true }]);
    }
  };

  const openGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.granted) {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
      if (!res.canceled) setMessages(prev => [...prev, { id: Date.now().toString(), type: 'image', image: res.assets[0].uri, isMe: true }]);
    }
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'date') return <Text style={styles.dateSeparator}>{item.text}</Text>;
    if (item.type === 'image') return <Image source={{ uri: item.image }} style={[styles.imageMessage, item.isMe ? styles.myImage : styles.theirImage]} />;
    if (item.type === 'reel') {
      return (
        <View style={styles.reelMessageContainer}>
          <View style={styles.reelSideIcons}>
            <TouchableOpacity style={styles.sideIcon}><Ionicons name="paper-plane-outline" size={24} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.sideIcon}><Ionicons name="cut-outline" size={24} color="#fff" /></TouchableOpacity>
          </View>
          <View style={styles.reelBubble}>
            <View style={styles.reelHeader}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=' + item.user }} style={styles.reelAvatar} />
              <Text style={styles.reelUser}>{item.user}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.reelImage} />
            <Text style={styles.reelCaption}>{item.caption}</Text>
          </View>
          {item.status && <Text style={styles.seenStatus}>{item.status}</Text>}
        </View>
      );
    }
    return (
      <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1000' }} style={StyleSheet.absoluteFill}>
        <View style={styles.overlay} />
      </ImageBackground>
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="#fff" /></TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerTitle}>{user.username}</Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" style={{ marginLeft: 5 }} />
            </View>
            <Text style={styles.headerSubtitle}>she____.k</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}><Ionicons name="person-add-outline" size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}><Ionicons name="call-outline" size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}><Ionicons name="videocam-outline" size={26} color="#fff" /></TouchableOpacity>
        </View>
      </View>

      {/* Message List */}
      <FlatList 
        ref={flatListRef}
        data={messages} 
        renderItem={renderMessage} 
        keyExtractor={item => item.id} 
        contentContainerStyle={{ padding: 15, paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        style={{ flex: 1 }}
      />

      {/* Input Bar - proper flex layout, NOT absolute */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity style={styles.blueCamBtn} onPress={openCamera}><Ionicons name="camera" size={22} color="#fff" /></TouchableOpacity>
          <View style={styles.pillContainer}>
            <View style={styles.searchTarget}><Ionicons name="search" size={16} color="#007bff" /></View>
            <TextInput 
              style={styles.input} 
              placeholder="Message..." 
              placeholderTextColor="rgba(255,255,255,0.5)" 
              value={message} 
              onChangeText={setMessage} 
            />
          </View>
          {message.trim().length > 0 ? (
            <TouchableOpacity onPress={sendMessage} style={styles.sendCircle}>
              <Ionicons name="paper-plane" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.rightIcon}><Ionicons name="mic-outline" size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.rightIcon} onPress={openGallery}><Ionicons name="image-outline" size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.rightIcon}><Ionicons name="happy-outline" size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.rightIcon}><Ionicons name="add-circle-outline" size={24} color="#fff" /></TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,10,30,0.5)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  headerAvatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginLeft: 18 },
  dateSeparator: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textAlign: 'center', marginVertical: 30 },
  messageBubble: { padding: 12, borderRadius: 20, maxWidth: '75%', marginVertical: 4 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#3797f0' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)' },
  messageText: { color: '#fff', fontSize: 15 },
  imageMessage: { width: 220, height: 280, borderRadius: 15, marginVertical: 10 },
  myImage: { alignSelf: 'flex-end' },
  theirImage: { alignSelf: 'flex-start' },
  reelMessageContainer: { alignSelf: 'flex-end', width: '82%', marginVertical: 12 },
  reelBubble: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24, overflow: 'hidden', paddingBottom: 12 },
  reelHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  reelAvatar: { width: 20, height: 20, borderRadius: 10, marginRight: 8 },
  reelUser: { color: '#fff', fontWeight: '700', fontSize: 12 },
  reelImage: { width: '100%', height: 300, borderRadius: 10 },
  reelCaption: { color: '#fff', fontSize: 13, paddingHorizontal: 12, marginTop: 10 },
  reelSideIcons: { position: 'absolute', left: -45, top: '40%' },
  sideIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  seenStatus: { alignSelf: 'flex-end', color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  pillContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#333', 
    borderRadius: 25, 
    paddingHorizontal: 8,
    height: 48
  },
  searchTarget: { 
    width: 34, 
    height: 34, 
    backgroundColor: '#fff', 
    borderRadius: 17, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 8
  },
  input: { flex: 1, color: '#fff', fontSize: 16, height: '100%' },
  sendCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#007bff', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 8
  },
  rightIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 5 },
  rightIcon: { marginLeft: 15 }
});
