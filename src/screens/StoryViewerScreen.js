import {
  View, StyleSheet, Dimensions, Animated, PanResponder,
  Image, TouchableOpacity, Text, TextInput, Keyboard, Platform
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const QUICK_EMOJIS = ['😂', '😮', '🤍', '😍', '😢', '👏', '🔥'];

const StoryItem = ({ story, index, scrollX, navigation }) => {
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const [storyMessage, setStoryMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const heartScale = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const rotateY = scrollX.interpolate({ inputRange, outputRange: ['45deg', '0deg', '-45deg'], extrapolate: 'clamp' });
  const translateX = scrollX.interpolate({ inputRange, outputRange: [width / 2, 0, -width / 2], extrapolate: 'clamp' });
  const opacity = scrollX.interpolate({ inputRange: [(index - 0.5) * width, index * width, (index + 0.5) * width], outputRange: [0, 1, 0], extrapolate: 'clamp' });

  const handleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    if (nextLiked) {
      Animated.sequence([
        Animated.spring(heartScale, { toValue: 1.5, friction: 3, useNativeDriver: true }),
        Animated.spring(heartScale, { toValue: 0, friction: 5, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleInputFocus = () => {
    setShowEmojis(true);
  };

  const handleEmojiTap = (emoji) => {
    setStoryMessage(emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (storyMessage.trim()) {
      setStoryMessage('');
      setShowEmojis(false);
      Keyboard.dismiss();
      // Story continues — no navigation.goBack()!
    }
  };

  return (
    <Animated.View style={[styles.storyContainer, { opacity, transform: [{ perspective: width * 2 }, { translateX }, { rotateY }] }]}>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800' }} style={styles.storyImage} />

      {/* Dark overlay when emoji tray is visible */}
      {showEmojis && <View style={styles.dimOverlay} />}

      {/* Header */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
        <View style={styles.userInfo}>
          <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{story.user.username}</Text>
          <Text style={styles.time}>2h</Text>
        </View>
      </View>

      {/* Big Heart Animation */}
      <Animated.View style={[styles.centerHeart, { transform: [{ scale: heartScale }] }]}>
        <Ionicons name="heart" size={100} color="red" />
      </Animated.View>

      {/* Emoji Reaction Tray */}
      {showEmojis && (
        <View style={styles.emojiTray}>
          {QUICK_EMOJIS.map((emoji, i) => (
            <TouchableOpacity key={i} onPress={() => handleEmojiTap(emoji)} style={styles.emojiBtn}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Footer Input - NO KeyboardAvoidingView to prevent Android layout bug */}
      <View style={[styles.footer, { bottom: keyboardHeight > 0 ? keyboardHeight + 10 : (insets.bottom + 10) }]}>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            placeholder="Send message"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={styles.input}
            value={storyMessage}
            onChangeText={setStoryMessage}
            onFocus={handleInputFocus}
            onBlur={() => !storyMessage && setShowEmojis(false)}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          {storyMessage.trim().length > 0 ? (
            // Blue send button when typing
            <TouchableOpacity style={styles.sendCircle} onPress={handleSend}>
              <Ionicons name="paper-plane" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            // Like + paper plane when empty
            <View style={styles.footerIcons}>
              <TouchableOpacity onPress={handleLike} style={styles.footerIcon}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={30} color={liked ? "red" : "#fff"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerIcon} onPress={handleSend}>
                <Ionicons name="paper-plane-outline" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default function StoryViewerScreen({ route, navigation }) {
  const { initialIndex, allStories } = route.params;
  const scrollX = useRef(new Animated.Value(initialIndex * width)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 0.5) {
          Animated.timing(translateY, { toValue: height, duration: 250, useNativeDriver: true }).start(() => navigation.goBack());
        } else {
          Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentOffset={{ x: initialIndex * width, y: 0 }}
        style={{ transform: [{ translateY }] }}
      >
        {allStories.map((story, index) => (
          <StoryItem key={story.id} story={story} index={index} scrollX={scrollX} navigation={navigation} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  storyContainer: { width, height, backgroundColor: '#000' },
  storyImage: { width: '100%', height: '100%' },
  dimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 5 },
  header: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 15, zIndex: 10 },
  progressBarContainer: { height: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 10 },
  progressBar: { height: '100%', width: '30%', backgroundColor: '#fff', borderRadius: 2 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  time: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginLeft: 10 },
  centerHeart: { position: 'absolute', top: height / 2 - 50, left: width / 2 - 50, zIndex: 10 },
  // Emoji tray - sits just above the input bar
  emojiTray: {
    position: 'absolute', bottom: 90, left: 15, right: 15,
    flexDirection: 'row', justifyContent: 'space-around',
    zIndex: 20,
  },
  emojiBtn: { padding: 5 },
  emojiText: { fontSize: 38 },
  // Footer
  footer: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 15, zIndex: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30,30,30,0.85)', borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', overflow: 'hidden' },
  input: {
    flex: 1, height: 50,
    paddingHorizontal: 20, color: '#fff', fontSize: 15,
  },
  sendCircle: {
    width: 56, height: 50,
    backgroundColor: '#3797f0',
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 0,
  },
  footerIcons: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  footerIcon: { marginLeft: 15 },
});
