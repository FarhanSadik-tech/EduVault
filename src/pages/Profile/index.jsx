import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import useAuth from "../../hooks/useAuth";

import { updateProfile } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import {
  User,
  Mail,
  Upload,
  FileText,
  ExternalLink,
  BookOpen,
  Folder,
  Edit3,
  Check,
  X,
  Camera,
  Image as ImageIcon,
  Award,
  ShieldCheck,
  Trash2,
} from "lucide-react";

function Profile() {

  const { user, loading } = useAuth();

  const [uploads, setUploads] = useState([]);

  const [fetchingUploads, setFetchingUploads] = useState(true);

  // Step 4: Edit Name States
  const [isEditing, setIsEditing] = useState(false);

  const [displayName, setDisplayName] = useState("");

  const [updatingName, setUpdatingName] = useState(false);

  // Step 5: Change Photo States
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [updatingPhoto, setUpdatingPhoto] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // ImgBB API Key
  const IMGBB_API_KEY = "3e7b125f1327f405d37115247d882fdd";

  useEffect(() => {

    if (user?.displayName) {

      setDisplayName(user.displayName);

    }

  }, [user]);

  useEffect(() => {

    const fetchUploads = async () => {

      if (!user?.email) {

        setFetchingUploads(false);

        return;

      }

      try {

        const q = query(

          collection(db, "resources"),

          where("uploadedBy", "==", user.email)

        );

        const snapshot = await getDocs(q);

        const userResources = snapshot.docs.map((itemDoc) => {

          return {

            id: itemDoc.id,

            ...itemDoc.data(),

          };

        });

        setUploads(userResources);

      } catch (error) {

        console.error("Error fetching user uploads:", error);

      } finally {

        setFetchingUploads(false);

      }

    };

    fetchUploads();

  }, [user]);

  // Step 4: Handle Display Name Update
  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    if (!displayName.trim() || !user) return;

    setUpdatingName(true);

    try {

      await updateProfile(user, {

        displayName: displayName.trim(),

      });

      setSuccessMessage("Profile name updated successfully!");

      setUpdateSuccess(true);

      setIsEditing(false);

      setTimeout(() => {

        setUpdateSuccess(false);

      }, 3000);

    } catch (error) {

      console.error("Error updating profile:", error);

    } finally {

      setUpdatingName(false);

    }

  };

  // Step 5: Handle File Selection
  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setSelectedFile(file);

      setPreviewUrl(URL.createObjectURL(file));

    }

  };

  // Step 5: Upload Image to ImgBB
  const handleUploadPhoto = async (e) => {

    e.preventDefault();

    if (!selectedFile || !user) return;

    setUpdatingPhoto(true);

    try {

      const formData = new FormData();

      formData.append("image", selectedFile);

      const response = await fetch(

        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,

        {

          method: "POST",

          body: formData,

        }

      );

      const data = await response.json();

      if (data.success) {

        const imageUrl = data.data.url;

        await updateProfile(user, {

          photoURL: imageUrl,

        });

        setSuccessMessage("Profile photo updated successfully!");

        setUpdateSuccess(true);

        setIsEditingPhoto(false);

        setSelectedFile(null);

        setPreviewUrl("");

        setTimeout(() => {

          setUpdateSuccess(false);

        }, 3000);

      } else {

        alert("Failed to upload image. Please try again.");

      }

    } catch (error) {

      console.error("Error uploading photo:", error);

    } finally {

      setUpdatingPhoto(false);

    }

  };

  // Step 7 Polish: Delete Resource Logic
  const handleDeleteResource = async (resourceId) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this resource?"

    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "resources", resourceId));

      setUploads((prev) => {

        return prev.filter((item) => {

          return item.id !== resourceId;

        });

      });

    } catch (error) {

      console.error("Error deleting resource:", error);

    }

  };

  // Step 6: Contributor Badge Logic
  const getContributorBadge = (count) => {

    if (count >= 10) return "Master Contributor";

    if (count >= 5) return "Top Contributor";

    if (count >= 1) return "Active Contributor";

    return "New Student";

  };

  if (loading) {

    return (

      <div className="py-20 text-center text-white">

        Loading Profile...

      </div>

    );

  }

  return (

    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="mx-auto max-w-5xl px-6 py-16"
    >

      {/* User Info Card */}
      <div className="card-style relative p-10">

        {/* Success Banner */}
        {updateSuccess && (

          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400"
          >

            <Check size={18} />

            <span>{successMessage}</span>

          </motion.div>

        )}

        <div className="flex flex-col items-center">

          {/* Avatar Container */}
          <div className="relative">

            <img
              src={
                previewUrl ||
                user?.photoURL ||
                "https://i.pravatar.cc/200"
              }
              alt="Profile"
              className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover shadow-xl"
            />

            <button
              onClick={() => {

                return setIsEditingPhoto(!isEditingPhoto);

              }}
              className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-500"
              title="Upload Photo from PC"
            >

              <Camera size={16} />

            </button>

          </div>

          {/* Change Photo Modal/Form */}
          {isEditingPhoto && (

            <motion.form
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              onSubmit={handleUploadPhoto}
              className="mt-4 flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl"
            >

              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-950 p-4 transition hover:border-blue-500">

                <ImageIcon className="mb-2 text-slate-400" size={24} />

                <span className="text-xs text-slate-300">

                  {selectedFile ? selectedFile.name : "Click to select photo from PC"}

                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />

              </label>

              <div className="flex w-full gap-2">

                <button
                  type="submit"
                  disabled={updatingPhoto || !selectedFile}
                  className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >

                  {updatingPhoto ? "Uploading..." : "Upload Photo"}

                </button>

                <button
                  type="button"
                  onClick={() => {

                    setIsEditingPhoto(false);

                    setSelectedFile(null);

                    setPreviewUrl("");

                  }}
                  className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors hover:text-white"
                >

                  <X size={18} />

                </button>

              </div>

            </motion.form>

          )}

          {/* User Name */}
          {!isEditing ? (

            <div className="mt-6 flex items-center gap-3">

              <h1 className="text-4xl font-bold text-white">

                {user?.displayName || "Anonymous User"}

              </h1>

              <button
                onClick={() => {

                  return setIsEditing(true);

                }}
                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                title="Edit Name"
              >

                <Edit3 size={20} />

              </button>

            </div>

          ) : (

            <form
              onSubmit={handleUpdateProfile}
              className="mt-6 flex items-center gap-2"
            >

              <input
                type="text"
                value={displayName}
                onChange={(e) => {

                  return setDisplayName(e.target.value);

                }}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter full name"
                required
              />

              <button
                type="submit"
                disabled={updatingName}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
              >

                {updatingName ? "Saving..." : "Save"}

              </button>

              <button
                type="button"
                onClick={() => {

                  return setIsEditing(false);

                }}
                className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-colors hover:text-white"
              >

                <X size={20} />

              </button>

            </form>

          )}

          <p className="mt-2 flex items-center gap-2 text-slate-400">

            <Mail size={18} />

            {user?.email}

          </p>

        </div>

        {/* Polished Statistics Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="card-style p-6 transition-all"
          >

            <div className="flex items-center justify-between">

              <Upload
                size={36}
                className="text-green-400"
              />

              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">

                Live

              </span>

            </div>

            <h2 className="mt-4 text-sm font-medium text-slate-400">

              Total Resources Uploaded

            </h2>

            <p className="mt-2 text-4xl font-bold text-white">

              {uploads.length}

            </p>

          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="card-style p-6 transition-all"
          >

            <div className="flex items-center justify-between">

              <Award
                size={36}
                className="text-amber-400"
              />

              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">

                Rank

              </span>

            </div>

            <h2 className="mt-4 text-sm font-medium text-slate-400">

              Contribution Status

            </h2>

            <p className="mt-2 text-xl font-bold text-amber-400">

              {getContributorBadge(uploads.length)}

            </p>

          </motion.div>

          <motion.div
            whileHover={{
              y: -5,
            }}
            className="card-style p-6 transition-all"
          >

            <div className="flex items-center justify-between">

              <ShieldCheck
                size={36}
                className="text-blue-400"
              />

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">

                Active

              </span>

            </div>

            <h2 className="mt-4 text-sm font-medium text-slate-400">

              Account Type

            </h2>

            <p className="mt-2 text-xl font-bold text-white">

              Verified Student

            </p>

          </motion.div>

        </div>

      </div>

      {/* My Uploaded Resources Section */}
      <div className="mt-12">

        <h2 className="mb-6 text-3xl font-bold text-white">

          My Uploaded Resources

        </h2>

        {fetchingUploads ? (

          <div className="card-style p-8 text-center text-slate-400 animate-pulse">

            Loading your uploads...

          </div>

        ) : uploads.length === 0 ? (

          <div className="card-style flex flex-col items-center justify-center p-12 text-center">

            <FileText
              size={48}
              className="mb-4 text-slate-500"
            />

            <h3 className="text-xl font-semibold text-white">

              No Uploads Found

            </h3>

            <p className="mt-2 text-slate-400">

              You haven't uploaded any resources yet.

            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2">

            {uploads.map((item) => {

              return (

                <motion.div
                  key={item.id}
                  whileHover={{
                    scale: 1.01,
                  }}
                  className="card-style flex flex-col justify-between p-6 transition-all border border-slate-800 hover:border-slate-700"
                >

                  <div>

                    <div className="flex items-start justify-between gap-4">

                      <h3 className="text-xl font-semibold text-white">

                        {item.title}

                      </h3>

                      <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">

                        {item.type || "Document"}

                      </span>

                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">

                      {item.description || "No description provided."}

                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">

                      <span className="flex items-center gap-1">

                        <Folder size={14} />

                        {item.department}

                      </span>

                      <span className="flex items-center gap-1">

                        <BookOpen size={14} />

                        {item.course}

                      </span>

                    </div>

                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

                    <span className="text-xs text-slate-500 truncate max-w-[150px]">

                      {item.fileName || "Drive Resource"}

                    </span>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => {

                          return handleDeleteResource(item.id);

                        }}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Resource"
                      >

                        <Trash2 size={16} />

                      </button>

                      {item.driveLink && (

                        <a
                          href={item.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
                        >

                          View Drive

                          <ExternalLink size={14} />

                        </a>

                      )}

                    </div>

                  </div>

                </motion.div>

              );

            })}

          </div>

        )}

      </div>

    </motion.section>

  );

}

export default Profile;