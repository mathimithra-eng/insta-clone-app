import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { colors, darkColors } from '../theme/colors';

const NOTIFICATIONS = [
  { id: '1', type: 'like', user: 'alex_dev', avatar: 'https://i.pravatar.cc/150?img=11', text: 'liked your post.', time: '2m' },
  { id: '2', type: 'mention', user: 'sarah_styles', avatar: 'https://i.pravatar.cc/150?img=9', text: 'mentioned you in a comment: "@stg_user this is amazing!"', time: '1h' },
  { id: '3', type: 'follow', user: 'travel_buddy', avatar: 'https://i.pravatar.cc/150?img=12', text: 'started following you.', time: '4h' },
  { id: '4', type: 'request', user: 'private_user', avatar: 'https://i.pravatar.cc/150?img=5', text: 'requested to follow you.', time: '1d' },
  { id: '5', type: 'like', user: 'creative_mind', avatar: 'https://i.pravatar.cc/150?img=22', text: 'liked your reel.', time: '2d' },
];

export default function NotificationsScreen() {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      padding: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: c.text,
    },
    notificationItem: {
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    usernameText: {
      fontWeight: 'bold',
      color: c.text,
    },
    notificationText: {
      color: c.text,
    },
    timeText: {
      color: c.textSecondary,
    },
    actionBtn: {
      backgroundColor: c.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 8,
    },
    actionBtnText: {
      color: c.white,
      fontWeight: 'bold',
      fontSize: 13,
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.notificationText}>
                <Text style={styles.usernameText}>{item.user}</Text> {item.text} <Text style={styles.timeText}>{item.time}</Text>
              </Text>
            </View>
            {item.type === 'request' ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Accepted', 'You have accepted the request.')}>
                  <Text style={styles.actionBtnText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: c.border, marginLeft: 8 }]} onPress={() => Alert.alert('Deleted', 'Request removed.')}>
                  <Text style={[styles.actionBtnText, { color: c.text }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            ) : item.type === 'follow' ? (
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Follow Back</Text>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
