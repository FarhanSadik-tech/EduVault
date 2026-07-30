import { useMemo, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

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

import useAuth from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";

function Course() {

  const { user } = useAuth();

  const navigate = useNavigate();

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

    if (!searchData.department || !searchData.semester) {

      return [];

    }

    return courses[searchData.department]?.[searchData.semester] || [];

  }, [searchData.department, searchData.semester]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "department") {

      setSearchData((prev) => {

        return {

          ...prev,

          department: value,

          semester: "",

          course: "",

        };

      });

    } else if (name === "semester") {

      setSearchData((prev) => {

        return {

          ...prev,

          semester: value,

          course: "",

        };

      });

    } else {

      setSearchData((prev) => {

        return {

          ...prev,

          [name]: value,

        };

      });

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

    setResults([]);

    setSearched(false);

  };

  const handleSearch = async () => {

    try {

      setLoading(true);

      setSearched(true);

      // Fetch all resources and apply strict exact matching for courses
      const snapshot = await getDocs(collection(db, "resources"));

      const allResources = snapshot.docs.map((docItem) => {

        return {

          id: docItem.id,

          ...docItem.data(),

        };

      });

      const filteredData = allResources.filter((item) => {

        // Department Matching
        const itemDept = (item.department || "").trim().toLowerCase();

        const targetDept = (searchData.department || "").trim().toLowerCase();

        const deptMatch = !targetDept || itemDept === targetDept;

        // Semester Matching
        const itemSem = (item.semester || "").trim().toLowerCase().replace("-", " ");

        const targetSem = (searchData.semester || "").trim().toLowerCase().replace("-", " ");

        const semMatch = !targetSem || itemSem === targetSem || itemSem.includes(targetSem);

        // Exact Course Code Matching (Strict Equality === solves CSE111 vs CSE111L issue)
        const itemCourse = (item.courseCode || item.course || "").trim().toLowerCase().replace(/\s+/g, "");

        const targetCourse = (searchData.course || "").trim().toLowerCase().replace(/\s+/g, "");

        const courseMatch = !targetCourse || itemCourse === targetCourse;

        // Type Matching
        const itemType = (item.resourceType || item.type || "").trim().toLowerCase();

        const targetType = (searchData.type || "").trim().toLowerCase();

        const typeMatch = !targetType || itemType === targetType || itemType.includes(targetType);

        // Keyword Search (Search by Title or Exact Code)
        const cleanKeyword = searchData.keyword.trim().toLowerCase().replace(/\s+/g, "");

        const itemTitle = (item.title || "").toLowerCase();

        const itemFileName = (item.fileName || "").toLowerCase();

        const keywordMatch =
          !cleanKeyword ||
          itemTitle.includes(cleanKeyword) ||
          itemFileName.includes(cleanKeyword) ||
          itemCourse === cleanKeyword ||
          itemCourse.includes(cleanKeyword);

        return deptMatch && semMatch && courseMatch && typeMatch && keywordMatch;

      });

      setResults(filteredData);

    } catch (error) {

      console.error("Error searching resources:", error);

    } finally {

      setLoading(false);

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

      {/* Title */}
      <div className="text-center">

        <h1 className="text-5xl font-bold text-white">

          Search Resources

        </h1>

        <p className="mt-4 text-slate-400">

          Search any question, note, solution or lab report.

        </p>

      </div>

      {/* Search Form Card */}
      <div className="card-style mt-14 rounded-3xl p-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Keyword Input */}
          <div>

            <label className="mb-2 block text-slate-300">

              Keyword

            </label>

            <input
              type="text"
              name="keyword"
              value={searchData.keyword}
              onChange={handleChange}
              placeholder="Search by title or course code..."
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

              {departments.map((department) => {

                return (

                  <option
                    key={department.id}
                    value={department.id}
                  >

                    {department.shortName}

                  </option>

                );

              })}

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

              {Array.from({ length: 12 }, (_, index) => {

                return (

                  <option
                    key={index}
                    value={`semester-${index + 1}`}
                  >

                    Semester {index + 1}

                  </option>

                );

              })}

            </select>

          </div>

          {/* Course Dropdown */}
          <div>

            <label className="mb-2 block text-slate-300">

              Course

            </label>

            <select
              name="course"
              value={searchData.course}
              onChange={handleChange}
              disabled={!searchData.department || !searchData.semester}
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

              {availableCourses.map((course) => {

                return (

                  <option
                    key={course.code}
                    value={course.code}
                  >

                    {course.code} - {course.title}

                  </option>

                );

              })}

            </select>

          </div>

          {/* Type Dropdown */}
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

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={handleSearch}
            className="primary-btn flex items-center gap-2"
          >

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

      {/* Results Display Section */}
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

            Try changing your search filters or clear keyword search.

          </p>

        </div>

      )}

      {!loading && results.length > 0 && (

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {results.map((resource) => {

            return (

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
                className="card-style p-6 flex flex-col justify-between"
              >

                <div>

                  <FileText
                    size={42}
                    className="text-blue-400"
                  />

                  <h2 className="mt-5 text-2xl font-bold text-white">

                    {resource.title}

                  </h2>

                  <div className="mt-4 space-y-2 text-slate-400 text-sm">

                    <p>

                      <strong className="text-slate-200">Course:</strong>{" "}

                      {resource.courseCode || resource.course || "GENERAL"}

                    </p>

                    <p>

                      <strong className="text-slate-200">Type:</strong>{" "}

                      {resource.resourceType || resource.type || "Document"}

                    </p>

                    <p className="flex items-center gap-2">

                      <Building2 size={16} />

                      {resource.department?.toUpperCase()}

                    </p>

                    <p className="flex items-center gap-2">

                      <Calendar size={16} />

                      {resource.semester}

                    </p>

                    <p>

                      <strong className="text-slate-200">File:</strong>{" "}

                      {resource.fileName || "View Link"}

                    </p>

                  </div>

                </div>

                <button
                  onClick={() => {

                    return handleDownload(resource);

                  }}
                  className="primary-btn mt-6 flex w-full items-center justify-center gap-2 text-sm"
                >

                  <Download size={18} />

                  Download Resource

                </button>

              </motion.div>

            );

          })}

        </div>

      )}

    </section>

  );

}

export default Course;