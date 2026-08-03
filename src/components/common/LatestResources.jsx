import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import ResourceCard from "./ResourceCard";

function LatestResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Query top 6 latest resources ordered by creation date
        const q = query(
          collection(db, "resources"),
          orderBy("createdAt", "desc"),
          limit(6)
        );

        let snapshot;
        try {
          snapshot = await getDocs(q);
        } catch (indexError) {
          // Fallback if index not built yet
          snapshot = await getDocs(collection(db, "resources"));
        }

        const data = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        // Ensure exactly latest 6 resources are shown
        const latest6 = data.slice(0, 6);
        setResources(latest6);
      } catch (error) {
        console.error("Error fetching latest 6 resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

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
          📂 Latest Resources
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Recently uploaded questions, notes, solutions and learning
          materials from the community.
        </p>
      </div>

      {/* Resource Cards (Grid layout optimized for 6 items) */}
      <div className="mt-14 grid gap-8 p-2 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-slate-400">
            Loading latest 6 resources...
          </p>
        ) : resources.length === 0 ? (
          <p className="col-span-full text-center text-slate-400">
            No resources uploaded yet.
          </p>
        ) : (
          resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ResourceCard resource={resource} />
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}

export default LatestResources;