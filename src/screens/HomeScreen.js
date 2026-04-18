import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, useColorScheme, TouchableOpacity, Text, ScrollView, Platform, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, darkColors } from '../theme/colors';
import Post from '../components/Post';
import StoryCircle from '../components/StoryCircle';
import { useSocial } from '../context/SocialContext';

const DUMMY_STORIES = [
  { id: '1', user: { username: 'Your Story', avatar: 'https://i.pravatar.cc/150?img=68' }, hasViewed: true, isUser: true },
  { id: '2', user: { username: 'alex_dev', avatar: 'https://i.pravatar.cc/150?img=11' }, hasViewed: false },
  { id: '3', user: { username: 'jessica.k', avatar: 'https://i.pravatar.cc/150?img=5' }, hasViewed: false },
  { id: '4', user: { username: 'michael_99', avatar: 'https://i.pravatar.cc/150?img=8' }, hasViewed: true },
  { id: '5', user: { username: 'sarah_styles', avatar: 'https://i.pravatar.cc/150?img=9' }, hasViewed: false },
];

const AVATARS = [11, 9, 12, 43, 52, 33, 5, 8, 20, 22, 25, 30, 35, 40, 45, 48, 50, 55, 60, 65];
const USERNAMES = [
  'alex_dev', 'sarah_styles', 'travel_buddy', 'foodie_vibes', 'tech_guru',
  'nature_lover', 'code_master', 'city_explorer', 'art_queen', 'fitness_pro',
  'music_soul', 'photo_daily', 'sky_gazer', 'game_on', 'coffee_addict',
  'sunset_chaser', 'book_worm', 'chef_life', 'yoga_peace', 'pet_lover'
];
const CAPTIONS = [
  'Working on a new React Native project today! 🚀 #coding #reactnative',
  'Coffee shop vibes ☕️✨',
  'Lost in the mountains. ⛰️',
  'Healthy lunch today! 🥗 #foodporn',
  'My new desk setup is finally complete! 💻🔥',
  'Golden hour magic ✨🌅',
  'Weekend getaway 🏖️',
  'New beginnings 🌱',
  'Studio session tonight 🎵🎧',
  'Morning run done! 🏃‍♂️💪',
  'This view though 😍',
  'Art exhibition vibes 🎨',
  'Late night coding session 💻🌙',
  'Beach day with friends 🌊☀️',
  'Exploring hidden gems 📍',
  'Fresh flowers always make my day 🌸',
  'That sunset was unreal 🌇',
  'New recipe alert! 🍝👨‍🍳',
  'Morning meditation 🧘‍♀️✨',
  'Puppy love 🐶❤️',
];
const IMAGES = [
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
];

const TIMES = ['1 min ago', '5 min ago', '15 min ago', '30 min ago', '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago', '8 hours ago', '12 hours ago', '1 day ago', '2 days ago', '3 days ago', '4 days ago', '5 days ago', '1 week ago'];

const generatePosts = (startId, count) => {
  return Array.from({ length: count }).map((_, i) => {
    const idx = (startId + i) % USERNAMES.length;
    return {
      id: String(startId + i),
      user: {
        username: USERNAMES[idx],
        avatar: `https://i.pravatar.cc/150?img=${AVATARS[idx]}`,
      },
      image: IMAGES[(startId + i) % IMAGES.length],
      caption: CAPTIONS[(startId + i) % CAPTIONS.length],
      likes: Math.floor(Math.random() * 2000) + 10,
      isLiked: Math.random() > 0.7,
      timestamp: TIMES[(startId + i) % TIMES.length],
    };
  });
};

export default function HomeScreen({ navigation }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;
  const insets = useSafeAreaInsets();
  const { posts } = useSocial();

  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedPosts, setFeedPosts] = useState(() => generatePosts(0, 10));

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Shuffle: generate new posts starting from a random offset
      const offset = Math.floor(Math.random() * USERNAMES.length);
      setFeedPosts(generatePosts(offset, 10));
      setRefreshing(false);
    }, 800);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setLoadingMore(false);
    }, 600);
  }, [loadingMore]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingHorizontal: 15, 
      paddingTop: insets.top + 10,
      paddingBottom: 10,
      backgroundColor: c.background,
      zIndex: 100
    },
    logo: {
      fontSize: 28,
      fontWeight: 'bold',
      color: c.text,
      fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginLeft: 20,
    },
    suggestedContainer: {
      paddingVertical: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
      backgroundColor: isDark ? '#121212' : '#fafafa',
    },
    suggestedTitle: {
      color: c.text,
      fontWeight: 'bold',
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    suggestedCard: {
      width: 150,
      backgroundColor: c.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      padding: 15,
      alignItems: 'center',
      marginLeft: 15,
    },
    suggestedAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 10,
    },
    suggestedUsername: {
      color: c.text,
      fontWeight: 'bold',
      fontSize: 13,
    },
    suggestedFollowBtn: {
      backgroundColor: c.primary,
      paddingHorizontal: 20,
      paddingVertical: 6,
      borderRadius: 5,
      marginTop: 10,
    },
    suggestedFollowText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
    loadingContainer: {
      paddingVertical: 30,
      alignItems: 'center',
    }
  });

  const renderHeader = () => (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
        {DUMMY_STORIES.map(story => (
          <StoryCircle
            key={story.id}
            user={story.user}
            hasViewed={story.hasViewed}
            isUserStory={story.isUser}
            onPress={() => navigation.navigate('StoryViewer', { initialIndex: DUMMY_STORIES.indexOf(story), allStories: DUMMY_STORIES })}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.logo}>ReelRush</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={{ marginLeft: 10 }}>
            <Ionicons name="add-circle-outline" size={28} color={c.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="heart-outline" size={26} color={c.text} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="paper-plane-outline" size={26} color={c.text} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={[...posts, ...feedPosts]}
        keyExtractor={(item, index) => item.id + '_' + index}
        renderItem={({ item, index }) => (
          <View>
            <Post post={item} />
            {index === 1 && (
              <View style={styles.suggestedContainer}>
                <Text style={styles.suggestedTitle}>Suggested for you</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {USERNAMES.slice(5, 12).map((username, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={styles.suggestedCard}
                      onPress={() => navigation.navigate('UserProfile', { 
                        user: { 
                          username: username, 
                          avatar: `https://i.pravatar.cc/150?img=${AVATARS[i + 5]}` 
                        } 
                      })}
                    >
                      <Image source={{ uri: `https://i.pravatar.cc/150?img=${AVATARS[i + 5]}` }} style={styles.suggestedAvatar} />
                      <Text style={styles.suggestedUsername} numberOfLines={1}>{username}</Text>
                      <TouchableOpacity style={styles.suggestedFollowBtn} onPress={() => Alert.alert('Follow', 'You are now following @' + username)}>
                        <Text style={styles.suggestedFollowText}>Follow</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={c.primary}
            colors={[c.primary]}
          />
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={c.primary} />
            <Text style={{ color: c.textSecondary, marginTop: 10, fontSize: 12 }}>Loading more posts...</Text>
          </View>
        ) : null}
      />
    </View>
  );
}
