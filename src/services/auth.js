import app from "../firebase/firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

export const auth = getAuth(app);

// Register
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
export const logoutUser = () => {
  return signOut(auth);
};

// Update Profile
export const updateUserProfile = (name, photoURL) => {
  return updateProfile(auth.currentUser, {
    displayName: name,
    photoURL,
  });
};

// Listen Auth State
export { onAuthStateChanged };