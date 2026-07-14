import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";

function Upload() {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    course: "",
    type: "",
    description: "",
    file: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      title,
      department,
      course,
      type,
      description,
      file,
    } = formData;

    if (!title.trim()) {
      return setError("Resource title is required.");
    }

    if (!department) {
      return setError("Please select a department.");
    }

    if (!course.trim()) {
      return setError("Course name is required.");
    }

    if (!type) {
      return setError("Please select a resource type.");
    }

    if (!description.trim()) {
      return setError("Description is required.");
    }

    if (!file) {
      return setError("Please choose a file.");
    }

    try {

  await addDoc(collection(db, "resources"), {
    title,
    department,
    course,
    type,
    description,

    fileName: file.name,

    createdAt: serverTimestamp(),
  });

  setSuccess("Resource uploaded successfully.");

  setFormData({
    title: "",
    department: "",
    course: "",
    type: "",
    description: "",
    file: null,
  });

} catch (error) {

  setError("Failed to upload resource.");

  console.error(error);

}
};
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
            Share notes, questions, solutions and study materials with everyone.
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

              <option value="CSE">CSE</option>

              <option value="EEE">EEE</option>

              <option value="BBA">BBA</option>

              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Course */}

          <div>
            <label className="mb-2 block text-slate-300">
              Course
            </label>

            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Example: CSE221"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
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
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          {/* File */}

          <div>
            <label className="mb-2 block text-slate-300">
              Upload File
            </label>

            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleChange}
              className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-slate-300"
            />

            {formData.file && (
              <div className="mt-3 flex items-center gap-2 text-blue-400">
                <FileText size={18} />
                <span>{formData.file.name}</span>
              </div>
            )}
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            className="primary-btn w-full py-3"
          >
            Upload Resource
          </button>
        </form>
      </div>
    </section>
  );
}

export default Upload;