import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme, Modal, TextInput, FlatList, Share, Alert, KeyboardAvoidingView, Platform, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useSocial } from '../context/SocialContext';
import { colors, darkColors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function Post({ post }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;
  const navigation = useNavigation();
  const { addComment, blockUser } = useSocial();
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [newComment, setNewComment] = useState('');

  const SHARE_ACCOUNTS = [
    { username: 'sarah_styles',   avatar: 'https://i.pravatar.cc/150?img=5'  },
    { username: 'travel_buddy',   avatar: 'https://i.pravatar.cc/150?img=15' },
    { username: 'nature_lover',   avatar: 'https://i.pravatar.cc/150?img=32' },
    { username: 'code_master',    avatar: 'https://i.pravatar.cc/150?img=18' },
    { username: 'photo_queen',    avatar: 'https://i.pravatar.cc/150?img=47' },
    { username: 'fun_world',      avatar: 'https://i.pravatar.cc/150?img=25' },
  ];
  const [shareSearch, setShareSearch] = useState('');
  const [sentTo, setSentTo] = useState([]);
  
  // Double Tap Heart Animation
  const heartScale = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const animateHeart = () => {
    heartScale.setValue(0);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 0, duration: 200, useNativeDriver: true, delay: 500 }),
    ]).start();
  };

  const toggleLike = (forceLike = false) => {
    if (forceLike) {
      if (!liked) {
        setLikesCount(p => p + 1);
        setLiked(true);
      }
      animateHeart();
    } else {
      if (liked) setLikesCount(p => p - 1);
      else {
        setLikesCount(p => p + 1);
        animateHeart();
      }
      setLiked(!liked);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      toggleLike(true);
    } else {
      lastTap.current = now;
    }
  };

  const postComment = () => {
    if (!newComment.trim()) return;
    const commentObj = { id: Date.now().toString(), user: 'you', text: newComment };
    addComment(post.id, commentObj);
    setNewComment('');
  };

  const goToProfile = () => {
    navigation.navigate('MainSplit', { 
      screen: 'Profile', 
      params: { username: post.user.username } 
    });
  };

  const styles = StyleSheet.create({
    container: { marginBottom: 20, backgroundColor: c.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: 12, justifyContent: 'space-between' },
    avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
    username: { color: c.text, fontWeight: 'bold', fontSize: 13 },
    mediaContainer: { width: width, height: width, backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    media: { width: '100%', height: '100%' },
    muteButton: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 5 },
    likes: { color: c.text, fontWeight: 'bold', paddingHorizontal: 12, fontSize: 13, marginBottom: 4 },
    caption: { color: c.text, paddingHorizontal: 12, fontSize: 13, lineHeight: 18 },
    time: { color: c.textSecondary, fontSize: 11, paddingHorizontal: 12, marginTop: 6, textTransform: 'uppercase' },
    optionBox: { flex: 1, backgroundColor: isDark ? '#262626' : '#fff', padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
    optionText: { color: c.text, fontSize: 12, marginTop: 8 }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={goToProfile}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{post.user.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowOptions(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={c.text} />
        </TouchableOpacity>
      </View>
      
      {/* Media */}
      <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap} style={styles.mediaContainer}>
        {post.type === 'reel' ? (
          <>
            <Video 
              source={{ uri: post.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4' }} 
              style={styles.media} 
              resizeMode={ResizeMode.COVER} 
              isLooping 
              shouldPlay 
              isMuted={isMuted}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
            />
            {loading && (
              <View style={StyleSheet.absoluteFill}>
                <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
              </View>
            )}
            <TouchableOpacity style={styles.muteButton} onPress={() => setIsMuted(!isMuted)}>
              <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={18} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <Image source={{ uri: post.image }} style={styles.media} />
        )}
        
        {/* Animated Heart Popup */}
        <Animated.View style={{ position: 'absolute', pointerEvents: 'none', transform: [{ scale: heartScale }] }}>
          <Ionicons name="heart" size={120} color="rgba(255,255,255,0.9)" />
        </Animated.View>
      </TouchableOpacity>

      {/* Interactions */}
      <View style={{ flexDirection: 'row', padding: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => toggleLike(false)}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={28} color={liked ? "#ed4956" : c.text} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={26} color={c.text} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowShare(true)}>
            <Ionicons name="paper-plane-outline" size={26} color={c.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { setSaved(!saved); if(!saved) Alert.alert('Saved', 'Post added to your saved collection.'); }}>
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={26} color={c.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.likes}>{likesCount.toLocaleString()} likes</Text>
      <Text style={styles.caption}>
        <Text style={{ fontWeight: 'bold' }}>{post.user.username} </Text>
        {post.caption}
      </Text>
      <Text style={styles.time}>{post.timestamp || '4h ago'}</Text>

      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide" transparent>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={() => setShowComments(false)}>
          <View style={{ position: 'absolute', bottom: 0, height: '70%', width: '100%', backgroundColor: c.background, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginVertical: 10 }} />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: c.text, paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: c.border }}>Comments</Text>
            
            <FlatList
              data={post.comments}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 15 }}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                  <Text style={{ color: c.text, fontWeight: 'bold', marginRight: 10 }}>{item.user}</Text>
                  <Text style={{ color: c.text, flex: 1 }}>{item.text}</Text>
                </View>
              )}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ padding: 10, borderTopWidth: 0.5, borderTopColor: c.border, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TextInput 
                placeholder="Add a comment..." 
                placeholderTextColor={c.textSecondary}
                style={{ flex: 1, color: c.text, paddingHorizontal: 15, height: 40 }}
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={postComment}>
                <Text style={{ color: c.primary, fontWeight: 'bold', marginRight: 10 }}>Post</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Options Modal (Screenshot Match) */}
      <Modal visible={showOptions} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={() => setShowOptions(false)}>
          <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 }}>
            <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <View style={styles.optionBox}><Ionicons name="bookmark-outline" size={24} color={c.text} /><Text style={styles.optionText}>Save</Text></View>
              <View style={styles.optionBox}><Ionicons name="repeat-outline" size={24} color={c.text} /><Text style={styles.optionText}>Remix</Text></View>
              <View style={styles.optionBox}><Ionicons name="qr-code-outline" size={24} color={c.text} /><Text style={styles.optionText}>QR code</Text></View>
            </View>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: c.border }}>
              <Ionicons name="eye-off-outline" size={24} color={c.text} style={{ marginRight: 15 }} />
              <Text style={{ color: c.text, fontSize: 16 }}>Hide</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: c.border }}>
              <Ionicons name="person-circle-outline" size={24} color={c.text} style={{ marginRight: 15 }} />
              <Text style={{ color: c.text, fontSize: 16 }}>About this account</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}
              onPress={() => { setShowOptions(false); Alert.alert('Blocked', 'This user has been blocked.'); blockUser(post.user.username); }}
            >
              <Ionicons name="ban-outline" size={24} color="#ff3b30" style={{ marginRight: 15 }} />
              <Text style={{ color: '#ff3b30', fontSize: 16, fontWeight: 'bold' }}>Block</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
              <Ionicons name="alert-circle-outline" size={24} color="#ff3b30" style={{ marginRight: 15 }} />
              <Text style={{ color: '#ff3b30', fontSize: 16, fontWeight: 'bold' }}>Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Share Modal */}
      <Modal visible={showShare} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={() => { setShowShare(false); setSentTo([]); setShareSearch(''); }}>
          <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 15, paddingBottom: 30 }}>
            <View style={{ width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginBottom: 15 }} />
            <Text style={{ color: c.text, fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 15 }}>Share</Text>

            {/* Search bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#333' : '#f0f0f0', borderRadius: 12, marginHorizontal: 15, paddingHorizontal: 10, marginBottom: 15 }}>
              <Ionicons name="search" size={16} color={c.textSecondary} />
              <TextInput placeholder="Search" placeholderTextColor={c.textSecondary} value={shareSearch} onChangeText={setShareSearch} style={{ flex: 1, color: c.text, paddingVertical: 8, paddingHorizontal: 8, fontSize: 14 }} />
            </View>

            {/* Account list */}
            <FlatList
              horizontal
              data={SHARE_ACCOUNTS.filter(a => a.username.includes(shareSearch.toLowerCase()))}
              keyExtractor={item => item.username}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ alignItems: 'center', marginRight: 20, opacity: sentTo.includes(item.username) ? 0.5 : 1 }}
                  onPress={() => {
                    if (!sentTo.includes(item.username)) setSentTo(p => [...p, item.username]);
                  }}
                >
                  <View style={{ position: 'relative' }}>
                    <Image source={{ uri: item.avatar }} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: sentTo.includes(item.username) ? 2.5 : 0, borderColor: '#3797f0' }} />
                    {sentTo.includes(item.username) && (
                      <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3797f0', borderRadius: 10, padding: 2 }}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={{ color: c.text, fontSize: 12, marginTop: 6, maxWidth: 70 }} numberOfLines={1}>{item.username}</Text>
                  <Text style={{ color: sentTo.includes(item.username) ? '#3797f0' : c.textSecondary, fontSize: 11 }}>{sentTo.includes(item.username) ? 'Sent' : 'Send'}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingHorizontal: 15 }}>
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => Share.share({ message: `Check out @${post.user.username}'s post on ReelRush!` })}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isDark ? '#333' : '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                  <Ionicons name="link" size={24} color={c.text} />
                </View>
                <Text style={{ color: c.text, fontSize: 12 }}>Copy link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isDark ? '#333' : '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                  <Ionicons name="chatbubble-outline" size={24} color={c.text} />
                </View>
                <Text style={{ color: c.text, fontSize: 12 }}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isDark ? '#333' : '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                </View>
                <Text style={{ color: c.text, fontSize: 12 }}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isDark ? '#333' : '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                  <Ionicons name="share-social-outline" size={24} color={c.text} />
                </View>
                <Text style={{ color: c.text, fontSize: 12 }}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
