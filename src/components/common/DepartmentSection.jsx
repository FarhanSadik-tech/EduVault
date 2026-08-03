import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import {
  Laptop,
  Zap,
  BriefcaseBusiness,
  Building2,
  BookOpen,
  FileText,
} from "lucide-react";

const initialDepartments = [
  {
    id: 1,
    icon: <Laptop size={40} className="text-blue-400" />,
    name: "Computer Science & Engineering",
    short: "CSE",
    deptKey: "cse",
    courses: 0,
    resources: 0,
  },
  {
    id: 2,
    icon: <Zap size={40} className="text-yellow-400" />,
    name: "Electrical & Electronic Engineering",
    short: "EEE",
    deptKey: "eee",
    courses: 0,
    resources: 0,
  },
  {
    id: 3,
    icon: <BriefcaseBusiness size={40} className="text-emerald-400" />,
    name: "Business Administration",
    short: "BBA",
    deptKey: "bba",
    courses: 0,
    resources: 0,
  },
  {
    id: 4,
    icon: <Building2 size={40} className="text-orange-400" />,
    name: "Civil Engineering",
    short: "Civil",
    deptKey: "civil",
    courses: 0,
    resources: 0,
  },
];

function DepartmentSection() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState(initialDepartments);

  // Real-time listener for Courses & Resources per Department
  useEffect(() => {
    let liveCoursesList = [];
    let liveResourcesList = [];

    const updateStats = () => {
      const updatedDepts = initialDepartments.map((dept) => {
        // 1. Count Total Live Courses added for this Department
        const deptCourses = liveCoursesList.filter((c) => {
          const cDept = (c.departmentId || "").trim().toLowerCase();
          return cDept === dept.deptKey || cDept.includes(dept.deptKey);
        }).length;

        // 2. Count Total Resources uploaded for this Department
        const deptResources = liveResourcesList.filter((res) => {
          const rDept = (res.department || "").trim().toLowerCase();
          return rDept === dept.deptKey || rDept.includes(dept.deptKey);
        }).length;

        return {
          ...dept,
          courses: deptCourses,
          resources: deptResources,
        };
      });

      setDepartments(updatedDepts);
    };

    // Listen to Firestore "courses" Collection
    const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
      liveCoursesList = snapshot.docs.map((docItem) => docItem.data());
      updateStats();
    });

    // Listen to Firestore "resources" Collection
    const unsubResources = onSnapshot(collection(db, "resources"), (snapshot) => {
      liveResourcesList = snapshot.docs.map((docItem) => docItem.data());
      updateStats();
    });

    return () => {
      unsubCourses();
      unsubResources();
    };
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
          Browse by Department
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Explore previous questions, lecture notes, study materials and resources organized by department.
        </p>
      </div>

      {/* Department Cards Grid Layout */}
      <div className="mt-14 grid gap-8 p-2 sm:grid-cols-2 lg:grid-cols-4">
        {departments.map((department, index) => (
          <motion.div
            key={department.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="card-style group flex flex-col justify-between p-7"
          >
            <div>
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 shadow-lg"
              >
                {department.icon}
              </motion.div>

              {/* Department Code Badge */}
              <span className="mt-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
                {department.short}
              </span>

              {/* Name */}
              <h3 className="mt-4 text-2xl font-bold text-white transition group-hover:text-blue-400">
                {department.short}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {department.name}
              </p>

              {/* Real-time Dynamic Stats */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <BookOpen size={18} className="text-blue-400" />
                    <span>Courses</span>
                  </div>
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-sm font-semibold text-white">
                    {department.courses}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText size={18} className="text-cyan-400" />
                    <span>Resources</span>
                  </div>
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-sm font-semibold text-white">
                    {department.resources}
                  </span>
                </div>
              </div>
            </div>

            {/* Explore Button Navigation */}
            <motion.button
              onClick={() => navigate(`/semester/${department.deptKey}`)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="primary-btn mt-8 flex w-full items-center justify-center gap-2"
            >
              Explore →
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default DepartmentSection;