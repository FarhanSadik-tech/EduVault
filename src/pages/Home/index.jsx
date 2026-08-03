import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { motion } from "framer-motion";
import { BellRing } from "lucide-react";

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

  // Fetch maximum 3 active broadcasted notices from Firestore
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // 🔥 limit(3) দিয়ে ডাটাবেজ থেকে লেটেস্ট ৩টি নোটিশ ফেচ করা হচ্ছে
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
      {/* Dynamic Global Notice Ticker Banner (Max 3 Notices) */}
      {notices.length > 0 && (
        <div className="border-b border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 px-6 py-3.5 shadow-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden text-sm text-white">
            
            {/* Notice Badge Icon */}
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-400">
              <BellRing size={18} className="animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Notice ({notices.length})
              </span>
            </div>

            {/* Dynamic Notice Ticker List */}
            <div className="flex w-full items-center gap-6 overflow-x-auto py-0.5 no-scrollbar">
              {notices.map((notice, index) => (
                <div
                  key={notice.id || index}
                  className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-sm"
                >
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-950/80 px-2 py-0.5 text-xs font-bold text-cyan-300">
                    [{notice.title}]
                  </span>

                  <span className="font-medium text-slate-200">
                    {notice.message}
                  </span>

                  {/* Bullet Separator between multiple notices */}
                  {index < notices.length - 1 && (
                    <span className="ml-4 font-black text-cyan-500/40">•</span>
                  )}
                </div>
              ))}
            </div>

          </div>
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