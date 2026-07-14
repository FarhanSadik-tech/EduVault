import { createContext, useEffect, useState } from "react";
import {
  auth,
  onAuthStateChanged,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  resetPassword,
} from "../services/auth";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const createUser = (email, password) => {
    return registerUser(email, password);
  };

  // Login
  const signIn = (email, password) => {
    return loginUser(email, password);
  };

  // Logout
  const forgotPassword = (email) => {
  return resetPassword(email);
};
  const logOut = () => {
    return logoutUser();
  };

  // Update Profile
  const updateProfileData = (name, photoURL) => {
    return updateUserProfile(name, photoURL);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const authInfo = {
  user,
  loading,
  createUser,
  signIn,
  logOut,
  updateProfileData,
  forgotPassword,
};

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;