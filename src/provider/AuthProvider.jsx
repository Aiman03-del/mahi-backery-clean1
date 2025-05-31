import React, { useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "../../Firebase/Firebase.config";
import AuthContext from "./AuthContext";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const saveUserToDB = async (user) => {
  // user: { displayName, photoURL, email, role }
  if (!user?.email) return;
  const existing = await fetchUserByEmail(user.email);
  if (!existing || !existing.email) {
    // New user, insert with role
    await fetch(`https://mahi-bakery.onrender.com/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  }
  // If user exists, do nothing (no update)
};

const fetchUserByEmail = async (email) => {
  try {
    const res = await fetch(
      `https://mahi-bakery.onrender.com/api/users/${email}`
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        const dbUserData = await fetchUserByEmail(firebaseUser.email);
        setDbUser(dbUserData);
      } else {
        setDbUser(null);
        // Log current user data (null)
        console.log("Current user:", null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, photoURL, email } = result.user;
    const userData = {
      displayName,
      photoURL: photoURL || "",
      email,
      role: "user",
    };
    await saveUserToDB(userData); // Always upsert (insert or update)
    setLoading(false);
    console.log("Login Success", userData);
  };

  // Email Login (with displayName, photoURL)
  const loginWithEmail = async (email, password, displayName, photoURL) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (displayName || photoURL) {
      await updateProfile(result.user, { displayName, photoURL });
    }
    const userData = {
      displayName: displayName || result.user.displayName || "",
      photoURL: photoURL || result.user.photoURL || "",
      email: result.user.email,
      role: "user",
    };
    await saveUserToDB(userData);
    setLoading(false);
    console.log("Login Success", userData);
  };
console.log('currentUser:', dbUser);

  // Logout
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  const value = {
    user,
    dbUser,
    loading,
    loginWithGoogle,
    loginWithEmail,
    logout,
    fetchUserByEmail,
    saveUserToDB, // <-- add this so Register page can use it
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
