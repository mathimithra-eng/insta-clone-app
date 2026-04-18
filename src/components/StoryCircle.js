import React from 'react';
import { View, Text, Image, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, darkColors } from '../theme/colors';

export default function StoryCircle({ user, hasViewed, isUserStory, onPress }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginHorizontal: 8,
    },
    gradientImage: {
      width: 68,
      height: 68,
      borderRadius: 34,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: c.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 58,
      height: 58,
      borderRadius: 29,
    },
    username: {
      color: c.text,
      fontSize: 12,
      marginTop: 4,
    },
    addBtn: {
      position: 'absolute',
      bottom: 20,
      right: 0,
      backgroundColor: c.primary,
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.background,
      justifyContent: 'center',
      alignItems: 'center'
    },
    addText: {
      color: c.white,
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: -2
    }
  });

  const gradientColors = hasViewed ? [c.border, c.border] : c.storyBorder;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient colors={gradientColors} style={styles.gradientImage} start={{x: 0, y: 1}} end={{x: 1, y: 0}}>
        <View style={styles.imageContainer}>
          <Image source={{uri: user.avatar}} style={styles.image} />
        </View>
      </LinearGradient>
      {isUserStory && (
        <View style={styles.addBtn}>
          <Text style={styles.addText}>+</Text>
        </View>
      )}
      <Text style={styles.username} numberOfLines={1}>{user.username}</Text>
    </TouchableOpacity>
  );
}
