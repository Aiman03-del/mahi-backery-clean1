import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff, HiOutlineUserCircle } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { loginWithGoogle, loginWithEmail, loading } = useAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      toast.success("লগ ইন সফল হয়েছে!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } catch (error) {
      toast.error("ইমেইল বা পাসওয়ার্ড ভুল অথবা একাউন্ট নেই।");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("গুগল লগ ইন সফল হয়েছে!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } catch (error) {
      toast.error("গুগল লগ ইন ব্যর্থ!");
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
          <h2 className="text-2xl font-bold text-secondary mb-1">লগ ইন করুন</h2>
          <p className="text-gray-500 text-sm">আপনার একাউন্টে প্রবেশ করুন</p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-accent py-2 rounded-lg mb-4 shadow-sm transition"
          disabled={loading}
        >
          <FcGoogle className="text-xl" />
          <span className="font-medium text-gray-700">গুগল দিয়ে লগ ইন</span>
        </button>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">অথবা</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
              autoComplete="current-password"
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
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-60"
            disabled={loading}
          >
            ইমেইল দিয়ে লগ ইন
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          একাউন্ট নেই?{" "}
          <Link to="/register" className="text-accent font-semibold hover:underline">
            রেজিস্ট্রেশন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
