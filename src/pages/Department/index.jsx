import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";

import departments from "../../data/departments";

function Department() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Heading */}

      <div className="text-center">

        <h1 className="text-5xl font-bold text-white">
          Departments
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Select your department to explore semesters, courses,
          notes, questions and academic resources.
        </p>

      </div>

      {/* Department Cards */}

      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {departments.map((department, index) => (

          <motion.div
            key={department.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            viewport={{ once: true }}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
          >

            <GraduationCap
              size={48}
              className="text-blue-400"
            />

            <h2 className="mt-6 text-2xl font-bold text-white">
              {department.shortName}
            </h2>

            <p className="mt-3 text-slate-400">
              {department.name}
            </p>

            <div className="mt-6 rounded-xl bg-slate-800 px-4 py-3 text-center">

              <span className="text-slate-300">
                {department.semesters} Semesters
              </span>

            </div>

            <NavLink
              to={`/semester/${department.id}`}
              className="primary-btn mt-8 flex items-center justify-center gap-2"
            >
              Explore

              <ArrowRight size={18} />

            </NavLink>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Department;