import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LogOut, ShieldAlert, Menu, X } from "lucide-react";
import {
  House,
  Building2,
  BookOpen,
  MessageCircle,
  Upload,
} from "lucide-react";

// 🔥 Assets ফোল্ডার থেকে লোগো ইমপোর্ট করা হলো
import logo from "../../assets/logo2.png";

function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authorized Admin Emails list
  const adminEmails = ["xarhan62@gmail.com"];
  const isAdmin = user && adminEmails.includes(user.email);

  const navItems = [
    { name: "Home", path: "/", icon: House },
    { name: "Departments", path: "/department", icon: Building2 },
    { name: "Courses", path: "/course", icon: BookOpen },
    { name: "Discussion", path: "/discussion", icon: MessageCircle },
  ];

  const menuItems = user
    ? [
        ...navItems,
        { name: "Upload", path: "/upload", icon: Upload },
      ]
    : navItems;

  const handleLogout = async () => {
    try {
      await logOut();
      alert("Logged out successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl shadow-lg"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-3.5">
        
      
        {/* Logo Section */}
<NavLink
  to="/"
  className="flex items-center gap-3 transition duration-300 hover:scale-105"
>
  {/* 🔥 Logo Image explicitly zoomed and enlarged */}
  <img
    src={logo}
    alt="EduVaultBD Logo"
    className="h-24 md:h-28 w-auto max-w-none object-contain scale-125 my-1"
  />
</NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-blue-400"
                }`
              }
            >
              <item.icon
                size={18}
                className="transition group-hover:scale-110"
              />
              {item.name}
              {/* Active Line */}
              <span className="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 bg-blue-400 transition-transform duration-300 group-hover:scale-x-100" />
            </NavLink>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NavLink to="/login" className="secondary-btn px-5 py-2">
                  Login
                </NavLink>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NavLink to="/register" className="primary-btn px-5 py-2">
                  Register
                </NavLink>
              </motion.div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Special Admin Link Button */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                  title="Open Admin Panel"
                >
                  <ShieldAlert size={16} />
                  <span>Admin Panel</span>
                </NavLink>
              )}

              {/* User Profile Info Link */}
              <NavLink
                to="/profile"
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 transition hover:border-slate-700 hover:bg-slate-800/80 cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (user.displayName?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-400">Welcome</p>
                  <p className="text-sm font-semibold text-white">
                    {user.displayName || "EduVault User"}
                  </p>
                </div>
              </NavLink>

              {/* Logout Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-slate-800/80 bg-slate-950/95 px-6 pb-6 pt-2 backdrop-blur-2xl md:hidden"
          >
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-4 py-3">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition ${
                      isActive ? "text-blue-400" : "text-slate-300 hover:text-blue-400"
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-800/80 pt-4">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="secondary-btn w-full text-center py-2.5"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="primary-btn w-full text-center py-2.5"
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Mobile Admin Link */}
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-bold text-red-400"
                    >
                      <ShieldAlert size={18} />
                      <span>Admin Panel</span>
                    </NavLink>
                  )}

                  {/* Mobile Profile Link */}
                  <NavLink
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white overflow-hidden">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (user.displayName?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Welcome</p>
                      <p className="text-sm font-semibold text-white">
                        {user.displayName || "EduVault User"}
                      </p>
                    </div>
                  </NavLink>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;