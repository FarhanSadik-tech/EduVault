import { useState } from "react";

import { UploadCloud } from "lucide-react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import courses from "../../data/courses";

import useAuth from "../../hooks/useAuth";

function Upload() {

  const { user } = useAuth();

  const [formData, setFormData] = useState({

    title: "",

    department: "",

    semester: "",

    course: "",

    type: "",

    description: "",

    driveLink: "",

  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "department") {

      setFormData((prev) => {

        return {

          ...prev,

          department: value,

          semester: "",

          course: "",

        };

      });

    } else if (name === "semester") {

      setFormData((prev) => {

        return {

          ...prev,

          semester: value,

          course: "",

        };

      });

    } else {

      setFormData((prev) => {

        return {

          ...prev,

          [name]: value,

        };

      });

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    const {

      title,

      department,

      semester,

      course,

      type,

      description,

      driveLink,

    } = formData;

    // Validation Checks
    if (!title.trim()) {

      return setError("Resource title is required.");

    }

    if (!department) {

      return setError("Please select a department.");

    }

    if (!semester) {

      return setError("Please select a semester.");

    }

    if (!course.trim()) {

      return setError("Course selection is required.");

    }

    if (!type) {

      return setError("Please select a resource type.");

    }

    if (!description.trim()) {

      return setError("Description is required.");

    }

    if (!driveLink.trim()) {

      return setError("Please enter Google Drive link.");

    }

    setIsUploading(true);

    try {

      // 🔥 Step 1 Requirement: Save resource with status = "pending"
      const newResource = {

        title: title.trim(),

        department: department.toLowerCase(),

        semester: semester.toLowerCase(),

        course: course.trim().toUpperCase(),

        courseCode: course.trim().toUpperCase(),

        type: type,

        resourceType: type,

        description: description.trim(),

        fileName: "Google Drive Resource",

        driveLink: driveLink.trim(),

        uploadedBy: user?.email || "Anonymous Student",

        uploadedByUid: user?.uid || "",

        status: "pending", // Moderation Workflow: Requires Admin Approval

        createdAt: serverTimestamp(),

      };

      await addDoc(collection(db, "resources"), newResource);

      setSuccess("Resource submitted successfully! It will be reviewed by an Admin before publishing.");

      setFormData({

        title: "",

        department: "",

        semester: "",

        course: "",

        type: "",

        description: "",

        driveLink: "",

      });

    } catch (err) {

      setError("Failed to upload resource. Please try again.");

      console.error("Upload Error:", err);

    } finally {

      setIsUploading(false);

    }

  };

  const availableCourses = courses[formData.department]?.[formData.semester] || [];

  return (

    <section className="mx-auto max-w-4xl px-6 py-16">

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">

        <div className="mb-10 text-center">

          <UploadCloud
            size={55}
            className="mx-auto text-blue-400"
          />

          <h1 className="mt-5 text-4xl font-bold text-white">

            Upload Academic Resource

          </h1>

          <p className="mt-3 text-slate-400">

            Share notes, questions, solutions and study materials. Student uploads require Admin review.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Title */}
          <div>

            <label className="mb-2 block text-slate-300">

              Resource Title

            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: CSE221 Mid Exam Solution"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

          </div>

          {/* Department */}
          <div>

            <label className="mb-2 block text-slate-300">

              Department

            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >

              <option value="">Select Department</option>

              <option value="cse">CSE</option>

              <option value="eee">EEE</option>

              <option value="bba">BBA</option>

              <option value="civil">Civil</option>

            </select>

          </div>

          {/* Semester */}
          <div>

            <label className="mb-2 block text-slate-300">

              Semester

            </label>

            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >

              <option value="">Select Semester</option>

              {Array.from({ length: 12 }, (_, index) => {

                return (

                  <option
                    key={index + 1}
                    value={`semester-${index + 1}`}
                  >

                    Semester {index + 1}

                  </option>

                );

              })}

            </select>

          </div>

          {/* Course */}
          <div>

            <label className="mb-2 block text-slate-300">

              Course

            </label>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              disabled={!formData.department || !formData.semester}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <option value="">Select Course</option>

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

          {/* Resource Type */}
          <div>

            <label className="mb-2 block text-slate-300">

              Resource Type

            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >

              <option value="">Select Resource Type</option>

              <option value="Notes">Notes</option>

              <option value="Question">Question</option>

              <option value="Solution">Solution</option>

              <option value="Assignment">Assignment</option>

              <option value="Lab Report">Lab Report</option>

            </select>

          </div>

          {/* Description */}
          <div>

            <label className="mb-2 block text-slate-300">

              Description

            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 resize-none"
            />

          </div>

          {/* Google Drive Link */}
          {/* Google Drive Link */}
<div>

  <label className="mb-2 block text-slate-300">

    Google Drive Link ( Please read the Note carefully before upload)

  </label>

  <input
    type="url"
    name="driveLink"
    value={formData.driveLink}
    onChange={handleChange}
    placeholder="Paste Google Drive Share Link"
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
  />

  {/* 🔥 Professional Instruction Helper Notice */}
  <p className="mt-2 text-xs leading-relaxed text-slate-400">

    <span className="font-semibold text-blue-400">Note:</span> Please upload the resource to your Google Drive, set the access to <strong className="text-slate-200">"Anyone with the link"</strong>, and paste the share link above. Once an admin verifies and approves your upload, you may safely delete the resource from your drive.

  </p>

</div>

          {/* Error Message */}
          {error && (

            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

              {error}

            </div>

          )}

          {/* Success Message */}
          {success && (

            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">

              {success}

            </div>

          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="primary-btn w-full py-3 disabled:opacity-50"
          >

            {isUploading ? "Submitting for Review..." : "Upload Resource"}

          </button>

        </form>

      </div>

    </section>

  );

}

export default Upload;