import { useMemo, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";
import {
  Search,
  RotateCcw,
  FileText,
  Download,
  Calendar,
  Building2,
} from "lucide-react";

import departments from "../../data/departments";
import courses from "../../data/courses";
import { motion } from "framer-motion";

function Course() {

  console.log("Course Rendered");

  const [searchData, setSearchData] = useState({
    keyword: "",
    department: "",
    semester: "",
    course: "",
    type: "",
  });
  const [results, setResults] = useState([]);

const [loading, setLoading] = useState(false);

const [searched, setSearched] = useState(false);
  const availableCourses = useMemo(() => {

  if (
    !searchData.department ||
    !searchData.semester
  ) {
    return [];
  }

  return (
    courses[searchData.department]?.[
      searchData.semester
    ] || []
  );

}, [
  searchData.department,
  searchData.semester,
]);


  const handleChange = (e) => {

  const { name, value } = e.target;

  if (name === "department") {

    setSearchData((prev) => ({
      ...prev,
      department: value,
      semester: "",
      course: "",
    }));

  }

  else if (name === "semester") {

    setSearchData((prev) => ({
      ...prev,
      semester: value,
      course: "",
    }));

  }

  else {

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));

  }

};
const handleReset = () => {

  setSearchData({
    keyword: "",
    department: "",
    semester: "",
    course: "",
    type: "",
  });

};
const handleSearch = async () => {
  alert("Search clicked");

  console.log("Search button clicked");

  try {

    setLoading(true);

    setSearched(true);

    const constraints = [];

    if (searchData.department) {

      constraints.push(
        where(
          "department",
          "==",
          searchData.department
        )
      );

    }

    if (searchData.semester) {

      constraints.push(
        where(
          "semester",
          "==",
          searchData.semester
        )
      );

    }

    if (searchData.course) {

      constraints.push(
        where(
          "course",
          "==",
          searchData.course
        )
      );

    }

    if (searchData.type) {

      constraints.push(
        where(
          "type",
          "==",
          searchData.type
        )
      );

    }

    const q = query(

      collection(db, "resources"),

      ...constraints

    );

    const snapshot = await getDocs(q);
    console.log("Docs Found:", snapshot.size);

snapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});
    

    let data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (searchData.keyword.trim()) {

      data = data.filter((resource) =>
        resource.title
          .toLowerCase()
          .includes(
            searchData.keyword.toLowerCase()
          )
      );

    }
    console.log("Filtered Data:", data);

    setResults(data);
    console.log("Results Length:", data.length);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

  return (

    <section className="mx-auto max-w-7xl px-6 py-16">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-white">
          Search Resources
        </h1>

        <p className="mt-4 text-slate-400">
          Search any question, note, solution or lab report.
        </p>

      </div>

      <div className="card-style mt-14 rounded-3xl p-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Search */}

          <div>

            <label className="mb-2 block text-slate-300">
              Keyword
            </label>

            <input
              type="text"
              name="keyword"
              value={searchData.keyword}
              onChange={handleChange}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          {/* Department */}

          <div>

            <label className="mb-2 block text-slate-300">
              Department
            </label>

            <select
              name="department"
              value={searchData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >

             <option value="">
  All Departments
</option>

{departments.map((department) => (

  <option
    key={department.id}
    value={department.id}
  >
    {department.shortName}
  </option>

))} 

            </select>

          </div>

          {/* Semester */}

          <div>

            <label className="mb-2 block text-slate-300">
              Semester
            </label>

            <select
              name="semester"
              value={searchData.semester}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >

              <option value="">
                All Semesters
              </option>

              {Array.from({ length: 12 }, (_, index) => (

                <option
                  key={index}
                  value={`semester-${index + 1}`}
                >
                  Semester {index + 1}
                </option>

              ))}

            </select>

          </div>

          {/* Course */}

<div>

  <label className="mb-2 block text-slate-300">
    Course
  </label>

  <select
    name="course"
    value={searchData.course}
    onChange={handleChange}
    disabled={
      !searchData.department ||
      !searchData.semester
    }
    className="
    w-full
    rounded-xl
    border
    border-slate-700
    bg-slate-950
    px-4
    py-3
    text-white
    outline-none
    focus:border-blue-500
    disabled:cursor-not-allowed
    disabled:opacity-50
    "
  >

    <option value="">
      All Courses
    </option>

    {availableCourses.map((course) => (

      <option
        key={course.code}
        value={course.code}
      >
        {course.code} - {course.title}
      </option>

    ))}

  </select>

</div>

          {/* Type */}

          <div>

            <label className="mb-2 block text-slate-300">
              Resource Type
            </label>

            <select
              name="type"
              value={searchData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >

              <option value="">
                All Types
              </option>

              <option value="Question">
                Question
              </option>

              <option value="Note">
                Note
              </option>

              <option value="Solution">
                Solution
              </option>

              <option value="Lab Report">
                Lab Report
              </option>

            </select>

          </div>

        </div>

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={handleSearch}
            className="primary-btn flex items-center gap-2">
            <Search size={18} />
            Search
          </button>

          <button
            onClick={handleReset}
            className="secondary-btn flex items-center gap-2"
          >

            <RotateCcw size={18} />

            Reset

          </button>

        </div>

      </div>

      {loading && (
       <div className="mt-12 text-center">
    <h2 className="text-2xl text-white">
      Searching...
    </h2>
  </div>
)}
{searched && !loading && results.length === 0 && (
  <div className="mt-12 text-center">
    <h2 className="text-2xl font-bold text-white">
      No Resources Found
    </h2>

    <p className="mt-3 text-slate-400">
      Try changing your search filters.
    </p>
  </div>
)}
{!loading && results.length > 0 && (

  <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

    {results.map((resource) => (
     <motion.div
  key={resource.id}
  initial={{
    opacity: 0,
    y: 30,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.4,
  }}
  whileHover={{
    y: -6,
    scale: 1.02,
  }}
  viewport={{
    once: true,
  }}
  className="card-style p-6"
>

  <FileText
    size={42}
    className="text-blue-400"
  />

  <h2 className="mt-5 text-2xl font-bold text-white">
    {resource.title}
  </h2>

  <div className="mt-4 space-y-2 text-slate-400">

    <p>
      <strong>Course:</strong> {resource.course}
    </p>

    <p>
      <strong>Type:</strong> {resource.type}
    </p>

    <p className="flex items-center gap-2">
      <Building2 size={16} />
      {resource.department}
    </p>

    <p className="flex items-center gap-2">
      <Calendar size={16} />
      {resource.semester}
    </p>

    <p>
      <strong>File:</strong> {resource.fileName}
    </p>

  </div>

  <button
  onClick={() => {

    if (!resource.driveLink) {

      alert("Download link not available.");

      return;

    }

    window.open(resource.driveLink, "_blank");

  }}
  className="primary-btn mt-6 flex w-full items-center justify-center gap-2"
>
  <Download size={18} />
  Download Resource
</button>

</motion.div>

    ))}

  </div>

)}

    </section>

  );

}

export default Course;