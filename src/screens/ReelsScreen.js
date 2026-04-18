import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Share, ActivityIndicator, Animated, Modal, TextInput, KeyboardAvoidingView, Platform, Switch, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Using W3Schools/MDN hosted videos — most reliable for all networks
const ALL_VIDEOS = [
  { id: '1', url: 'https://www.w3schools.com/html/mov_bbb.mp4',                                                      poster: 'https://picsum.photos/seed/bbb/800/1200',  username: 'cartoon_love',   avatar: 'https://i.pravatar.cc/150?img=9',  desc: 'Big Buck Bunny classic 🐰🎬 #Animation #Fun',         likes: 890,  comments: '4.2K', isLiked: false },
  { id: '2', url: 'https://www.w3schools.com/html/movie.mp4',                                                        poster: 'https://picsum.photos/seed/mov/800/1200',  username: 'nature_vibes',   avatar: 'https://i.pravatar.cc/150?img=11', desc: 'Nature vibes all day 🌿🌊 #Nature #Chill',          likes: 1240, comments: '8.5K', isLiked: false },
  { id: '3', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',                       poster: 'https://picsum.photos/seed/flower/800/1200',username: 'flora_daily',    avatar: 'https://i.pravatar.cc/150?img=12', desc: 'Spring is in the air! 🌸🌿 #Nature',               likes: 2100, comments: '11K',  isLiked: true  },
  { id: '4', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',                       poster: 'https://picsum.photos/seed/fri/800/1200',  username: 'weekend_mood',   avatar: 'https://i.pravatar.cc/150?img=15', desc: 'Friday feelings 🔥 #Weekend #Mood',                    likes: 3400, comments: '22K',  isLiked: false },
  { id: '5', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',          poster: 'https://picsum.photos/seed/blaze/800/1200',username: 'fire_shots',     avatar: 'https://i.pravatar.cc/150?img=20', desc: 'Watch this fire art 🔥🎨 #Wow',                    likes: 5600, comments: '31K',  isLiked: false },
  { id: '6', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',         poster: 'https://picsum.photos/seed/esc/800/1200',  username: 'adventure_time', avatar: 'https://i.pravatar.cc/150?img=22', desc: 'Epic escape moments 🏃 #Thrills',                    likes: 980,  comments: '6.1K', isLiked: true  },
  { id: '7', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',             poster: 'https://picsum.photos/seed/fun/800/1200',  username: 'fun_world',      avatar: 'https://i.pravatar.cc/150?img=25', desc: 'Having the time of my life 🎉😄 #Vibes',           likes: 7200, comments: '43K',  isLiked: false },
  { id: '8', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',      poster: 'https://picsum.photos/seed/vw/800/1200',   username: 'car_fan',        avatar: 'https://i.pravatar.cc/150?img=15', desc: 'GTI Review - what a beast! 🚘💥 #Cars',           likes: 3400, comments: '22K',  isLiked: false },
];

const getShuffled = (n = 5) => {
  return [...ALL_VIDEOS].sort(() => Math.random() - 0.5).slice(0, n).map((v, i) => ({ ...v, id: v.id + '_' + i + '_' + Date.now() }));
};


function ReelItem({ item, isActive }) {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);

  // Manually control playback — more reliable than shouldPlay prop on Android
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive && !isPaused) {
      videoRef.current.playAsync().catch(() => {});
    } else {
      videoRef.current.pauseAsync().catch(() => {});
    }
  }, [isActive, isPaused]);

  // Auto-hide loader after 6 seconds max
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(t);
  }, [item.url]);

  const handleTap = () => {
    if (isActive) setIsPaused(p => !p);
  };
  
  const heartScale = useRef(new Animated.Value(0)).current;

  const animateHeart = () => {
    heartScale.setValue(0);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 0, duration: 200, useNativeDriver: true, delay: 500 }),
    ]).start();
  };

  const toggleLike = () => {
    if (!isLiked) {
      animateHeart();
      setLikesCount(p => p + 1);
    } else {
      setLikesCount(p => p - 1);
    }
    setIsLiked(!isLiked);
  };

  const [commentsList, setCommentsList] = useState([
    { id: '1', user: 'alex_dev', text: 'Amazing video! 🔥' },
    { id: '2', user: 'sarah_styles', text: 'Wow ❤️' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      user: 'stg_user',
      text: newComment
    };
    setCommentsList([comment, ...commentsList]);
    setNewComment('');
  };

  return (
    <View style={styles.reelContainer}>
      <TouchableOpacity activeOpacity={1} onPress={handleTap} style={StyleSheet.absoluteFill}>
        <Video
          ref={videoRef}
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive && !isPaused}
          isLooping
          isMuted={false}
          rate={1.0}
          volume={1.0}
          posterSource={{ uri: item.poster }}
          usePoster={loading}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onReadyForDisplay={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </TouchableOpacity>

      {/* Pause overlay */}
      {isPaused && (
        <View style={styles.pauseOverlay} pointerEvents="none">
          <Ionicons name="pause" size={70} color="rgba(255,255,255,0.7)" />
        </View>
      )}
      
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Animated.View style={[styles.centerHeart, { transform: [{ scale: heartScale }] }]}>
        <Ionicons name="heart" size={100} color="rgba(255,255,255,0.9)" />
      </Animated.View>

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.userRow}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity style={styles.followBtn}><Text style={styles.followText}>Follow</Text></TouchableOpacity>
          </View>
          <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
        </View>

        <View style={styles.sideActions}>
          <TouchableOpacity onPress={toggleLike} style={styles.actionItem}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={35} color={isLiked ? "#ff4b2b" : "#fff"} />
            <Text style={styles.actionText}>{likesCount.toLocaleString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)} style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={32} color="#fff" />
            <Text style={styles.actionText}>{commentsList.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Share.share({ message: `Check out this reel!` })} style={styles.actionItem}>
            <Ionicons name="paper-plane-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Reel More Options Modal */}
      <Modal visible={showMenu} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.menuSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.iconRow}>
              <View style={styles.iconBtn}>
                <View style={styles.iconCircle}><Ionicons name="bookmark-outline" size={26} color="#fff" /></View>
                <Text style={styles.iconLabel}>Save</Text>
              </View>
              <View style={styles.iconBtn}>
                <View style={styles.iconCircle}><Ionicons name="repeat-outline" size={26} color="#fff" /></View>
                <Text style={styles.iconLabel}>Remix</Text>
              </View>
              <View style={styles.iconBtn}>
                <View style={styles.iconCircle}><Ionicons name="copy-outline" size={26} color="#fff" /></View>
                <Text style={styles.iconLabel}>Sequence</Text>
              </View>
            </View>
            <View style={styles.menuList}>
               <TouchableOpacity style={styles.menuListItem}><Ionicons name="expand-outline" size={24} color="#fff" /><Text style={styles.menuListText}>View fullscreen</Text></TouchableOpacity>
               <View style={styles.menuListItem}>
                 <Ionicons name="play-circle-outline" size={24} color="#fff" />
                 <Text style={[styles.menuListText, { flex: 1 }]}>Auto scroll</Text>
                 <Switch value={autoScroll} onValueChange={setAutoScroll} trackColor={{ false: '#444', true: '#3897f0' }} />
               </View>
               <TouchableOpacity style={styles.menuListItem}><Ionicons name="eye-outline" size={24} color="#fff" /><Text style={styles.menuListText}>Interested</Text></TouchableOpacity>
               <TouchableOpacity style={styles.menuListItem}><Ionicons name="eye-off-outline" size={24} color="#fff" /><Text style={styles.menuListText}>Not interested</Text></TouchableOpacity>
               <TouchableOpacity style={styles.menuListItem}><Ionicons name="alert-circle-outline" size={24} color="#ff3b30" /><Text style={[styles.menuListText, { color: '#ff3b30' }]}>Report</Text></TouchableOpacity>
               <TouchableOpacity style={styles.menuListItem}><Ionicons name="settings-outline" size={24} color="#fff" /><Text style={styles.menuListText}>Manage content preferences</Text></TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Reel Comments Modal (Functional Now) */}
      <Modal visible={showComments} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowComments(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Comments</Text>
            <FlatList
              data={commentsList}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.inputRow}>
                <TextInput 
                  placeholder="Add a comment..." 
                  placeholderTextColor="#666" 
                  style={styles.input} 
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handlePostComment}><Text style={styles.postText}>Post</Text></TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState(() => getShuffled(5));
  const [refreshing, setRefreshing] = useState(false);

  // Reset to first video and start playing when tab is focused
  useFocusEffect(
    useCallback(() => {
      setActiveIndex(0);
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setActiveIndex(0);
    setTimeout(() => {
      setVideos(getShuffled(5));
      setRefreshing(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.y / height));
        }}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={index === activeIndex} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={['#3797f0']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  reelContainer: { width, height },
  video: { width, height },
  loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  pauseOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  centerHeart: { position: 'absolute', alignSelf: 'center', top: height / 3, pointerEvents: 'none' },
  overlay: { position: 'absolute', bottom: 0, width: '100%', height: '40%', justifyContent: 'flex-end', padding: 20, paddingBottom: 80 },
  content: { marginBottom: 20 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, borderWidth: 1, borderColor: '#fff' },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  followBtn: { marginLeft: 15, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#fff' },
  followText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  desc: { color: '#fff', fontSize: 14, width: '80%' },
  sideActions: { position: 'absolute', right: 15, bottom: 60, alignItems: 'center' },
  actionItem: { alignItems: 'center', marginBottom: 20 },
  actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#262626', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#555', alignSelf: 'center', borderRadius: 2, marginBottom: 20 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  iconBtn: { alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderWidth: 1, borderColor: '#444' },
  iconLabel: { color: '#fff', fontSize: 12 },
  menuList: { borderTopWidth: 0.5, borderTopColor: '#444', paddingTop: 10 },
  menuListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuListText: { color: '#fff', fontSize: 16, marginLeft: 15 },
  modalContent: { position: 'absolute', bottom: 0, width: '100%', height: '60%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 20 },
  commentItem: { flexDirection: 'row', padding: 10, alignItems: 'flex-start' },
  commentUser: { fontWeight: 'bold', marginRight: 10, color: '#000' },
  commentText: { flex: 1, color: '#333' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#eee', paddingTop: 10 },
  input: { flex: 1, height: 40, color: '#000' },
  postText: { color: '#3897f0', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});
