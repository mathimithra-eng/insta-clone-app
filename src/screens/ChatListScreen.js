import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, useColorScheme, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, darkColors } from '../theme/colors';

const DUMMY_CHATS = [
  { id: '1', user: { username: 'Alex Johnson 🌟', avatar: 'https://i.pravatar.cc/150?img=11' }, lastMessage: 'Reacted 😂 to your message', time: '3h', unread: false },
  { id: '2', user: { username: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?img=9' }, lastMessage: 'Seen 5h ago', time: '', unread: false },
  { id: '3', user: { username: 'Tech Hub ⚡️', avatar: 'https://i.pravatar.cc/150?img=4' }, lastMessage: 'Sent 6h ago', time: '', unread: false },
  { id: '4', user: { username: 'Nature Pix 🌿', avatar: 'https://i.pravatar.cc/150?img=12' }, lastMessage: 'Seen by Mike + 21', time: '', unread: false },
  { id: '5', user: { username: 'Marcus_Dev', avatar: 'https://i.pravatar.cc/150?img=8' }, lastMessage: 'Sent a reel by dev_mark', time: '17h', unread: false },
  { id: '6', user: { username: 'Daily News Hub', avatar: 'https://i.pravatar.cc/150?img=20' }, lastMessage: 'Sent a reel by news_daily', time: '17h', unread: false },
];

const NOTES = [
  { id: '1', username: 'Your Note', avatar: 'https://i.pravatar.cc/150?img=68', note: 'metro pro... \n Sai Abhyan...', isMe: true },
  { id: '2', username: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=11', note: 'akkavillaya... \n Anirudh Ra... 💗' },
  { id: '3', username: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?img=9', note: 'ai Kaanadh... \n Shankar Eh...' },
  { id: '4', username: 'Elena_Vibes', avatar: 'https://i.pravatar.cc/150?img=25', note: 's To Your... \n Alessia Cara 🖤' },
];

export default function ChatListScreen({ navigation }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color={c.text} /></TouchableOpacity>
        <TouchableOpacity style={styles.headerUser}>
          <Text style={styles.headerTitle}>mathii_04._</Text>
          <Ionicons name="chevron-down" size={16} color={c.text} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
        <TouchableOpacity><Ionicons name="create-outline" size={28} color={c.text} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={c.textSecondary} />
          <TextInput placeholder="Search or ask Meta AI" placeholderTextColor={c.textSecondary} style={styles.searchInput} />
        </View>

        {/* Notes */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.notesList}>
          {NOTES.map(item => (
            <View key={item.id} style={styles.noteItem}>
              <View>
                <Image source={{ uri: item.avatar }} style={styles.noteAvatar} />
                <View style={styles.noteBubble}>
                   <View style={styles.noteIconRow}><Ionicons name="musical-notes" size={10} color={c.text} /><Text style={styles.noteText} numberOfLines={2}>{item.note}</Text></View>
                </View>
                {item.isMe && <View style={styles.myNoteIcon}><Ionicons name="location-outline" size={10} color="red" /><Text style={{ color: 'red', fontSize: 8 }}>Location off</Text></View>}
              </View>
              <Text style={styles.noteUsername} numberOfLines={1}>{item.username}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity><Text style={styles.requestsText}>Requests</Text></TouchableOpacity>
        </View>

        {/* Chats */}
        {DUMMY_CHATS.map(item => (
          <TouchableOpacity key={item.id} style={styles.chatItem} onPress={() => navigation.navigate('Chat', { user: item.user })}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.username}>{item.user.username}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage} {item.time ? '• ' + item.time : ''}
              </Text>
            </View>
            <TouchableOpacity><Ionicons name="camera-outline" size={28} color={c.text} /></TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, paddingTop: 50 },
  headerUser: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  searchContainer: { margin: 15, flexDirection: 'row', backgroundColor: '#1c1c1c', borderRadius: 12, padding: 10, alignItems: 'center' },
  searchInput: { marginLeft: 10, color: '#fff', flex: 1 },
  notesList: { paddingHorizontal: 15, marginBottom: 20 },
  noteItem: { alignItems: 'center', marginRight: 20, width: 80 },
  noteAvatar: { width: 70, height: 70, borderRadius: 35 },
  noteBubble: { position: 'absolute', top: -5, left: -5, backgroundColor: '#262626', padding: 8, borderRadius: 15, borderWidth: 1, borderColor: '#333', maxWidth: 90 },
  noteIconRow: { flexDirection: 'row', alignItems: 'flex-start' },
  noteText: { color: '#fff', fontSize: 10, marginLeft: 5 },
  noteUsername: { color: '#8e8e8e', fontSize: 11, marginTop: 8 },
  myNoteIcon: { position: 'absolute', bottom: -5, left: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 2, borderRadius: 5 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 15 },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  requestsText: { color: '#3797f0', fontWeight: 'bold' },
  chatItem: { flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 12, alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  chatInfo: { flex: 1 },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  lastMessage: { color: '#8e8e8e', fontSize: 14 }
});
