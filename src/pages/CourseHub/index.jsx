import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Download,
  Star,
  Video,
  Edit3,
  ExternalLink,
  Save,
  X,
} from "lucide-react";

function CourseHub() {
  const { user } = useAuth();
  const { departmentId, courseCode } = useParams();
  const navigate = useNavigate();

  // Admin Verification
  const adminEmails = ["xarhan62@gmail.com"];
  const isAdmin = user && adminEmails.includes(user.email);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Course Rating States
  const [courseRating, setCourseRating] = useState({ avg: "0.0", count: 0 });
  const [starHover, setStarHover] = useState(0);

  // YouTube Playlist States
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isEditingPlaylist, setIsEditingPlaylist] = useState(false);
  const [tempUrlInput, setTempUrlInput] = useState("");
  const [savingPlaylist, setSavingPlaylist] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const codeUpper = (courseCode || "").toUpperCase().replace(/\s+/g, "");

        // 1. Fetch YouTube Playlist Link Safely
        try {
          const playlistDocRef = doc(db, "coursePlaylists", codeUpper);
          const playlistDoc = await getDoc(playlistDocRef);
          if (playlistDoc.exists()) {
            const data = playlistDoc.data();
            setPlaylistUrl(data?.url || "");
            setTempUrlInput(data?.url || "");
          } else {
            setPlaylistUrl("");
            setTempUrlInput("");
          }
        } catch (err) {
          console.error("Error loading playlist:", err);
        }

        // 2. Fetch Resources
        const snapshot = await getDocs(collection(db, "resources"));
        const allDocs = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        const filteredData = allDocs.filter((item) => {
          const targetDept = (departmentId || "").trim().toLowerCase();
          const targetCourse = (courseCode || "").trim().toLowerCase().replace(/\s+/g, "");

          const itemDept = (item.department || "").trim().toLowerCase();
          const itemCourse = (item.courseCode || item.course || "").trim().toLowerCase().replace(/\s+/g, "");

          const deptMatch = itemDept === targetDept || !itemDept;
          const courseMatch = itemCourse === targetCourse;
          const isApproved = item.status === "approved";

          return deptMatch && courseMatch && isApproved;
        });

        setResources(filteredData);

        // 3. Fetch Course Ratings
        const ratingsSnapshot = await getDocs(collection(db, "courseRatings"));
        const currentCourseRatings = ratingsSnapshot.docs
          .map((d) => d.data())
          .filter((r) => {
            const ratingCode = (r.courseCode || "").trim().toLowerCase().replace(/\s+/g, "");
            const targetCode = (courseCode || "").trim().toLowerCase().replace(/\s+/g, "");
            return ratingCode === targetCode;
          });

        if (currentCourseRatings.length > 0) {
          const total = currentCourseRatings.reduce((acc, curr) => acc + Number(curr.ratingStars || 0), 0);
          setCourseRating({
            avg: (total / currentCourseRatings.length).toFixed(1),
            count: currentCourseRatings.length,
          });
        } else {
          setCourseRating({ avg: "0.0", count: 0 });
        }
      } catch (error) {
        console.error("Error fetching CourseHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [departmentId, courseCode]);

  // Handle YouTube Playlist Save (Admin Only)
  const handleSavePlaylist = async () => {
    if (!tempUrlInput.trim()) {
      alert("Please enter a valid YouTube Playlist URL");
      return;
    }

    setSavingPlaylist(true);
    try {
      const codeUpper = (courseCode || "").toUpperCase().replace(/\s+/g, "");
      await setDoc(doc(db, "coursePlaylists", codeUpper), {
        courseCode: codeUpper,
        url: tempUrlInput.trim(),
        updatedBy: user?.email || "Admin",
        updatedAt: serverTimestamp(),
      });

      setPlaylistUrl(tempUrlInput.trim());
      setIsEditingPlaylist(false);
      alert("YouTube Playlist Link updated successfully!");
    } catch (error) {
      console.error("Error saving playlist URL:", error);
      alert("Failed to save playlist link.");
    } finally {
      setSavingPlaylist(false);
    }
  };

  // Handle Rate Submission
  const handleRateThisCourse = async (stars) => {
    if (!user) {
      alert("Please login to rate this course.");
      return;
    }

    try {
      const codeUpper = (courseCode || "").toUpperCase();
      const ratingDocId = `${codeUpper}_${user.uid}`;

      await setDoc(doc(db, "courseRatings", ratingDocId), {
        courseCode: codeUpper,
        userEmail: user.email,
        userUid: user.uid,
        ratingStars: stars,
        updatedAt: serverTimestamp(),
      });

      alert(`Thank you! You rated ${codeUpper} ${stars} Stars ⭐`);

      setCourseRating((prev) => ({
        avg: stars.toFixed(1),
        count: prev.count + 1,
      }));
    } catch (error) {
      console.error("Error submitting course rating:", error);
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
      {/* Header */}
      <div className="text-center">
        <BookOpen size={60} className="mx-auto text-blue-400" />

        <h1 className="mt-6 text-5xl font-bold uppercase text-white">
          {courseCode}
        </h1>

        <p className="mt-3 text-slate-400">
          Department: {departmentId?.toUpperCase()}
        </p>

        {/* Course Star Rating Bar */}
        <div className="mt-6 inline-flex flex-col items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Course Rating:</span>
            <span className="flex items-center gap-1 text-lg font-bold text-yellow-400">
              ⭐ {courseRating.avg} ({courseRating.count} reviews)
            </span>
          </div>

          <div className="flex w-full items-center justify-center gap-1 border-t border-slate-800 pt-2">
            <span className="mr-2 text-xs text-slate-400">Rate this course:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setStarHover(s)}
                onMouseLeave={() => setStarHover(0)}
                onClick={() => handleRateThisCourse(s)}
                className="p-1 transition-transform hover:scale-125"
              >
                <Star
                  size={20}
                  className={
                    s <= starHover
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-700"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* YOUTUBE PLAYLIST SECTION */}
        <div className="mt-6 flex flex-col items-center justify-center">
          {!isEditingPlaylist ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {playlistUrl ? (
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-600/20 px-5 py-2.5 text-sm font-semibold text-red-400 shadow-lg transition hover:bg-red-600 hover:text-white"
                >
                  <Video size={20} className="text-red-500 hover:text-white" />
                  <span>Watch Course Playlist</span>
                  <ExternalLink size={16} />
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2 text-xs text-slate-400">
                  <Video size={18} className="text-slate-500" />
                  <span>No YouTube Playlist Added Yet</span>
                </div>
              )}

              {/* Admin Edit Button */}
              {isAdmin && (
                <button
                  onClick={() => setIsEditingPlaylist(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                  title="Admin: Edit YouTube Playlist Link"
                >
                  <Edit3 size={15} />
                  <span>{playlistUrl ? "Edit Link" : "Add Playlist Link"}</span>
                </button>
              )}
            </div>
          ) : (
            /* Admin Input Field for Playlist URL */
            <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
              <input
                type="url"
                value={tempUrlInput}
                onChange={(e) => setTempUrlInput(e.target.value)}
                placeholder="Paste YouTube Playlist URL..."
                className="w-full bg-transparent px-3 py-1.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                onClick={handleSavePlaylist}
                disabled={savingPlaylist}
                className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <Save size={14} />
                {savingPlaylist ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditingPlaylist(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Resources List */}
      {loading ? (
        <div className="mt-16 text-center">
          <h2 className="text-2xl text-white">Loading resources...</h2>
        </div>
      ) : resources.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
          <h2 className="text-3xl font-bold text-white">No Resources Found</h2>
          <p className="mt-4 text-slate-400">
            No approved resources available for this course yet.
          </p>
        </div>
      ) : (
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              className="card-style p-8"
            >
              <FileText size={45} className="text-blue-400" />
              <h2 className="mt-6 text-2xl font-bold text-white">
                {resource.title}
              </h2>
              <p className="mt-3 font-semibold text-slate-400">
                Type: {resource.resourceType || resource.type || "Document"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {resource.fileName || resource.courseCode || resource.course}
              </p>

              <button
                onClick={() => handleDownload(resource)}
                className="primary-btn mt-8 flex w-full items-center justify-center gap-2"
              >
                <Download size={18} />
                Download / View Link
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CourseHub;