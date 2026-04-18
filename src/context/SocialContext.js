import React, { createContext, useState, useContext, useEffect } from 'react';

const SocialContext = createContext();

export const SocialProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    username: 'stg_user',
    name: 'STG User',
    avatar: 'https://i.pravatar.cc/150?img=68',
    bio: 'Exploring the world one reel at a time! 🌟',
    pronouns: 'he/him',
    links: 'reelrush.app',
    posts: 15,
    followers: '8.4K',
    following: 450,
  });

  const [posts, setPosts] = useState([
    {
      id: '1',
      user: { username: 'alex_dev', avatar: 'https://i.pravatar.cc/150?img=11' },
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
      caption: 'Initial post! Welcome to ReelRush 🚀',
      likes: 124,
      comments: [{ id: 'c1', user: 'sarah_styles', text: 'Love it!' }],
      timestamp: '1h ago'
    },
    {
      id: '2',
      user: { username: 'sarah_styles', avatar: 'https://i.pravatar.cc/150?img=9' },
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
      caption: 'Coffee shop vibes ☕️✨',
      likes: 850,
      comments: [],
      timestamp: '2h ago'
    },
    {
      id: '3',
      user: { username: 'travel_buddy', avatar: 'https://i.pravatar.cc/150?img=12' },
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
      caption: 'Lost in the mountains. ⛰️',
      likes: 2300,
      comments: [],
      timestamp: '4h ago'
    }
  ]);

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [followRequests, setFollowRequests] = useState([
    { id: 'r1', username: 'nature_lover', avatar: 'https://i.pravatar.cc/150?img=33', status: 'pending' }
  ]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const addComment = (postId, comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    }));
  };

  const blockUser = (username) => {
    setBlockedUsers([...blockedUsers, username]);
  };

  const acceptRequest = (requestId) => {
    setFollowRequests(followRequests.filter(req => req.id !== requestId));
  };

  const updateUserProfile = (newProfile) => {
    setUserProfile({ ...userProfile, ...newProfile });
  };

  return (
    <SocialContext.Provider value={{
      posts, addPost, addComment,
      blockedUsers, blockUser,
      followRequests, acceptRequest,
      userProfile, updateUserProfile
    }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => useContext(SocialContext);
