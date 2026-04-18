// Mock Firebase Configuration
// In a real application, you would initialize Firebase here.
export const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "stg-app.firebaseapp.com",
  projectId: "stg-app",
  storageBucket: "stg-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock123"
};

// Mock authentication state
export let currentUser = null;

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        currentUser = { uid: 'user123', email, displayName: 'STG User' };
        resolve(currentUser);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

export const logout = () => {
  currentUser = null;
};
