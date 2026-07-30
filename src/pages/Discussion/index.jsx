import { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import { motion, AnimatePresence } from "framer-motion";

import {
  MessageSquare,
  Search,
  Send,
  User,
  Heart,
  MessageCircle,
  Trash2,
  Edit3,
  X,
  Check,
  CornerDownRight,
} from "lucide-react";

const allSemestersList = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "9th Semester",
  "10th Semester",
  "11th Semester",
  "12th Semester",
];

function Discussion() {

  const { user } = useAuth();

  // Selector States
  const [selectedDept, setSelectedDept] = useState("cse");

  const [selectedSemester, setSelectedSemester] = useState("1st Semester");

  // Real-time Data States
  const [uploadedCourses, setUploadedCourses] = useState([]);

  const [discussions, setDiscussions] = useState([]);

  // Discussion Post States
  const [selectedCourseForDiscussion, setSelectedCourseForDiscussion] = useState("GENERAL");

  const [newTopic, setNewTopic] = useState("");

  const [newContent, setNewContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Discussion Post State
  const [editingPostId, setEditingPostId] = useState(null);

  const [editTopic, setEditTopic] = useState("");

  const [editContent, setEditContent] = useState("");

  // Comment & Reply Input States
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const [commentText, setCommentText] = useState({});

  const [replyText, setReplyText] = useState({});

  const [activeReplyId, setActiveReplyId] = useState(null);

  // 1. Fetch Uploaded Course Codes for Dropdown
  useEffect(() => {

    const resourcesRef = collection(db, "resources");

    const unsubscribe = onSnapshot(
      resourcesRef,
      (snapshot) => {

        const courseSet = new Set();

        snapshot.docs.forEach((docItem) => {

          const data = docItem.data();

          const itemDept = (data.department || "").trim().toLowerCase();

          const itemSem = (data.semester || "").trim().toLowerCase();

          const targetDept = selectedDept.trim().toLowerCase();

          const targetSem = selectedSemester.trim().toLowerCase();

          const isDeptMatch = itemDept === targetDept || itemDept.includes(targetDept);

          const isSemMatch = itemSem === targetSem || itemSem.includes(targetSem);

          if (isDeptMatch && isSemMatch) {

            const rawCode = data.courseCode || data.course;

            if (rawCode) {

              courseSet.add(rawCode.trim().toUpperCase());

            }

          }

        });

        setUploadedCourses(Array.from(courseSet));

      },
      (error) => {

        console.error("Error fetching course list for discussion:", error);

      }

    );

    return () => {

      return unsubscribe();

    };

  }, [selectedDept, selectedSemester]);

  // 2. Real-time Subscription to Discussions for Selected Dept & Semester
  useEffect(() => {

    const discQuery = query(collection(db, "discussions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      discQuery,
      (snapshot) => {

        const discData = snapshot.docs
          .map((d) => {

            return { id: d.id, ...d.data() };

          })
          .filter((disc) => {

            const isDeptMatch = (disc.department || "").toLowerCase() === selectedDept.toLowerCase();

            const isSemMatch = (disc.semester || "").toLowerCase() === selectedSemester.toLowerCase();

            return isDeptMatch && isSemMatch;

          });

        setDiscussions(discData);

      },
      (error) => {

        console.error("Error listening to live discussions:", error);

      }

    );

    return () => {

      return unsubscribe();

    };

  }, [selectedDept, selectedSemester]);

  // Handle Post New Discussion
  const handlePostDiscussion = async (e) => {

    e.preventDefault();

    if (!user) {

      alert("Please login to post in the discussion forum.");

      return;

    }

    if (!newTopic.trim() || !newContent.trim()) {

      alert("Please fill in both title and details.");

      return;

    }

    setIsSubmitting(true);

    try {

      const postData = {

        courseCode: selectedCourseForDiscussion || "GENERAL",

        department: selectedDept.toUpperCase(),

        semester: selectedSemester,

        topic: newTopic,

        content: newContent,

        authorName: user.displayName || user.email.split("@")[0],

        authorEmail: user.email,

        authorUid: user.uid,

        likes: [],

        comments: [],

        createdAt: serverTimestamp(),

      };

      await addDoc(collection(db, "discussions"), postData);

      setNewTopic("");

      setNewContent("");

      alert("Discussion posted successfully!");

    } catch (error) {

      console.error("Error adding discussion:", error);

    } finally {

      setIsSubmitting(false);

    }

  };

  // Handle Edit Post
  const handleStartEdit = (disc) => {

    setEditingPostId(disc.id);

    setEditTopic(disc.topic);

    setEditContent(disc.content);

  };

  const handleSaveEdit = async (discId) => {

    if (!editTopic.trim() || !editContent.trim()) {

      alert("Title and content cannot be empty.");

      return;

    }

    try {

      const postRef = doc(db, "discussions", discId);

      await updateDoc(postRef, {

        topic: editTopic,

        content: editContent,

        updatedAt: serverTimestamp(),

      });

      setEditingPostId(null);

      alert("Discussion updated successfully!");

    } catch (error) {

      console.error("Error updating discussion:", error);

    }

  };

  // Handle Delete Post
  const handleDeletePost = async (discId) => {

    if (window.confirm("Are you sure you want to delete this discussion post?")) {

      try {

        await deleteDoc(doc(db, "discussions", discId));

        alert("Post deleted successfully.");

      } catch (error) {

        console.error("Error deleting post:", error);

      }

    }

  };

  // Handle Like Toggle
  const handleToggleLike = async (disc) => {

    if (!user) {

      alert("Please login to like posts.");

      return;

    }

    const postRef = doc(db, "discussions", disc.id);

    const likesArray = disc.likes || [];

    const isLiked = likesArray.includes(user.uid);

    try {

      if (isLiked) {

        await updateDoc(postRef, {

          likes: arrayRemove(user.uid),

        });

      } else {

        await updateDoc(postRef, {

          likes: arrayUnion(user.uid),

        });

      }

    } catch (error) {

      console.error("Error toggling like:", error);

    }

  };

  // Handle Add Comment
  const handleAddComment = async (discId) => {

    if (!user) {

      alert("Please login to comment.");

      return;

    }

    const text = commentText[discId];

    if (!text || !text.trim()) {

      return;

    }

    const newComment = {

      id: `comment_${Date.now()}`,

      authorName: user.displayName || user.email.split("@")[0],

      authorEmail: user.email,

      authorUid: user.uid,

      text: text.trim(),

      createdAt: new Date().toISOString(),

      replies: [],

    };

    try {

      const postRef = doc(db, "discussions", discId);

      await updateDoc(postRef, {

        comments: arrayUnion(newComment),

      });

      setCommentText((prev) => {

        return { ...prev, [discId]: "" };

      });

    } catch (error) {

      console.error("Error adding comment:", error);

    }

  };

  // Handle Add Reply to Comment
  const handleAddReply = async (disc, commentId) => {

    if (!user) {

      alert("Please login to reply.");

      return;

    }

    const text = replyText[commentId];

    if (!text || !text.trim()) {

      return;

    }

    const newReply = {

      id: `reply_${Date.now()}`,

      authorName: user.displayName || user.email.split("@")[0],

      authorEmail: user.email,

      authorUid: user.uid,

      text: text.trim(),

      createdAt: new Date().toISOString(),

    };

    const updatedComments = (disc.comments || []).map((c) => {

      if (c.id === commentId) {

        return {

          ...c,

          replies: [...(c.replies || []), newReply],

        };

      }

      return c;

    });

    try {

      const postRef = doc(db, "discussions", disc.id);

      await updateDoc(postRef, {

        comments: updatedComments,

      });

      setReplyText((prev) => {

        return { ...prev, [commentId]: "" };

      });

      setActiveReplyId(null);

    } catch (error) {

      console.error("Error adding reply:", error);

    }

  };

  return (

    <section className="mx-auto max-w-7xl px-6 py-16">

      {/* Header */}
      <div className="text-center">

        <MessageSquare
          size={55}
          className="mx-auto text-blue-400"
        />

        <h1 className="mt-4 text-4xl font-bold text-white">

          Academic Discussion Forum

        </h1>

        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">

          Select your department & semester to join discussions, share thoughts, like and reply to your peers!

        </p>

      </div>

      {/* Step 1: Department & Semester Selection Toolbar */}
      <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">

        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">

          <Search size={20} className="text-blue-400" />

          Select Department & Semester:

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Department Select */}
          <div>

            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">

              1. Department

            </label>

            <select
              value={selectedDept}
              onChange={(e) => {

                return setSelectedDept(e.target.value);

              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >

              <option value="cse">CSE (Computer Science)</option>

              <option value="eee">EEE (Electrical Eng.)</option>

              <option value="bba">BBA (Business Admin)</option>

              <option value="civil">Civil Engineering</option>

            </select>

          </div>

          {/* Semester Select */}
          <div>

            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">

              2. Semester

            </label>

            <select
              value={selectedSemester}
              onChange={(e) => {

                return setSelectedSemester(e.target.value);

              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >

              {allSemestersList.map((sem) => {

                return (

                  <option key={sem} value={sem}>

                    {sem}

                  </option>

                );

              })}

            </select>

          </div>

        </div>

      </div>

      {/* Step 2: Academic Discussion Forum */}
      <div className="mt-16">

        <div className="text-center mb-12">

          <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">

            <MessageSquare size={32} className="text-blue-400" />

            {selectedDept.toUpperCase()} ({selectedSemester}) Forum

          </h3>

          <p className="mt-2 text-slate-400 text-sm">

            Discuss questions and topics related to {selectedSemester} courses!

          </p>

        </div>

        {/* Create Discussion Box */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 mb-12 shadow-xl">

          <h4 className="text-lg font-bold text-white mb-6">

            Start a New Discussion for {selectedSemester}

          </h4>

          <form onSubmit={handlePostDiscussion} className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">

              {/* Related Course Selector */}
              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-2">

                  Select Course:

                </label>

                <select
                  value={selectedCourseForDiscussion}
                  onChange={(e) => {

                    return setSelectedCourseForDiscussion(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                >

                  <option value="GENERAL">General Semester Discussion</option>

                  {uploadedCourses.map((cCode) => {

                    return (

                      <option key={cCode} value={cCode}>

                        {cCode}

                      </option>

                    );

                  })}

                </select>

              </div>

              {/* Title Input */}
              <div>

                <label className="block text-xs font-semibold text-slate-400 mb-2">

                  Topic Title:

                </label>

                <input
                  type="text"
                  placeholder="e.g. Need solution for Chapter 3 Assignment"
                  value={newTopic}
                  onChange={(e) => {

                    return setNewTopic(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                />

              </div>

            </div>

            {/* Content Textarea */}
            <div>

              <label className="block text-xs font-semibold text-slate-400 mb-2">

                Discussion Details:

              </label>

              <textarea
                rows={3}
                placeholder="Write your detailed query or thoughts here..."
                value={newContent}
                onChange={(e) => {

                  return setNewContent(e.target.value);

                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm resize-none"
              ></textarea>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn flex items-center gap-2 px-6 py-2.5 text-sm"
            >

              <Send size={16} />

              {isSubmitting ? "Posting..." : "Post to Forum"}

            </button>

          </form>

        </div>

        {/* Discussion Posts Feed */}
        <div className="space-y-6">

          {discussions.length === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400 text-sm">

              No discussions posted for {selectedSemester} yet. Be the first to start a conversation!

            </div>

          ) : (

            discussions.map((disc) => {

              const isOwner = user && (disc.authorUid === user.uid || disc.authorEmail === user.email);

              const isLiked = user && (disc.likes || []).includes(user.uid);

              const commentsList = disc.comments || [];

              const isEditingThis = editingPostId === disc.id;

              return (

                <motion.div
                  key={disc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-style p-6"
                >

                  {/* Post Author Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold">

                        {disc.authorName ? disc.authorName.charAt(0).toUpperCase() : <User size={18} />}

                      </div>

                      <div>

                        <p className="text-sm font-semibold text-white flex items-center gap-2">

                          {disc.authorName}

                          {isOwner && (

                            <span className="rounded bg-blue-500/30 px-1.5 py-0.5 text-[10px] text-blue-300 uppercase">

                              You

                            </span>

                          )}

                        </p>

                        <p className="text-[11px] text-slate-500">

                          {disc.authorEmail}

                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">

                        {disc.courseCode}

                      </span>

                      {/* Delete / Edit Own Post Action Buttons */}
                      {isOwner && !isEditingThis && (

                        <div className="flex items-center gap-1 border-l border-slate-800 pl-3">

                          <button
                            onClick={() => {

                              return handleStartEdit(disc);

                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-400 transition"
                            title="Edit Post"
                          >

                            <Edit3 size={16} />

                          </button>

                          <button
                            onClick={() => {

                              return handleDeletePost(disc.id);

                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition"
                            title="Delete Post"
                          >

                            <Trash2 size={16} />

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                  {/* Post Content OR Edit Mode */}
                  {isEditingThis ? (

                    <div className="space-y-3 my-4 bg-slate-900/90 p-4 rounded-xl border border-blue-500/30">

                      <input
                        type="text"
                        value={editTopic}
                        onChange={(e) => {

                          return setEditTopic(e.target.value);

                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm focus:outline-none"
                      />

                      <textarea
                        rows={3}
                        value={editContent}
                        onChange={(e) => {

                          return setEditContent(e.target.value);

                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm focus:outline-none resize-none"
                      ></textarea>

                      <div className="flex items-center gap-2 justify-end">

                        <button
                          onClick={() => {

                            return setEditingPostId(null);

                          }}
                          className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                        >

                          <X size={14} /> Cancel

                        </button>

                        <button
                          onClick={() => {

                            return handleSaveEdit(disc.id);

                          }}
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
                        >

                          <Check size={14} /> Save Changes

                        </button>

                      </div>

                    </div>

                  ) : (

                    <div>

                      <h5 className="text-lg font-bold text-white mb-2">

                        {disc.topic}

                      </h5>

                      <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">

                        {disc.content}

                      </p>

                    </div>

                  )}

                  {/* Likes and Comments Bar */}
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-800/80 text-xs text-slate-400">

                    {/* Like Button */}
                    <button
                      onClick={() => {

                        return handleToggleLike(disc);

                      }}
                      className={`flex items-center gap-1.5 transition ${
                        isLiked ? "text-rose-500 font-bold" : "hover:text-rose-400"
                      }`}
                    >

                      <Heart
                        size={16}
                        className={isLiked ? "fill-rose-500 text-rose-500" : ""}
                      />

                      <span>{(disc.likes || []).length} Likes</span>

                    </button>

                    {/* Toggle Comments Button */}
                    <button
                      onClick={() => {

                        return setActiveCommentPostId(
                          activeCommentPostId === disc.id ? null : disc.id
                        );

                      }}
                      className="flex items-center gap-1.5 hover:text-blue-400 transition"
                    >

                      <MessageCircle size={16} />

                      <span>{commentsList.length} Comments</span>

                    </button>

                  </div>

                  {/* Comments and Nested Replies Expandable Section */}
                  <AnimatePresence>

                    {activeCommentPostId === disc.id && (

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-800/60 space-y-4"
                      >

                        {/* Add Comment Input */}
                        <div className="flex gap-2">

                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText[disc.id] || ""}
                            onChange={(e) => {

                              const val = e.target.value;

                              return setCommentText((prev) => {

                                return { ...prev, [disc.id]: val };

                              });

                            }}
                            className="flex-1 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />

                          <button
                            onClick={() => {

                              return handleAddComment(disc.id);

                            }}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs text-white font-semibold hover:bg-blue-500 transition"
                          >

                            Comment

                          </button>

                        </div>

                        {/* Comments List */}
                        <div className="space-y-3 pt-2">

                          {commentsList.map((c) => {

                            return (

                              <div
                                key={c.id}
                                className="rounded-xl bg-slate-900/60 p-3 border border-slate-800/50 space-y-2"
                              >

                                <div className="flex items-center justify-between">

                                  <p className="text-xs font-semibold text-slate-200">

                                    {c.authorName}

                                  </p>

                                  <span className="text-[10px] text-slate-500">

                                    {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}

                                  </span>

                                </div>

                                <p className="text-xs text-slate-300">

                                  {c.text}

                                </p>

                                {/* Reply Button */}
                                <div className="pt-1">

                                  <button
                                    onClick={() => {

                                      return setActiveReplyId(
                                        activeReplyId === c.id ? null : c.id
                                      );

                                    }}
                                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                                  >

                                    <CornerDownRight size={12} /> Reply

                                  </button>

                                </div>

                                {/* Replies List */}
                                {c.replies && c.replies.length > 0 && (

                                  <div className="ml-4 pl-3 border-l-2 border-slate-800 space-y-2 pt-2">

                                    {c.replies.map((r) => {

                                      return (

                                        <div key={r.id} className="bg-slate-950/40 p-2 rounded-lg">

                                          <p className="text-[11px] font-semibold text-blue-300">

                                            {r.authorName}

                                          </p>

                                          <p className="text-xs text-slate-300">

                                            {r.text}

                                          </p>

                                        </div>

                                      );

                                    })}

                                  </div>

                                )}

                                {/* Reply Input Box */}
                                {activeReplyId === c.id && (

                                  <div className="flex gap-2 ml-4 pt-2">

                                    <input
                                      type="text"
                                      placeholder="Write a reply..."
                                      value={replyText[c.id] || ""}
                                      onChange={(e) => {

                                        const val = e.target.value;

                                        return setReplyText((prev) => {

                                          return { ...prev, [c.id]: val };

                                        });

                                      }}
                                      className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                    />

                                    <button
                                      onClick={() => {

                                        return handleAddReply(disc, c.id);

                                      }}
                                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white font-semibold hover:bg-blue-500"
                                    >

                                      Reply

                                    </button>

                                  </div>

                                )}

                              </div>

                            );

                          })}

                        </div>

                      </motion.div>

                    )}

                  </AnimatePresence>

                </motion.div>

              );

            })

          )}

        </div>

      </div>

    </section>

  );

}

export default Discussion;