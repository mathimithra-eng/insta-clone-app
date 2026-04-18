import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, TouchableOpacity, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, darkColors } from '../theme/colors';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReelsScreen from '../screens/ReelsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StoryViewerScreen from '../screens/StoryViewerScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import CallScreen from '../screens/CallScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator({ isDark, user, onLogout }) {
  const activeColors = isDark ? darkColors : colors;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home-sharp' : 'home-outline';
          else if (route.name === 'Reels') iconName = focused ? 'play-circle' : 'play-circle-outline';
          else if (route.name === 'Explore') iconName = focused ? 'search' : 'search-outline';
          
          if (route.name === 'MessagesTab') {
            return (
              <View>
                <Ionicons name="paper-plane-outline" size={size} color={color} />
                <View style={{ position: 'absolute', right: -2, top: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff3b30' }} />
              </View>
            );
          }
          
          if (route.name === 'Profile') {
            return <Image source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=68' }} style={{ width: 26, height: 26, borderRadius: 13, borderWidth: focused ? 1.5 : 0, borderColor: activeColors.text }} />;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeColors.text,
        tabBarInactiveTintColor: activeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: activeColors.background,
          borderTopColor: activeColors.border,
          borderTopWidth: 0.5,
          height: 50 + insets.bottom,   // icon area + phone nav bar gap
          paddingBottom: insets.bottom, // exact gap above system buttons
          paddingTop: 8,
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reels" component={ReelsScreen} />
      <Tab.Screen name="MessagesTab" component={ChatListScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} currentUser={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const theme = isDark ? NavigationDarkTheme : DefaultTheme;
  const MyTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: isDark ? darkColors.background : colors.background,
      card: isDark ? darkColors.background : colors.background,
      text: isDark ? darkColors.text : colors.text,
      border: isDark ? darkColors.border : colors.border,
    },
  };

  const handleLogout = () => setUser(null);

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar hidden />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} setAuth={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="MainSplit">
              {(props) => <MainTabNavigator {...props} isDark={isDark} user={user} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: true, title: 'Messages' }}/>
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: 'Notifications' }}/>
            <Stack.Screen name="Settings">
               {(props) => <SettingsScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="Call" component={CallScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="StoryViewer" component={StoryViewerScreen} options={{ presentation: 'fullScreenModal', animation: 'fade' }}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
