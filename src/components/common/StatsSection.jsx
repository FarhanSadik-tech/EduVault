import { useEffect, useState } from "react";

import { collection, getCountFromServer } from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import {
  FileText,
  BookOpen,
  Users,
  Star,
} from "lucide-react";

function StatsSection() {

  const [stats, setStats] = useState({
    students: 0,
    courses: 12, // Platform fixed course count or dynamic
    resources: 0,
    rating: "4.9",
  });

  // Fetch real live metrics from Firestore
  useEffect(() => {

    const fetchLiveStats = async () => {

      try {

        // 1. Fetch Real Registered Users Count
        const usersColl = collection(db, "users");

        const usersSnapshot = await getCountFromServer(usersColl);

        const usersCount = usersSnapshot.data().count;

        // 2. Fetch Real Total Resources Count
        const resourcesColl = collection(db, "resources");

        const resourcesSnapshot = await getCountFromServer(resourcesColl);

        const resourcesCount = resourcesSnapshot.data().count;

        setStats((prev) => {

          return {

            ...prev,

            students: usersCount,

            resources: resourcesCount,

          };

        });

      } catch (error) {

        console.error("Error fetching live StatsSection metrics:", error);

      }

    };

    fetchLiveStats();

  }, []);

  return (

    <section className="mt-16">

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* Card 1: Registered Students */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">

            <Users
              size={42}
              className="text-green-400"
            />

          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">

            {stats.students}

          </h2>

          <p className="mt-2 text-slate-400">

            Registered Students

          </p>

        </div>

        {/* Card 2: Active Courses */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">

            <BookOpen
              size={42}
              className="text-blue-400"
            />

          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">

            {stats.courses}+

          </h2>

          <p className="mt-2 text-slate-400">

            Academic Courses

          </p>

        </div>

        {/* Card 3: Total Uploaded Resources */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">

            <FileText
              size={42}
              className="text-cyan-400"
            />

          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">

            {stats.resources}

          </h2>

          <p className="mt-2 text-slate-400">

            Uploaded Resources

          </p>

        </div>

        {/* Card 4: Platform Average Rating */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">

            <Star
              size={42}
              className="text-yellow-400 fill-yellow-400"
            />

          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">

            {stats.rating}

          </h2>

          <p className="mt-2 text-slate-400">

            Average Rating

          </p>

        </div>

      </div>

    </section>

  );

}

export default StatsSection;