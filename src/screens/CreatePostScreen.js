import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, useColorScheme, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSocial } from '../context/SocialContext';
import { colors, darkColors } from '../theme/colors';

export default function CreatePostScreen({ navigation, route }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;
  const { addPost } = useSocial();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleShare = () => {
    if (!image) return Alert.alert('Error', 'Please select an image first.');
    setLoading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        user: { username: 'you', avatar: 'https://i.pravatar.cc/150?img=68' },
        image: image,
        caption: caption,
        likes: 0,
        comments: [],
        timestamp: 'Just now'
      };
      addPost(newPost);
      setLoading(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 0.5, borderBottomColor: c.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: c.text, fontSize: 16 }}>Cancel</Text></TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: c.text }}>New Post</Text>
        <TouchableOpacity onPress={handleShare} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color={c.primary} /> : <Text style={{ color: c.primary, fontWeight: 'bold', fontSize: 16 }}>Share</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ padding: 15 }}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="image-outline" size={48} color={c.textSecondary} />
              <Text style={{ color: c.textSecondary, marginTop: 10 }}>Tap to pick an image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { color: c.text }]}
          placeholder="Write a caption..."
          placeholderTextColor={c.textSecondary}
          multiline
          value={caption}
          onChangeText={setCaption}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePicker: { width: '100%', height: 350, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  input: { fontSize: 16, textAlignVertical: 'top', height: 100 }
});
