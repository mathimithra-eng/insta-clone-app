import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, useColorScheme, ScrollView, Modal, TextInput, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSocial } from '../context/SocialContext';
import { colors, darkColors } from '../theme/colors';

const { width } = Dimensions.get('window');

const DUMMY_USERS = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i),
  username: `user_${i + 100}`,
  name: `Alex Smith ${i + 1}`,
  avatar: `https://i.pravatar.cc/150?u=${i + 100}`,
  isFollowing: i % 2 === 0
}));

function UserListModal({ visible, onClose, title, data, c }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 0.5, borderBottomColor: '#333' }}>
          <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back" size={28} color="#fff" /></TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#fff', marginRight: 28 }}>{title}</Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
              <Image source={{ uri: item.avatar }} style={{ width: 54, height: 54, borderRadius: 27, marginRight: 15 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.username}</Text>
                <Text style={{ color: '#8e8e8e' }}>{item.name}</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: item.isFollowing ? '#262626' : '#3797f0', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.isFollowing ? 'Following' : 'Follow'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

export default function ProfileScreen({ route, navigation, currentUser, onLogout }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useSocial();
  
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showAvatarSheet, setShowAvatarSheet] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showGenderSheet, setShowGenderSheet] = useState(false);
  const [viewingFull, setViewingFull] = useState(null); 

  const [name, setName] = useState(currentUser?.name || userProfile.name || 'Alex Johnson');
  const [bio, setBio] = useState(currentUser?.bio || userProfile.bio || 'Exploring the digital frontier one pixel at a time. 🚀 | Tech Enthusiast');
  const [pronouns, setPronouns] = useState(userProfile.pronouns || '');
  const [username, setUsername] = useState(currentUser?.username || 'alex_j.99');
  const [gender, setGender] = useState('Prefer not to say');

  const displayUser = {
    username: username,
    name: name,
    avatar: 'https://i.pravatar.cc/150?img=68',
    bio: bio,
    posts: 0,
    followers: 112,
    following: 155
  };

  const handleDone = () => {
    updateUserProfile({ name, bio, pronouns, gender });
    setShowEdit(false);
    Alert.alert('Success', 'Profile updated!');
  };

  const handleShare = () => {
    Share.share({ message: `Check out my profile on ReelRush! @${displayUser.username}` });
  };

  const renderCreateOption = (icon, label, isNew = false) => (
    <TouchableOpacity style={styles.createOption} onPress={() => setShowCreate(false)}>
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.createLabel}>{label}</Text>
      {isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>New</Text></View>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => setShowCreate(true)}>
          <Ionicons name="add-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerTitleContainer} onPress={() => setShowAccountSheet(true)}>
          <Ionicons name="lock-closed-outline" size={14} color="#fff" />
          <Text style={styles.headerUsername}>{displayUser.username}</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="menu-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.topInfo}>
            <View>
              <View style={styles.noteBubble}>
                <Ionicons name="musical-notes" size={10} color="#fff" />
                <Text style={styles.noteText}>Vibing... \n Mood: Code 💻</Text>
              </View>
              <TouchableOpacity onLongPress={() => setShowAvatarSheet(true)} activeOpacity={0.9}>
                <Image source={{ uri: displayUser.avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.avatarAddBtn} onPress={() => setShowCreate(true)}>
                  <Ionicons name="add" size={14} color="#000" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}><Text style={styles.statNumber}>{displayUser.posts}</Text><Text style={styles.statLabel}>posts</Text></View>
              <TouchableOpacity style={styles.statItem} onPress={() => setShowFollowers(true)}>
                <Text style={styles.statNumber}>{displayUser.followers}</Text><Text style={styles.statLabel}>followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem} onPress={() => setShowFollowing(true)}>
                <Text style={styles.statNumber}>{displayUser.following}</Text><Text style={styles.statLabel}>following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.profileName}>{displayUser.name}</Text>
          <Text style={{ color: '#fff', fontSize: 13, marginBottom: 15 }}>{displayUser.bio}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowEdit(true)}>
              <Text style={styles.actionBtnText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Text style={styles.actionBtnText}>Share profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addPersonBtn}><Ionicons name="person-add-outline" size={20} color="#fff" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}><Ionicons name="grid-outline" size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Ionicons name="person-outline" size={24} color="#8e8e8e" /></TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Create your first post</Text>
          <Text style={styles.emptySubtitle}>Make this space your own.</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreatePost')}><Text style={styles.createBtnText}>Create</Text></TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal (Updated with Functional Gender) */}
      <Modal visible={showEdit} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000', paddingTop: insets.top }}>
          <View style={styles.editHeader}>
            <TouchableOpacity onPress={() => setShowEdit(false)}><Ionicons name="close" size={32} color="#fff" /></TouchableOpacity>
            <Text style={styles.editHeaderTitle}>Edit profile</Text>
            <TouchableOpacity onPress={handleDone}><Ionicons name="checkmark" size={32} color="#3797f0" /></TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 15 }}>
            <View style={styles.dualAvatars}>
              <View style={styles.avatarMain}><Image source={{ uri: displayUser.avatar }} style={{ width: '100%', height: '100%', borderRadius: 50 }} /></View>
              <View style={styles.avatarBlue}><Ionicons name="person-outline" size={40} color="#15a" /></View>
            </View>
            <TouchableOpacity><Text style={styles.editPhotoText}>Edit picture or avatar</Text></TouchableOpacity>

            <View style={styles.inputBox}><Text style={styles.boxLabel}>Name</Text><TextInput style={styles.boxInput} value={name} onChangeText={setName} /></View>
            <View style={styles.inputBox}><Text style={styles.boxLabel}>Username</Text><TextInput style={styles.boxInput} value={username} onChangeText={setUsername} /></View>
            <View style={styles.inputBox}><Text style={styles.boxLabel}>Pronouns</Text><TextInput style={styles.boxInput} value={pronouns} onChangeText={setPronouns} placeholder="Pronouns" placeholderTextColor="#555" /></View>
            <View style={styles.inputBox}><Text style={styles.boxLabel}>Bio</Text><TextInput style={styles.boxInput} value={bio} onChangeText={setBio} multiline /></View>

            <TouchableOpacity style={{ marginVertical: 15 }}><Text style={styles.blueText}>Add link</Text></TouchableOpacity>
            
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading}>Add banners</Text>
              <Text style={styles.subHeading}>Add music, profiles and more.</Text>
            </View>

            <TouchableOpacity style={[styles.inputBox, styles.rowBetween]} onPress={() => setShowGenderSheet(true)}>
               <View><Text style={styles.boxLabel}>Gender</Text><Text style={styles.boxInput}>{gender}</Text></View>
               <Ionicons name="chevron-forward" size={18} color="#8e8e8e" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerLink}><Text style={styles.blueText}>Switch to professional account</Text></TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}><Text style={styles.blueText}>Personal information settings</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Gender Selection Sheet */}
      <Modal visible={showGenderSheet} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowGenderSheet(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Gender</Text>
            {['Female', 'Male', 'Custom', 'Prefer not to say'].map((option) => (
              <TouchableOpacity key={option} style={styles.sheetItem} onPress={() => { setGender(option); setShowGenderSheet(false); }}>
                <Text style={styles.sheetItemText}>{option}</Text>
                {gender === option && <Ionicons name="checkmark-circle" size={24} color="#3797f0" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Account Switcher Sheet */}
      <Modal visible={showAccountSheet} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowAccountSheet(false)}>
          <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.accountItem}>
              <Image source={{ uri: displayUser.avatar }} style={styles.accountAvatar} />
              <Text style={styles.accountUsername}>{displayUser.username}</Text>
              <Ionicons name="checkmark-circle" size={24} color="#3797f0" />
            </View>
            <TouchableOpacity style={styles.addAccountBtn} onPress={() => { setShowAccountSheet(false); onLogout(); }}>
              <View style={styles.addAccountIconContainer}><Ionicons name="add" size={28} color="#fff" /></View>
              <Text style={styles.addAccountText}>Add account</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Create Sheet */}
      <Modal visible={showCreate} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowCreate(false)}>
          <View style={styles.createSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Create</Text>
            <View style={styles.optionsList}>
              {renderCreateOption('play-circle-outline', 'Reel')}
              {renderCreateOption('layers-outline', 'Edits', true)}
              {renderCreateOption('grid-outline', 'Post')}
              {renderCreateOption('add-circle-outline', 'Story')}
              {renderCreateOption('heart-outline', 'Highlights')}
              {renderCreateOption('radio-outline', 'Live')}
              {renderCreateOption('sparkles-outline', 'AI')}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Avatar Long Press Sheet */}
      <Modal visible={showAvatarSheet} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowAvatarSheet(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <TouchableOpacity style={styles.sheetItem} onPress={() => { setShowAvatarSheet(false); setViewingFull('story'); }}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" /><Text style={styles.sheetItemText}>View story</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={() => { setShowAvatarSheet(false); setViewingFull('pic'); }}>
              <Ionicons name="person-circle-outline" size={24} color="#fff" /><Text style={styles.sheetItemText}>View profile picture</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <UserListModal visible={showFollowers} onClose={() => setShowFollowers(false)} title="Followers" data={DUMMY_USERS} c={c} />
      <UserListModal visible={showFollowing} onClose={() => setShowFollowing(false)} title="Following" data={DUMMY_USERS} c={c} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 10 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerUsername: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginHorizontal: 5 },
  profileSection: { padding: 15 },
  topInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 86, height: 86, borderRadius: 43 },
  avatarAddBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  noteBubble: { position: 'absolute', top: -10, left: -5, backgroundColor: '#262626', padding: 8, borderRadius: 15, borderWidth: 1, borderColor: '#333', zIndex: 5 },
  noteText: { color: '#fff', fontSize: 10 },
  statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#fff', fontSize: 13 },
  profileName: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 5 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flex: 1, backgroundColor: '#262626', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  addPersonBtn: { backgroundColor: '#262626', padding: 8, borderRadius: 8 },
  tabs: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#333' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 1.5, borderBottomColor: '#fff' },
  emptyState: { padding: 50, alignItems: 'center' },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  emptySubtitle: { color: '#8e8e8e', fontSize: 15, marginBottom: 25 },
  createBtn: { backgroundColor: '#3797f0', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 8 },
  createBtnText: { color: '#fff', fontWeight: 'bold' },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  editHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  dualAvatars: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20 },
  avatarMain: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#333', marginRight: 15, overflow: 'hidden' },
  avatarBlue: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#002', justifyContent: 'center', alignItems: 'center' },
  editPhotoText: { color: '#3797f0', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputBox: { backgroundColor: '#111', borderRadius: 12, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  boxLabel: { color: '#8e8e8e', fontSize: 12, marginBottom: 4 },
  boxInput: { color: '#fff', fontSize: 16 },
  blueText: { color: '#3797f0', fontSize: 16 },
  heading: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  subHeading: { color: '#8e8e8e', fontSize: 13, marginTop: 5 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#262626', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginVertical: 10 },
  sheetTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  sheetItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  sheetItemText: { color: '#fff', fontSize: 16, marginLeft: 15, flex: 1 },
  createOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  createLabel: { color: '#fff', fontSize: 16, marginLeft: 15, flex: 1 },
  newBadge: { backgroundColor: '#3897f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  newBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  accountItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  accountAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 15 },
  accountUsername: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 },
  addAccountBtn: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  addAccountIconContainer: { width: 56, height: 56, borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#555', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addAccountText: { color: '#fff', fontSize: 16 },
  createSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#262626', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 40 }
});
