import { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth";

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import { motion } from "framer-motion";

import {
  MessageSquare,
  Search,
  Send,
  User,
} from "lucide-react";

const allSemestersList = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "9th Semester",
  "10th Semester",
  "11th Semester",
  "12th Semester",
];

function Discussion() {

  const { user } = useAuth();

  // Selector States
  const [selectedDept, setSelectedDept] = useState("cse");

  const [selectedSemester, setSelectedSemester] = useState("1st Semester");

  // Real-time Data States
  const [uploadedCourses, setUploadedCourses] = useState([]);

  const [discussions, setDiscussions] = useState([]);

  // Discussion Form States
  const [selectedCourseForDiscussion, setSelectedCourseForDiscussion] = useState("GENERAL");

  const [newTopic, setNewTopic] = useState("");

  const [newContent, setNewContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Uploaded Course Codes for Selector Dropdown
  useEffect(() => {

    const resourcesRef = collection(db, "resources");

    const unsubscribe = onSnapshot(
      resourcesRef,
      (snapshot) => {

        const courseSet = new Set();

        snapshot.docs.forEach((docItem) => {

          const data = docItem.data();

          const itemDept = (data.department || "").trim().toLowerCase();

          const itemSem = (data.semester || "").trim().toLowerCase();

          const targetDept = selectedDept.trim().toLowerCase();

          const targetSem = selectedSemester.trim().toLowerCase();

          const isDeptMatch = itemDept === targetDept || itemDept.includes(targetDept);

          const isSemMatch = itemSem === targetSem || itemSem.includes(targetSem);

          if (isDeptMatch && isSemMatch) {

            const rawCode = data.courseCode || data.course;

            if (rawCode) {

              courseSet.add(rawCode.trim().toUpperCase());

            }

          }

        });

        setUploadedCourses(Array.from(courseSet));

      },
      (error) => {

        console.error("Error fetching course list for discussion:", error);

      }

    );

    return () => {

      return unsubscribe();

    };

  }, [selectedDept, selectedSemester]);

  // 2. Real-time Subscription to Discussions for Selected Dept & Semester
  useEffect(() => {

    const discQuery = query(collection(db, "discussions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      discQuery,
      (snapshot) => {

        const discData = snapshot.docs
          .map((d) => {

            return { id: d.id, ...d.data() };

          })
          .filter((disc) => {

            const isDeptMatch = (disc.department || "").toLowerCase() === selectedDept.toLowerCase();

            const isSemMatch = (disc.semester || "").toLowerCase() === selectedSemester.toLowerCase();

            return isDeptMatch && isSemMatch;

          });

        setDiscussions(discData);

      },
      (error) => {

        console.error("Error listening to live discussions:", error);

      }

    );

    return () => {

      return unsubscribe();

    };

  }, [selectedDept, selectedSemester]);

  // Handle Post Discussion
  const handlePostDiscussion = async (e) => {

    e.preventDefault();

    if (!user) {

      alert("Please login to post in the discussion forum.");

      return;

    }

    if (!newTopic.trim() || !newContent.trim()) {

      alert("Please fill in both title and details.");

      return;

    }

    setIsSubmitting(true);

    try {

      const postData = {

        courseCode: selectedCourseForDiscussion || "GENERAL",

        department: selectedDept.toUpperCase(),

        semester: selectedSemester,

        topic: newTopic,

        content: newContent,

        authorName: user.displayName || user.email.split("@")[0],

        authorEmail: user.email,

        createdAt: serverTimestamp(),

      };

      await addDoc(collection(db, "discussions"), postData);

      setNewTopic("");

      setNewContent("");

      alert("Discussion posted successfully!");

    } catch (error) {

      console.error("Error adding discussion:", error);

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <section className="mx-auto max-w-7xl px-6 py-16">

      {/* Page Title Header */}
      <div className="text-center">

        <MessageSquare
          size={55}
          className="mx-auto text-blue-400"
        />

        <h1 className="mt-4 text-4xl font-bold text-white">

          Academic Discussion Forum

        </h1>

        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">

          Select your department & semester to join specific course discussions!

        </p>

      </div>

      {/* Step 1: Department & Semester Selection Toolbar */}
      <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">

        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">

          <Search size={20} className="text-blue-400" />

          Select Department & Semester:

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Department Select */}
          <div>

            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">

              1. Department

            </label>

            <select
              value={selectedDept}
              onChange={(e) => {

                return setSelectedDept(e.target.value);

              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >

              <option value="cse">CSE (Computer Science)</option>

              <option value="eee">EEE (Electrical Eng.)</option>

              <option value="bba">BBA (Business Admin)</option>

              <option value="civil">Civil Engineering</option>

            </select>

          </div>

          {/* Semester Select */}
          <div>

            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">

              2. Semester

            </label>

            <select
              value={selectedSemester}
              onChange={(e) => {

                return setSelectedSemester(e.target.value);

              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >

              {allSemestersList.map((sem) => {

                return (

                  <option key={sem} value={sem}>

                    {sem}

                  </option>

                );

              })}

            </select>

          </div>

        </div>

      </div>

      {/* Step 2: Academic Discussion Forum */}
      <div className="mt-16">

        <div className="text-center mb-12">

          <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">

            <MessageSquare size={32} className="text-blue-400" />

            {selectedDept.toUpperCase()} ({selectedSemester}) Forum

          </h3>

          <p className="mt-2 text-slate-400 text-sm">

            Discuss questions and topics related to {selectedSemester} courses!

          </p>

        </div>

        {/* Post New Topic Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 mb-12 shadow-xl">

          <h4 className="text-lg font-bold text-white mb-6">

            Start a New Discussion for {selectedSemester}

          </h4>

          <form onSubmit={handlePostDiscussion} className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">

              {/* Related Course Selector */}
              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-2">

                  Select Course:

                </label>

                <select
                  value={selectedCourseForDiscussion}
                  onChange={(e) => {

                    return setSelectedCourseForDiscussion(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                >

                  <option value="GENERAL">General Semester Discussion</option>

                  {uploadedCourses.map((cCode) => {

                    return (

                      <option key={cCode} value={cCode}>

                        {cCode}

                      </option>

                    );

                  })}

                </select>

              </div>

              {/* Title Input */}
              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-2">

                  Topic Title:

                </label>

                <input
                  type="text"
                  placeholder="e.g. Need solution for Chapter 3 Assignment"
                  value={newTopic}
                  onChange={(e) => {

                    return setNewTopic(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                />

              </div>

            </div>

            {/* Content Textarea */}
            <div>

              <label className="block text-xs font-semibold text-slate-400 mb-2">

                Discussion Details:

              </label>

              <textarea
                rows={3}
                placeholder="Write your detailed query or thoughts here..."
                value={newContent}
                onChange={(e) => {

                  return setNewContent(e.target.value);

                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm resize-none"
              ></textarea>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn flex items-center gap-2 px-6 py-2.5 text-sm"
            >

              <Send size={16} />

              {isSubmitting ? "Posting..." : "Post to Forum"}

            </button>

          </form>

        </div>

        {/* Discussion Feed */}
        <div className="space-y-6">

          {discussions.length === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400 text-sm">

              No discussions posted for {selectedSemester} yet. Be the first to start a conversation!

            </div>

          ) : (

            discussions.map((disc) => {

              return (

                <motion.div
                  key={disc.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="card-style p-6"
                >

                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-3">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">

                        <User size={16} />

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-white">

                          {disc.authorName}

                        </p>

                        <p className="text-[11px] text-slate-500">

                          {disc.authorEmail}

                        </p>

                      </div>

                    </div>

                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">

                      {disc.courseCode}

                    </span>

                  </div>

                  <h5 className="text-lg font-bold text-white mb-2">

                    {disc.topic}

                  </h5>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4">

                    {disc.content}

                  </p>

                </motion.div>

              );

            })

          )}

        </div>

      </div>

    </section>

  );

}

export default Discussion;