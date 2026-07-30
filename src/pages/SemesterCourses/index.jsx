import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { NavLink, Navigate, useParams } from "react-router-dom";

import { BookOpen, ArrowRight, Plus, Edit, Trash2, X, Check } from "lucide-react";

import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import useAuth from "../../hooks/useAuth";

import departments from "../../data/departments";

function SemesterCourses() {

  const { departmentId, semesterId } = useParams();

  const { user } = useAuth();

  const isAdmin = user && user.email === "xarhan62@gmail.com"; // আপনার অ্যাডমিন ইমেইল চেক

  const [courseList, setCourseList] = useState([]);

  const [loading, setLoading] = useState(true);

  // Add / Edit Modal States
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [editingCourseId, setEditingCourseId] = useState(null);

  const [courseTitle, setCourseTitle] = useState("");

  const [courseCode, setCourseCode] = useState("");

  const [courseCredit, setCourseCredit] = useState("3");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const department = departments.find((dept) => {

    return dept.id === departmentId;

  });

  // 1. Fetch Real-time Courses for this Department & Semester
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {

        const list = snapshot.docs
          .map((d) => {

            return { id: d.id, ...d.data() };

          })
          .filter((c) => {

            const targetDept = (departmentId || "").toLowerCase();

            const targetSem = (semesterId || "").toLowerCase();

            const cDept = (c.departmentId || "").toLowerCase();

            const cSem = (c.semesterId || "").toLowerCase();

            return cDept === targetDept && cSem === targetSem;

          });

        setCourseList(list);

        setLoading(false);

      },
      (error) => {

        console.error("Error fetching dynamic courses:", error);

        setLoading(false);

      }

    );

    return () => {

      return unsub();

    };

  }, [departmentId, semesterId]);

  if (!department) {

    return (

      <Navigate
        to="/department"
        replace
      />

    );

  }

  // Handle Create or Edit Course
  const handleSaveCourse = async (e) => {

    e.preventDefault();

    if (!courseTitle.trim() || !courseCode.trim()) {

      alert("Please fill in course title and code.");

      return;

    }

    setIsSubmitting(true);

    try {

      const cleanCode = courseCode.trim().toUpperCase();

      const docId = editingCourseId || `${departmentId}_${semesterId}_${cleanCode}`;

      const courseData = {

        departmentId: departmentId.toLowerCase(),

        semesterId: semesterId.toLowerCase(),

        title: courseTitle.trim(),

        code: cleanCode,

        credit: courseCredit || "3",

        updatedAt: serverTimestamp(),

      };

      await setDoc(doc(db, "courses", docId), courseData, { merge: true });

      setShowCourseModal(false);

      setEditingCourseId(null);

      setCourseTitle("");

      setCourseCode("");

      setCourseCredit("3");

      alert(editingCourseId ? "Course updated!" : "New Course Added!");

    } catch (error) {

      console.error("Error saving course:", error);

    } finally {

      setIsSubmitting(false);

    }

  };

  // Open Edit Modal
  const handleOpenEdit = (course) => {

    setEditingCourseId(course.id);

    setCourseTitle(course.title);

    setCourseCode(course.code);

    setCourseCredit(course.credit || "3");

    setShowCourseModal(true);

  };

  // Handle Delete Course
  const handleDeleteCourse = async (cId) => {

    if (window.confirm("Are you sure you want to delete this course?")) {

      try {

        await deleteDoc(doc(db, "courses", cId));

      } catch (error) {

        console.error("Error deleting course:", error);

      }

    }

  };

  return (

    <section className="mx-auto max-w-7xl px-6 py-16">

      {/* Header */}
      <div className="text-center">

        <h1 className="text-5xl font-bold text-white uppercase">

          {department.shortName || departmentId} Courses

        </h1>

        <p className="mt-4 text-slate-400">

          {semesterId?.replace("-", " ").toUpperCase()}

        </p>

        {/* Admin Add Course Top Button */}
        {isAdmin && (

          <div className="mt-6">

            <button
              onClick={() => {

                setEditingCourseId(null);

                setCourseTitle("");

                setCourseCode("");

                setCourseCredit("3");

                setShowCourseModal(true);

              }}
              className="primary-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >

              <Plus size={18} />

              Add New Course

            </button>

          </div>

        )}

      </div>

      {loading ? (

        <div className="mt-16 text-center text-slate-400">

          Loading semester courses...

        </div>

      ) : courseList.length === 0 ? (

        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

          <h2 className="text-2xl font-semibold text-white">

            No courses available yet.

          </h2>

          <p className="mt-3 text-slate-400">

            This semester will be added soon.

          </p>

          {/* Admin Fallback Add Button */}
          {isAdmin && (

            <button
              onClick={() => {

                return setShowCourseModal(true);

              }}
              className="primary-btn mt-6 inline-flex items-center gap-2 text-sm"
            >

              <Plus size={18} />

              Add Course For {semesterId?.replace("-", " ").toUpperCase()}

            </button>

          )}

        </div>

      ) : (

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {courseList.map((course, index) => {

            return (

              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card-style p-8 flex flex-col justify-between relative group"
              >

                <div>

                  <div className="flex items-center justify-between">

                    <BookOpen size={40} className="text-blue-400" />

                    {/* Admin Actions Bar */}
                    {isAdmin && (

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => {

                            return handleOpenEdit(course);

                          }}
                          className="p-2 text-slate-400 hover:text-blue-400 transition"
                          title="Edit Course"
                        >

                          <Edit size={16} />

                        </button>

                        <button
                          onClick={() => {

                            return handleDeleteCourse(course.id);

                          }}
                          className="p-2 text-slate-400 hover:text-red-400 transition"
                          title="Delete Course"
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    )}

                  </div>

                  <h2 className="mt-6 text-3xl font-bold text-white">

                    {course.code}

                  </h2>

                  <p className="mt-3 text-slate-300">

                    {course.title}

                  </p>

                  <div className="mt-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

                    {course.credit || "3"} Credit

                  </div>

                </div>

                <NavLink
                  to={`/coursehub/${departmentId}/${course.code.toLowerCase()}`}
                  className="primary-btn mt-8 flex items-center justify-center gap-2"
                >

                  View Resources

                  <ArrowRight size={18} />

                </NavLink>

              </motion.div>

            );

          })}

        </div>

      )}

      {/* Admin Add / Edit Course Modal */}
      {showCourseModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">

              <h3 className="text-xl font-bold text-white">

                {editingCourseId ? "Edit Course" : "Add New Course"}

              </h3>

              <button
                onClick={() => {

                  return setShowCourseModal(false);

                }}
                className="text-slate-400 hover:text-white"
              >

                <X size={20} />

              </button>

            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">

              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-1">Course Name / Title</label>

                <input
                  type="text"
                  placeholder="e.g. Structured Programming"
                  value={courseTitle}
                  onChange={(e) => {

                    return setCourseTitle(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-1">Course Code</label>

                <input
                  type="text"
                  placeholder="e.g. CSE111"
                  value={courseCode}
                  onChange={(e) => {

                    return setCourseCode(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 uppercase"
                  required
                />

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-1">Credit</label>

                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={courseCredit}
                  onChange={(e) => {

                    return setCourseCredit(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />

              </div>

              <div className="pt-4 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {

                    return setShowCourseModal(false);

                  }}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-btn flex items-center gap-2 px-5 py-2 text-xs"
                >

                  <Check size={16} />

                  {isSubmitting ? "Saving..." : "Save Course"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </section>

  );

}

export default SemesterCourses;