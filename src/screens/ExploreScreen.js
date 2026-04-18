import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, useColorScheme, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, darkColors } from '../theme/colors';
import Post from '../components/Post';

const { width } = Dimensions.get('window');

const NATURE_IMAGES = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800',
];

const SUGGESTIONS = [
  { id: '1', username: 'sunset_lover', name: 'Golden Hour', avatar: 'https://i.pravatar.cc/150?u=122' },
  { id: '2', username: 'mountain_man', name: 'Climber Joe', avatar: 'https://i.pravatar.cc/150?u=123' },
  { id: '3', username: 'forest_soul', name: 'Woods Wanderer', avatar: 'https://i.pravatar.cc/150?u=124' },
  { id: '4', username: 'ocean_drifter', name: 'Coral Queen', avatar: 'https://i.pravatar.cc/150?u=125' },
];

const USERNAMES = ['alex_dev', 'sarah_styles', 'travel_buddy', 'roja_official', 'roja_vibe', 'tech_guru'];

const RAW_DATA = Array.from({ length: 40 }).map((_, i) => ({
  id: 'exp_' + i,
  type: i % 3 === 0 ? 'reel' : 'post',
  image: i === 3 ? 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=800' : NATURE_IMAGES[i % NATURE_IMAGES.length],
  caption: i % 3 === 0 ? 'Amazing Reel! 🎬 #Reels' : 'Peaceful moments in nature... 🌿 #Nature',
  user: {
    username: USERNAMES[i % USERNAMES.length],
    avatar: `https://i.pravatar.cc/150?u=${i}`,
  },
  likes: 1200 + (i * 10),
  timestamp: '4h',
}));

export default function ExploreScreen({ navigation }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    let data = RAW_DATA;
    if (activeTab === 'reels') data = RAW_DATA.filter(item => item.type === 'reel');
    else if (activeTab === 'post') data = RAW_DATA.filter(item => item.type === 'post');

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item => 
        item.user.username.toLowerCase().includes(query) ||
        item.caption.toLowerCase().includes(query)
      );
    }
    return data;
  }, [activeTab, searchQuery]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: { paddingHorizontal: 15, paddingTop: insets.top + 10, paddingBottom: 10 },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#262626' : '#efefef',
      marginHorizontal: 15,
      paddingHorizontal: 12,
      borderRadius: 10,
      height: 40,
      marginBottom: 15,
    },
    searchInput: { flex: 1, marginLeft: 8, color: c.text, fontSize: 14 },
    tabs: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 15 },
    tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10, backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0', borderWidth: 1, borderColor: c.border },
    activeTab: { backgroundColor: c.text, borderColor: c.text },
    tabText: { color: c.text, fontWeight: 'bold' },
    activeTabText: { color: c.background },
    img: { width: width / 3 - 1, height: width / 3 - 1, margin: 0.5 },
  });

  if (selectedPost) {
    const initialIndex = filteredData.findIndex(p => p.id === selectedPost.id);
    return (
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <TouchableOpacity 
          onPress={() => setSelectedPost(null)} 
          style={{ padding: 15, paddingTop: insets.top + 10, flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={26} color={c.text} />
          <Text style={{ color: c.text, fontSize: 18, fontWeight: 'bold', marginLeft: 20 }}>Explore</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredData}
          initialScrollIndex={initialIndex !== -1 ? initialIndex : 0}
          getItemLayout={(data, index) => ({ length: 600, offset: 600 * index, index })}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={item => 'full_' + item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: c.text, fontSize: 24, fontWeight: 'bold' }}>Explore</Text>
      </View>

      <View style={styles.searchBar}>
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={22} color={c.text} />
          </TouchableOpacity>
        )}
        <Ionicons name="search" size={18} color={c.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search or ask Meta AI"
          placeholderTextColor={c.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {!searchQuery && (
              <View style={styles.tabs}>
                {[{ id: 'all', label: 'All' }, { id: 'post', label: 'Posts' }, { id: 'reels', label: 'Reels' }].map(t => (
                  <TouchableOpacity key={t.id} style={[styles.tab, activeTab === t.id && styles.activeTab]} onPress={() => setActiveTab(t.id)}>
                    <Text style={[styles.tabText, activeTab === t.id && styles.activeTabText]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        }
        key={activeTab}
        data={filteredData}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedPost(item)}>
            <View>
              <Image source={{ uri: item.image }} style={styles.img} />
              {item.type === 'reel' && (
                <Ionicons name="play" size={18} color="white" style={{ position: 'absolute', top: 5, right: 5 }} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
