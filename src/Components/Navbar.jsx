import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { user, dbUser, logout, loading } = auth;

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, rotateX: -90, transformOrigin: "top center" },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, rotateX: -90, transition: { duration: 0.2 } },
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest(".user-dropdown")) setDropdownOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-2 sm:px-4 md:px-10 py-3 sm:py-4 bg-transparent fixed top-0 left-0 z-20">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-14 sm:h-12 sm:w-16 md:h-14 md:w-20 object-contain"
          />
        </div>
        <ul className="hidden md:flex gap-4 lg:gap-8 text-secondary font-semibold text-base lg:text-lg">
          <Link className="hover:text-accent cursor-pointer">Home</Link>
          <Link to="/dashboard" className="hover:text-accent cursor-pointer">
            Dashboard
          </Link>
          <Link className="hover:text-accent cursor-pointer">Contact</Link>
        </ul>
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="relative user-dropdown">
              <img
                src={user.photoURL || "https://i.ibb.co/2kR8Fq3/user.png"}
                alt="User"
                className="w-9 h-9 rounded-full border cursor-pointer transition hover:ring-2 hover:ring-accent"
                onClick={() => setDropdownOpen((v) => !v)}
                tabIndex={0}
              />
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-4 px-4 z-50 origin-top"
                  >
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <img
                        src={
                          user.photoURL || "https://i.ibb.co/2kR8Fq3/user.png"
                        }
                        alt="User"
                        className="w-12 h-12 rounded-full border"
                      />
                      <span className="font-semibold text-secondary text-base">
                        {user.displayName || dbUser?.displayName || "নাম নেই"}
                      </span>
                      <span className="text-xs text-gray-500 break-all text-center">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full mt-2 bg-accent text-white py-1.5 rounded-lg font-semibold hover:bg-secondary transition"
                      disabled={loading}
                    >
                      লগ আউট
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-accent text-white px-3 py-1 rounded hover:bg-secondary transition"
              disabled={loading}
            >
              Login
            </button>
          )}
          <div className="md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="focus:outline-none"
            >
              <span className="text-3xl text-secondary">&#9776;</span>
            </button>
          </div>
        </div>
      </nav>
      {/* Drawer for mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <img src={logo} alt="Logo" className="h-10 w-14 object-contain" />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="text-3xl text-secondary focus:outline-none"
          >
            &times;
          </button>
        </div>
        <ul className="flex flex-col gap-6 px-6 py-8 text-secondary font-semibold text-lg">
          <Link
            className="hover:text-accent cursor-pointer"
            onClick={() => setDrawerOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-accent cursor-pointer"
            onClick={() => setDrawerOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            className="hover:text-accent cursor-pointer"
            onClick={() => setDrawerOpen(false)}
          >
            Contact
          </Link>
        </ul>
      </div>
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
