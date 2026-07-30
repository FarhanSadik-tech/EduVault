import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User, LogOut } from "lucide-react";

import {
  House,
  Building2,
  BookOpen,
  MessageCircle,
  Upload,
} from "lucide-react";

function Navbar() {

  const { user, logOut } = useContext(AuthContext);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: House,
    },
    {
      name: "Departments",
      path: "/department",
      icon: Building2,
    },
    {
      name: "Courses",
      path: "/course",
      icon: BookOpen,
    },
    {
      name: "Discussion",
      path: "/discussion",
      icon: MessageCircle,
    },
  ];

  const menuItems = user
    ? [
        ...navItems,
        {
          name: "Upload",
          path: "/upload",
          icon: Upload,
        },
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
      initial={{
        y: -80,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl shadow-lg"
    >

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-extrabold tracking-wide transition hover:scale-105"
        >

          <span className="text-white">
            Edu
          </span>

          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Vault
          </span>

        </NavLink>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          {menuItems.map((item) => {

            return (

              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => {

                  return `group relative flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-blue-400"
                      : "text-slate-300 hover:text-blue-400"
                  }`;

                }}
              >

                <item.icon
                  size={18}
                  className="transition group-hover:scale-110"
                />

                {item.name}

                {/* Active Line */}
                <span className="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 bg-blue-400 transition-transform duration-300 group-hover:scale-x-100" />

              </NavLink>

            );

          })}

        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-4 md:flex">

          {!user ? (

            <>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >

                <NavLink
                  to="/login"
                  className="secondary-btn px-5 py-2"
                >

                  Login

                </NavLink>

              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >

                <NavLink
                  to="/register"
                  className="primary-btn px-5 py-2"
                >

                  Register

                </NavLink>

              </motion.div>

            </>

          ) : (

            <div className="flex items-center gap-4">

              {/* User Info (Clickable Link to Profile) */}
              <NavLink
                to="/profile"
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 transition hover:border-slate-700 hover:bg-slate-800/80 cursor-pointer"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white overflow-hidden">

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

                  <p className="text-xs text-slate-400">

                    Welcome

                  </p>

                  <p className="text-sm font-semibold text-white">

                    {user.displayName || "EduVault User"}

                  </p>

                </div>

              </NavLink>

              {/* Logout Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                >

                  <LogOut size={18} />

                  Logout

                </button>

              </motion.div>

            </div>

          )}

        </div>

      </div>

    </motion.header>

  );

}

export default Navbar;