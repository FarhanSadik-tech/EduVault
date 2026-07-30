import { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth";

import { useNavigate, useParams } from "react-router-dom";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import { motion } from "framer-motion";

import {
  BookOpen,
  FileText,
  Download,
  Star,
} from "lucide-react";

function CourseHub() {

  const { user } = useAuth();

  const { departmentId, courseCode } = useParams();

  const navigate = useNavigate();

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  // Course Rating States
  const [courseRating, setCourseRating] = useState({ avg: "0.0", count: 0 });

  const [starHover, setStarHover] = useState(0);

  useEffect(() => {

    const fetchCourseData = async () => {

      try {

        // 1. Fetch Resources
        const snapshot = await getDocs(collection(db, "resources"));

        const allDocs = snapshot.docs.map((docItem) => {

          return {

            id: docItem.id,

            ...docItem.data(),

          };

        });

        const filteredData = allDocs.filter((item) => {

          const targetDept = (departmentId || "").trim().toLowerCase();

          // Remove spaces to handle 'CSE 111' vs 'CSE111'
          const targetCourse = (courseCode || "").trim().toLowerCase().replace(/\s+/g, "");

          const itemDept = (item.department || "").trim().toLowerCase();

          const itemCourse = (item.courseCode || item.course || "").trim().toLowerCase().replace(/\s+/g, "");

          const deptMatch = itemDept === targetDept || !itemDept;

          // STRICT EXACT MATCH (Fixes CSE111 vs CSE111L conflict)
          const courseMatch = itemCourse === targetCourse;

          return deptMatch && courseMatch;

        });

        setResources(filteredData);

        // 2. Fetch Course Ratings
        const ratingsSnapshot = await getDocs(collection(db, "courseRatings"));

        const currentCourseRatings = ratingsSnapshot.docs
          .map((d) => {

            return d.data();

          })
          .filter((r) => {

            const ratingCode = (r.courseCode || "").trim().toLowerCase().replace(/\s+/g, "");

            const targetCode = (courseCode || "").trim().toLowerCase().replace(/\s+/g, "");

            return ratingCode === targetCode;

          });

        if (currentCourseRatings.length > 0) {

          const total = currentCourseRatings.reduce((acc, curr) => {

            return acc + Number(curr.ratingStars || 0);

          }, 0);

          setCourseRating({

            avg: (total / currentCourseRatings.length).toFixed(1),

            count: currentCourseRatings.length,

          });

        } else {

          setCourseRating({ avg: "0.0", count: 0 });

        }

      } catch (error) {

        console.error("Error fetching CourseHub resources & ratings:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchCourseData();

  }, [departmentId, courseCode]);

  // Handle Rate Submission inside Specific Course
  const handleRateThisCourse = async (stars) => {

    if (!user) {

      alert("Please login to rate this course.");

      return;

    }

    try {

      const codeUpper = courseCode.toUpperCase();

      const ratingDocId = `${codeUpper}_${user.uid}`;

      await setDoc(doc(db, "courseRatings", ratingDocId), {

        courseCode: codeUpper,

        userEmail: user.email,

        userUid: user.uid,

        ratingStars: stars,

        updatedAt: serverTimestamp(),

      });

      alert(`Thank you! You rated ${codeUpper} ${stars} Stars ⭐`);

      setCourseRating((prev) => {

        return {

          avg: stars.toFixed(1),

          count: prev.count + 1,

        };

      });

    } catch (error) {

      console.error("Error submitting course rating:", error);

    }

  };

  const handleDownload = (resource) => {

    if (!user) {

      navigate("/login");

      return;

    }

    const linkToOpen = resource.driveLink || resource.fileUrl || resource.url;

    if (linkToOpen) {

      window.open(linkToOpen, "_blank");

    } else {

      alert("Download link not available for this resource.");

    }

  };

  return (

    <section className="mx-auto max-w-7xl px-6 py-16">

      {/* Header */}
      <div className="text-center">

        <BookOpen
          size={60}
          className="mx-auto text-blue-400"
        />

        <h1 className="mt-6 text-5xl font-bold text-white uppercase">

          {courseCode}

        </h1>

        <p className="mt-3 text-slate-400">

          Department: {departmentId?.toUpperCase()}

        </p>

        {/* Course Star Rating Bar */}
        <div className="mt-6 inline-flex flex-col items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4">

          <div className="flex items-center gap-2">

            <span className="text-sm text-slate-400">Course Rating:</span>

            <span className="text-lg font-bold text-yellow-400 flex items-center gap-1">

              ⭐ {courseRating.avg} ({courseRating.count} reviews)

            </span>

          </div>

          <div className="flex items-center gap-1 pt-2 border-t border-slate-800 w-full justify-center">

            <span className="text-xs text-slate-400 mr-2">Rate this course:</span>

            {[1, 2, 3, 4, 5].map((s) => {

              return (

                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => {

                    return setStarHover(s);

                  }}
                  onMouseLeave={() => {

                    return setStarHover(0);

                  }}
                  onClick={() => {

                    return handleRateThisCourse(s);

                  }}
                  className="p-1 transition-transform hover:scale-125"
                >

                  <Star
                    size={20}
                    className={
                      s <= starHover
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-700"
                    }
                  />

                </button>

              );

            })}

          </div>

        </div>

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

          {resources.map((resource, index) => {

            return (

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

                <p className="mt-3 text-slate-400 font-semibold">

                  Type: {resource.resourceType || resource.type || "Document"}

                </p>

                <p className="mt-2 text-slate-500 text-sm">

                  {resource.fileName || resource.courseCode || resource.course}

                </p>

                <button
                  onClick={() => {

                    return handleDownload(resource);

                  }}
                  className="primary-btn mt-8 flex w-full items-center justify-center gap-2"
                >

                  <Download size={18} />

                  Download / View Link

                </button>

              </motion.div>

            );

          })}

        </div>

      )}

    </section>

  );

}

export default CourseHub;