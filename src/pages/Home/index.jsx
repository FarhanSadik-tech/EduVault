import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, ChevronDown, ChevronUp } from "lucide-react";

import HeroSection from "../../components/common/HeroSection";
import StatsSection from "../../components/common/StatsSection";
import DepartmentSection from "../../components/common/DepartmentSection";
import PopularCourses from "../../components/common/PopularCourses";
import LatestResources from "../../components/common/LatestResources";
import TopContributors from "../../components/common/TopContributors";

const sectionAnimation = {
  initial: {
    opacity: 0,
    y: 50,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.7,
  },
  viewport: {
    once: true,
    amount: 0.2,
  },
};

function Home() {
  const [notices, setNotices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch maximum 3 active broadcasted notices from Firestore
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const q = query(
          collection(db, "notices"),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((docItem) => {
          return {
            id: docItem.id,
            ...docItem.data(),
          };
        });

        setNotices(list);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <main className="overflow-hidden">
      {/* Global Dynamic Auto-Scrolling Notice Banner with Clickable Dropdown */}
      {notices.length > 0 && (
        <div className="relative border-b border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 px-6 py-3.5 shadow-md z-40">
          <div className="mx-auto flex max-w-7xl items-center gap-4 text-sm text-white">
            
            {/* 1. CLICKABLE Left Notice Badge with Dropdown Toggle */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="z-10 flex shrink-0 items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/20 px-3.5 py-1 text-cyan-300 shadow-md backdrop-blur-md transition hover:bg-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer"
              title="Click to view all notices"
            >
              <BellRing size={18} className="animate-bounce text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                Notice ({notices.length})
              </span>
              {isDropdownOpen ? (
                <ChevronUp size={16} className="text-cyan-300" />
              ) : (
                <ChevronDown size={16} className="text-cyan-300" />
              )}
            </button>

            {/* 2. AUTO SCROLLING Right Text Stream */}
            <div className="relative flex flex-1 overflow-hidden">
              <motion.div
                className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8"
                animate={{
                  x: ["0%", "-100%"],
                }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: notices.length * 12,
                }}
              >
                {/* Loop Notice Items */}
                {notices.map((notice, index) => (
                  <div
                    key={notice.id || index}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-950/80 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                      [{notice.title}]
                    </span>

                    <span className="font-medium text-slate-200">
                      {notice.message}
                    </span>

                    <span className="ml-5 font-black text-cyan-500/40">•</span>
                  </div>
                ))}
              </motion.div>

              {/* Duplicate List for Continuous Seamless Infinity Loop */}
              <motion.div
                className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8"
                animate={{
                  x: ["0%", "-100%"],
                }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: notices.length * 12,
                }}
              >
                {notices.map((notice, index) => (
                  <div
                    key={`duplicate-${notice.id || index}`}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-950/80 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                      [{notice.title}]
                    </span>

                    <span className="font-medium text-slate-200">
                      {notice.message}
                    </span>

                    <span className="ml-5 font-black text-cyan-500/40">•</span>
                  </div>
                ))}
              </motion.div>
            </div>

          </div>

          {/* 3. DROPDOWN NOTICE MENU (Shows on click) */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-6 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl z-50 origin-top"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <BellRing size={15} /> All Active Notices
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Latest {notices.length} updates
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {notices.map((notice, idx) => (
                    <div
                      key={notice.id || idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs transition hover:border-cyan-500/40"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-bold text-cyan-300 border border-cyan-500/20 text-[11px]">
                          [{notice.title}]
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium leading-relaxed pl-1">
                        {notice.message}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      <motion.div {...sectionAnimation}>
        <HeroSection />
      </motion.div>

      <motion.div {...sectionAnimation}>
        <StatsSection />
      </motion.div>

      <motion.div {...sectionAnimation}>
        <DepartmentSection />
      </motion.div>

      <motion.div {...sectionAnimation}>
        <PopularCourses />
      </motion.div>

      <motion.div {...sectionAnimation}>
        <LatestResources />
      </motion.div>

      <motion.div {...sectionAnimation}>
        <TopContributors />
      </motion.div>
    </main>
  );
}

export default Home;