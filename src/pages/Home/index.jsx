import { useEffect, useState } from "react";

import { collection, getDocs, query, orderBy } from "firebase/firestore";

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

  // Fetch active broadcasted notices from Firestore
  useEffect(() => {

    const fetchNotices = async () => {

      try {

        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));

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

      {/* Global Notice Broadcast Banner */}
      {notices.length > 0 && (

        <div className="bg-gradient-to-r from-blue-900/80 to-cyan-900/80 border-b border-blue-500/30 px-6 py-3.5">

          <div className="mx-auto max-w-7xl flex items-center gap-3 text-sm text-white">

            <BellRing
              size={20}
              className="text-cyan-400 shrink-0 animate-bounce"
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">

              <span className="font-bold text-cyan-300">

                [{notices[0].title}]

              </span>

              <span className="text-slate-200">

                {notices[0].message}

              </span>

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