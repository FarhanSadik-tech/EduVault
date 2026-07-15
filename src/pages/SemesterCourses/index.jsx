import { motion } from "framer-motion";
import { NavLink, Navigate, useParams } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

import departments from "../../data/departments";
import courses from "../../data/courses";

function SemesterCourses() {
  const { departmentId, semesterId } = useParams();

  const department = departments.find(
    (dept) => dept.id === departmentId
  );

  if (!department) {
    return <Navigate to="/department" replace />;
  }

  const semesterCourses =
    courses[departmentId]?.[semesterId] || [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-white">
          {department.shortName} Courses
        </h1>

        <p className="mt-4 text-slate-400">
          {semesterId.replace("-", " ").toUpperCase()}
        </p>

      </div>

      {semesterCourses.length === 0 ? (

        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

          <h2 className="text-2xl font-semibold text-white">
            No courses available yet.
          </h2>

          <p className="mt-3 text-slate-400">
            This semester will be added soon.
          </p>

        </div>

      ) : (

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {semesterCourses.map((course, index) => (

            <motion.div
              key={course.code}
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
                y: -10,
                scale: 1.02,
              }}
              viewport={{
                once: true,
              }}
              className="card-style p-8"
            >

              <BookOpen
                size={45}
                className="text-blue-400"
              />

              <h2 className="mt-6 text-3xl font-bold text-white">
                {course.code}
              </h2>

              <p className="mt-3 text-slate-300">
                {course.title}
              </p>

              <div className="mt-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                {course.credit} Credit
              </div>

              <NavLink
                to={`/coursehub/${departmentId}/${course.code}`}
                className="primary-btn mt-8 flex items-center justify-center gap-2"
              >
                View Resources

                <ArrowRight size={18} />
              </NavLink>

            </motion.div>

          ))}

        </div>

      )}

    </section>
  );
}

export default SemesterCourses;