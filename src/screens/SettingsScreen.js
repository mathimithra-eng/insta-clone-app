import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Modal, Switch, Alert, FlatList, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, darkColors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen({ navigation, onLogout }) {
  const isDark = useColorScheme() === 'dark';
  const c = isDark ? darkColors : colors;
  const insets = useSafeAreaInsets();
  
  const SettingItem = ({ icon, label, rightText, onPress, color = c.text, subText }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Ionicons name={icon} size={24} color={color} style={{ marginRight: 15 }} />
        <View>
          <Text style={{ color: color, fontSize: 16 }}>{label}</Text>
          {subText && <Text style={{ color: c.textSecondary, fontSize: 12, marginTop: 2 }}>{subText}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {rightText && <Text style={{ color: c.textSecondary, marginRight: 10 }}>{rightText}</Text>}
        <Ionicons name="chevron-forward" size={18} color={c.border} />
      </View>
    </TouchableOpacity>
  );

  const SectionTitle = ({ title, showMeta }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {showMeta && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="infinite-outline" size={18} color={c.text} />
          <Text style={{ fontWeight: 'bold', color: c.text, marginLeft: 5 }}>Meta</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={c.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings and Activity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={c.textSecondary} />
          <TextInput placeholder="Search" placeholderTextColor={c.textSecondary} style={{ marginLeft: 10, flex: 1, color: c.text }} />
        </View>

        <SectionTitle title="Your account" showMeta />
        <View style={styles.metaBox}>
          <SettingItem 
            icon="person-circle-outline" 
            label="Accounts Center" 
            subText="Password, security, personal details, ad preferences" 
            onPress={() => {}} 
          />
        </View>

        <SectionTitle title="How you use Instagram" />
        <SettingItem icon="bookmark-outline" label="Saved" />
        <SettingItem icon="time-outline" label="Archive" />
        <SettingItem icon="stats-chart-outline" label="Your activity" />
        <SettingItem icon="notifications-outline" label="Notifications" />
        <SettingItem icon="hourglass-outline" label="Time management" />
        <SettingItem icon="tablet-portrait-outline" label="Instagram for tablets" />

        <SectionTitle title="Who can see your content" />
        <SettingItem icon="lock-closed-outline" label="Account privacy" rightText="Private" />
        <SettingItem icon="star-outline" label="Close Friends" rightText="6" />
        <SettingItem icon="share-social-outline" label="Crossposting" />
        <SettingItem icon="remove-circle-outline" label="Blocked" rightText="1" />

        <SectionTitle title="How others can interact with you" />
        <SettingItem icon="chatbubble-ellipses-outline" label="Messages and story replies" />
        <SettingItem icon="at-outline" label="Tags and mentions" />
        <SettingItem icon="chatbubbles-outline" label="Comments" />
        <SettingItem icon="repeat-outline" label="Sharing" />
        <SettingItem icon="eye-off-outline" label="Restricted" rightText="0" />
        <SettingItem icon="alert-circle-outline" label="Limit interactions" rightText="Off" />
        <SettingItem icon="text-outline" label="Hidden Words" />
        <SettingItem icon="person-add-outline" label="Follow and invite friends" />

        <SectionTitle title="What you see" />
        <SettingItem icon="star-half-outline" label="Favorites" rightText="0" />
        <SettingItem icon="volume-mute-outline" label="Muted accounts" rightText="0" />
        <SettingItem icon="options-outline" label="Content preferences" />
        <SettingItem icon="heart-dislike-outline" label="Like and share counts" />

        <SectionTitle title="Your app and media" />
        <SettingItem icon="phone-portrait-outline" label="Device permissions" />
        <SettingItem icon="download-outline" label="Archiving and downloading" />
        <SettingItem icon="body-outline" label="Accessibility" />
        <SettingItem icon="language-outline" label="Language and translations" />
        <SettingItem icon="cellular-outline" label="Data usage and media quality" />

        <SectionTitle title="Also from Meta" />
        <SettingItem icon="logo-whatsapp" label="WhatsApp" color="#25D366" />
        <SettingItem icon="logo-facebook" label="Facebook" color="#1877F2" />
        <SettingItem icon="at-circle-outline" label="Threads" />
        <SettingItem icon="chatbuster-outline" label="Messenger" color="#006AFF" />

        <SectionTitle title="Login" />
        <TouchableOpacity onPress={onLogout}>
          <Text style={{ color: c.primary, fontSize: 16, padding: 15, fontWeight: 'bold' }}>Add account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogout}>
          <Text style={{ color: '#ff3b30', fontSize: 16, padding: 15, fontWeight: 'bold' }}>Log out</Text>
        </TouchableOpacity>
        
        <Text style={{ textAlign: 'center', color: c.textSecondary, fontSize: 12, marginTop: 20 }}>ReelRush version 2.4.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fixedHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#262626', backgroundColor: '#000', zIndex: 100 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginLeft: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', margin: 15, paddingHorizontal: 12, borderRadius: 10, height: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginTop: 20, marginBottom: 10 },
  sectionLabel: { color: '#8e8e8e', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'space-between' },
  metaBox: { marginHorizontal: 15, padding: 5, backgroundColor: '#1a1a1a', borderRadius: 12 }
});
