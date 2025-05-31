import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../../../Firebase/Firebase.config";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff, HiOutlineUserCircle, HiOutlinePhotograph } from "react-icons/hi";
import { Toaster, toast } from "react-hot-toast";

const Register = () => {
  const { saveUserToDB } = useAuth() || {};
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");
      return;
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName, photoURL });
      if (saveUserToDB) {
        await saveUserToDB({
          displayName,
          photoURL,
          email,
          role: "user",
        });
      }
      setLoading(false);
      toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      toast.error("রেজিস্ট্রেশন ব্যর্থ! ইমেইলটি হয়তো আগে ব্যবহার হয়েছে।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-secondary/10 px-2">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-accent/20 p-8 relative">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-accent/10 rounded-full p-3 mb-2">
            <HiOutlineUserCircle className="text-accent text-4xl" />
          </span>
          <h2 className="text-2xl font-bold text-secondary mb-1">রেজিস্ট্রেশন করুন</h2>
          <p className="text-gray-500 text-sm">নতুন একাউন্ট তৈরি করুন</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <HiOutlineUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg" />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-accent transition placeholder:text-secondary placeholder:font-medium"
              placeholder="নাম"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <HiOutlinePhotograph className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg" />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-accent transition placeholder:text-secondary placeholder:font-medium"
              placeholder="প্রোফাইল ছবি (URL)"
              value={photoURL}
              onChange={e => setPhotoURL(e.target.value)}
            />
          </div>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg" />
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-accent transition placeholder:text-secondary placeholder:font-medium"
              placeholder="ইমেইল"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-accent transition placeholder:text-secondary placeholder:font-medium"
              placeholder="পাসওয়ার্ড"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-lg" />
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-accent transition placeholder:text-secondary placeholder:font-medium"
              placeholder="কনফার্ম পাসওয়ার্ড"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-60"
            disabled={loading}
          >
            রেজিস্ট্রেশন করুন
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          একাউন্ট আছে?{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            লগ ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
