import { useContext, useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import { motion } from "framer-motion";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  BookOpen,
  FileText,
  Download,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

function CourseHub() {

  const { departmentId, courseCode } = useParams();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchResources = async () => {

      try {

        const q = query(

          collection(db, "resources"),

          where("department", "==", departmentId),

          where("course", "==", courseCode)

        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setResources(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchResources();

  }, [departmentId, courseCode]);

  const handleDownload = () => {

    if (!user) {

      alert("Please login to download this resource.");

      navigate("/login");

      return;

    }

    alert(
      "Real file download will be available after Firebase Storage integration."
    );

  };

  return (

    <section className="mx-auto max-w-7xl px-6 py-16">

      {/* Header */}

      <div className="text-center">

        <BookOpen
          size={60}
          className="mx-auto text-blue-400"
        />

        <h1 className="mt-6 text-5xl font-bold text-white">
          {courseCode}
        </h1>

        <p className="mt-3 text-slate-400">
          Department: {departmentId.toUpperCase()}
        </p>

        <p className="mt-2 text-slate-500">
          Browse all academic resources for this course.
        </p>

      </div>

      {loading ? (

        <div className="mt-16 text-center">

          <h2 className="text-2xl text-white">
            Loading resources...
          </h2>

        </div>

      ) : resources.length === 0 ? (

        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

          <h2 className="text-3xl font-bold text-white">
            No Resources Found
          </h2>

          <p className="mt-4 text-slate-400">
            No one has uploaded any resources for this course yet.
          </p>

        </div>

      ) : (

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {resources.map((resource, index) => (

            <motion.div

              key={resource.id}

              initial={{
                opacity: 0,
                y: 40,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}

              whileHover={{
                y: -8,
                scale: 1.02,
              }}

              viewport={{
                once: true,
              }}

              className="card-style p-8"

            >

              <FileText
                size={45}
                className="text-blue-400"
              />

              <h2 className="mt-6 text-2xl font-bold text-white">
                {resource.title}
              </h2>

              <p className="mt-3 text-slate-400">
                {resource.type}
              </p>

              <p className="mt-2 text-slate-500">
                {resource.fileName}
              </p>

              <button

                onClick={handleDownload}

                className="primary-btn mt-8 flex w-full items-center justify-center gap-2"

              >

                <Download size={18} />

                Download

              </button>

            </motion.div>

          ))}

        </div>

      )}

    </section>

  );

}

export default CourseHub;