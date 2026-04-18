import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 3) / 3;

const DUMMY_POSTS = Array.from({ length: 9 }).map((_, i) => ({
  id: String(i),
  image: `https://picsum.photos/300/300?random=${i + 200}`,
}));

export default function UserProfileScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);

  const followers = Math.floor(Math.random() * 5000) + 300;
  const following = Math.floor(Math.random() * 500) + 50;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.topRow}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{DUMMY_POSTS.length}</Text>
                <Text style={styles.statLabel}>posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{following}</Text>
                <Text style={styles.statLabel}>following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.bio}>✨ Living my best life | 📍 Somewhere cool</Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.messageBtn}
              onPress={() => navigation.navigate('Chat', { user })}
            >
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="person-add-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid Divider */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.activeTab}>
            <Ionicons name="grid-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="person-outline" size={24} color="#8e8e8e" />
          </TouchableOpacity>
        </View>

        {/* Post Grid */}
        <FlatList
          data={DUMMY_POSTS}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.gridImage} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1.5 }} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  profileSection: { padding: 15 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 2, borderColor: '#333' },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginLeft: 20 },
  statItem: { alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#fff', fontSize: 13 },
  name: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 5 },
  bio: { color: '#ccc', fontSize: 13, marginBottom: 15, lineHeight: 18 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  followBtn: { flex: 1, backgroundColor: '#3797f0', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  followingBtn: { backgroundColor: '#262626', borderWidth: 1, borderColor: '#555' },
  followBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  followingBtnText: { color: '#fff' },
  messageBtn: { flex: 1, backgroundColor: '#262626', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  messageBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  moreBtn: { backgroundColor: '#262626', padding: 8, borderRadius: 8 },
  tabRow: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#333' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: '#fff' },
  gridImage: { width: GRID_SIZE, height: GRID_SIZE, marginRight: 1.5 },
});
