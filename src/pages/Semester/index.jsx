import { motion } from "framer-motion";
import { NavLink, useParams, Navigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

import departments from "../../data/departments";

function Semester() {
  const { departmentId } = useParams();

  const department = departments.find(
    (dept) => dept.id === departmentId
  );

  if (!department) {
    return <Navigate to="/department" replace />;
  }

  const semesters = Array.from(
    { length: department.semesters },
    (_, index) => ({
      id: index + 1,
      name: `Semester ${index + 1}`,
      semesterId: `semester-${index + 1}`,
    })
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white">
          {department.shortName} Semesters
        </h1>

        <p className="mt-4 text-slate-400">
          Select your semester to explore available courses.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {semesters.map((semester, index) => (
          <motion.div
            key={semester.id}
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

            <h2 className="mt-6 text-2xl font-bold text-white">
              {semester.name}
            </h2>

            <p className="mt-2 text-slate-400">
              Academic Semester
            </p>

            <NavLink
              to={`/course/${department.id}/${semester.semesterId}`}
              className="primary-btn mt-8 flex items-center justify-center gap-2"
            >
              View Courses

              <ArrowRight size={18} />
            </NavLink>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Semester;