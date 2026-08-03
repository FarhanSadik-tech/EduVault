import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { useNavigate } from "react-router-dom";

const rankBadges = ["🥇", "🥈", "🥉", "🏅"];

function TopContributors() {
  const navigate = useNavigate();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real-time top contributors from Firestore
  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        // 1. Fetch Resources
        const resourcesSnapshot = await getDocs(collection(db, "resources"));
        const uploadCounts = {};
        const userNames = {};

        resourcesSnapshot.docs.forEach((docItem) => {
          const data = docItem.data();
          const email = data.uploadedByEmail || data.uploadedBy || "anonymous@student.edu";
          const name = data.uploadedByName || data.uploaderName || email.split("@")[0];

          uploadCounts[email] = (uploadCounts[email] || 0) + 1;
          userNames[email] = name;
        });

        // 2. Fetch Registered Users for additional name mapping if available
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.docs.forEach((uDoc) => {
          const uData = uDoc.data();
          if (uData.email) {
            userNames[uData.email] = uData.name || userNames[uData.email] || uData.email.split("@")[0];
          }
        });

        // 3. Process & Sort Top Contributors
        const contributorList = Object.keys(uploadCounts).map((email, idx) => {
          const uploads = uploadCounts[email];
          // Calculate Reputation: 25 points per uploaded resource
          const reputation = uploads * 25;

          return {
            id: email || idx,
            email: email,
            name: userNames[email] || "Academic Contributor",
            uploads: uploads,
            reputation: reputation,
          };
        });

        // Sort by highest uploads/reputation and pick top 4
        const top4 = contributorList
          .sort((a, b) => b.uploads - a.uploads)
          .slice(0, 4)
          .map((item, index) => ({
            ...item,
            rank: rankBadges[index] || "🏅",
          }));

        setContributors(top4);
      } catch (error) {
        console.error("Error fetching top contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopContributors();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 text-center text-slate-400">
        Loading Top Contributors Leaderboard...
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mx-auto mt-24 max-w-[1400px] px-8"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white">
          🏆 Top Contributors
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Students who actively contribute quality academic resources to help the learning community.
        </p>
      </div>

      {contributors.length === 0 ? (
        <div className="card-style mt-12 p-8 text-center text-slate-400">
          No resource uploads tracked yet. Be the first contributor!
        </div>
      ) : (
        /* Contributor Cards Grid Layout */
        <div className="mt-14 grid gap-8 p-2 md:grid-cols-2 xl:grid-cols-4">
          {contributors.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="card-style group p-7 text-center"
            >
              {/* Rank Badge */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-5xl shadow-lg"
              >
                {student.rank}
              </motion.div>

              {/* Name */}
              <h3 className="mt-6 text-2xl font-bold capitalize text-white transition group-hover:text-blue-400">
                {student.name}
              </h3>

              {/* Reputation */}
              <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                <p className="text-sm text-slate-400">
                  ⭐ Reputation
                </p>
                <p className="mt-2 text-4xl font-bold text-blue-400">
                  {student.reputation}
                </p>
              </div>

              {/* Upload Stats */}
              <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                <p className="text-sm text-slate-400">
                  📄 Uploaded Resources
                </p>
                <p className="mt-2 text-3xl font-bold text-green-400">
                  {student.uploads}
                </p>
              </div>

              {/* View Profile Button */}
              <motion.button
                onClick={() => navigate("/profile")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="primary-btn mt-8 w-full"
              >
                View Profile →
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default TopContributors;