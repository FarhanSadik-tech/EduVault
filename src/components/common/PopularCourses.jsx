import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { Star, FileText, BookOpen, CheckCircle, FileCode, FlaskConical } from "lucide-react";

function PopularCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active uploaded courses dynamically from Firestore
  useEffect(() => {
    const fetchUploadedPopularCourses = async () => {
      try {
        // 1. Fetch Resources
        const resourcesSnapshot = await getDocs(collection(db, "resources"));
        const resourceList = resourcesSnapshot.docs.map((docItem) => docItem.data());

        // 2. Fetch Ratings
        const ratingsSnapshot = await getDocs(collection(db, "courseRatings"));
        const ratingList = ratingsSnapshot.docs.map((docItem) => docItem.data());

        // Group resources by courseCode or course
        const courseMap = {};

        resourceList.forEach((res) => {
          const rawCode = res.courseCode || res.course || "GENERAL";
          const courseCode = rawCode.trim().toUpperCase();
          const dept = (res.department || "cse").toLowerCase();
          const title = res.courseName || res.title || courseCode;

          if (!courseMap[courseCode]) {
            courseMap[courseCode] = {
              code: courseCode,
              name: title,
              departmentId: dept,
              questions: 0,
              notes: 0,
              solutions: 0,
              assignments: 0,
              labReports: 0,
            };
          }

          const resType = (res.resourceType || res.type || "").toLowerCase();

          if (resType.includes("question") || resType.includes("ques")) {
            courseMap[courseCode].questions += 1;
          } else if (resType.includes("note")) {
            courseMap[courseCode].notes += 1;
          } else if (resType.includes("solution") || resType.includes("ans")) {
            courseMap[courseCode].solutions += 1;
          } else if (resType.includes("assignment") || resType.includes("assign")) {
            courseMap[courseCode].assignments += 1;
          } else if (resType.includes("lab") || resType.includes("report")) {
            courseMap[courseCode].labReports += 1;
          } else {
            courseMap[courseCode].notes += 1;
          }
        });

        // Calculate Average Rating per course
        const processedCourses = Object.values(courseMap).map((cItem) => {
          const courseRatings = ratingList.filter((r) => r.courseCode === cItem.code);

          let avgRating = 0;
          if (courseRatings.length > 0) {
            const totalStars = courseRatings.reduce((acc, curr) => acc + Number(curr.ratingStars || 0), 0);
            avgRating = Number((totalStars / courseRatings.length).toFixed(1));
          } else {
            avgRating = 0.0;
          }

          return {
            ...cItem,
            rating: avgRating,
            ratingCount: courseRatings.length,
          };
        });

        // Sort by Highest Rating & Take First 3 Courses
        const top3Courses = processedCourses
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);

        setCourses(top3Courses);
      } catch (error) {
        console.error("Error fetching uploaded courses for Popular Courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPopularCourses();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 text-center text-slate-400">
        Loading Top Popular Courses...
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
          🔥 Top 3 Popular Courses
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Explore top 3 highest-rated active courses with real uploaded materials. Open course to rate!
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="card-style mt-12 p-8 text-center text-slate-400">
          No course materials uploaded yet. Upload resources to activate course listings!
        </div>
      ) : (
        /* Top 3 Cards Grid Layout with extra padding so hover doesn't clip */
        <div className="mt-14 grid gap-8 p-2 md:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.code}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="card-style group p-7"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
                  {course.code}
                </span>

                <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-semibold uppercase text-purple-400">
                  {course.departmentId} Faculty
                </span>
              </div>

              {/* Course Title */}
              <h3 className="mt-5 text-2xl font-bold text-white transition group-hover:text-blue-400">
                {course.name}
              </h3>

              {/* Stats */}
              <div className="mt-6 space-y-3">
                {/* Rating Display */}
                <div className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Course Rating ({course.ratingCount} Ratings)
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-yellow-400">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {course.rating.toFixed(1)}
                  </span>
                </div>

                {/* Questions Row */}
                <div className="flex justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <FileText size={14} className="text-cyan-400" />
                    Questions
                  </span>
                  <span className="font-semibold text-white">
                    {course.questions}
                  </span>
                </div>

                {/* Notes Row */}
                <div className="flex justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <BookOpen size={14} className="text-blue-400" />
                    Notes
                  </span>
                  <span className="font-semibold text-white">
                    {course.notes}
                  </span>
                </div>

                {/* Solutions Row */}
                <div className="flex justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle size={14} className="text-green-400" />
                    Solutions
                  </span>
                  <span className="font-semibold text-white">
                    {course.solutions}
                  </span>
                </div>

                {/* Assignments Row */}
                <div className="flex justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <FileCode size={14} className="text-purple-400" />
                    Assignments
                  </span>
                  <span className="font-semibold text-white">
                    {course.assignments}
                  </span>
                </div>

                {/* Lab Reports Row */}
                <div className="flex justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <FlaskConical size={14} className="text-red-400" />
                    Lab Reports
                  </span>
                  <span className="font-semibold text-white">
                    {course.labReports}
                  </span>
                </div>
              </div>

              {/* Open Course Button */}
              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={() =>
                    navigate(`/coursehub/${course.departmentId}/${course.code.toLowerCase()}`)
                  }
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="primary-btn w-full"
                >
                  Open Course & Rate →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default PopularCourses;