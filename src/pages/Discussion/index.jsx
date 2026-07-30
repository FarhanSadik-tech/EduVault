import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import useAuth from "../../hooks/useAuth";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import {
  Send,
  Sparkles,
  MessageCircle,
  ThumbsUp,
  Trash2,
  MessageSquare,
  Edit3,
  Check,
  X,
} from "lucide-react";

function Discussion() {

  const { user } = useAuth();

  const [discussions, setDiscussions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // Active Comment Box & Comments State
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const [commentText, setCommentText] = useState("");

  const [postComments, setPostComments] = useState({});

  const [submittingComment, setSubmittingComment] = useState(false);

  // Edit Discussion Post States
  const [editingPostId, setEditingPostId] = useState(null);

  const [editTitle, setEditTitle] = useState("");

  const [editContent, setEditContent] = useState("");

  const [updatingPost, setUpdatingPost] = useState(false);

  // Form States
  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("General");

  const [content, setContent] = useState("");

  // Fetch all discussions
  const fetchDiscussions = async () => {

    try {

      const q = query(

        collection(db, "discussions"),

        orderBy("createdAt", "desc")

      );

      const snapshot = await getDocs(q);

      const postList = snapshot.docs.map((docItem) => {

        return {

          id: docItem.id,

          ...docItem.data(),

        };

      });

      setDiscussions(postList);

    } catch (error) {

      console.error("Error fetching discussions:", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchDiscussions();

  }, []);

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {

    try {

      const commentsRef = collection(db, "discussions", postId, "comments");

      const q = query(commentsRef, orderBy("createdAt", "asc"));

      const snapshot = await getDocs(q);

      const commentsList = snapshot.docs.map((cDoc) => {

        return {

          id: cDoc.id,

          ...cDoc.data(),

        };

      });

      setPostComments((prev) => {

        return {

          ...prev,

          [postId]: commentsList,

        };

      });

    } catch (error) {

      console.error("Error fetching comments:", error);

    }

  };

  // Toggle Comment Box & Load Comments
  const handleToggleComments = (postId) => {

    if (activeCommentPostId === postId) {

      setActiveCommentPostId(null);

    } else {

      setActiveCommentPostId(postId);

      fetchComments(postId);

    }

  };

  // Handle Post Creation
  const handleCreatePost = async (e) => {

    e.preventDefault();

    if (!title.trim() || !content.trim() || !user) return;

    setSubmitting(true);

    try {

      await addDoc(collection(db, "discussions"), {

        title: title.trim(),

        category: category,

        content: content.trim(),

        authorName: user.displayName || "Anonymous Student",

        authorEmail: user.email,

        authorPhoto: user.photoURL || "https://i.pravatar.cc/150",

        likesCount: 0,

        likedBy: [],

        commentsCount: 0,

        createdAt: serverTimestamp(),

      });

      setTitle("");

      setContent("");

      setCategory("General");

      fetchDiscussions();

    } catch (error) {

      console.error("Error creating post:", error);

    } finally {

      setSubmitting(false);

    }

  };

  // Handle Start Editing Post
  const handleStartEdit = (post) => {

    setEditingPostId(post.id);

    setEditTitle(post.title);

    setEditContent(post.content);

  };

  // Handle Save Edited Post
  const handleSaveEditPost = async (e, postId) => {

    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) return;

    setUpdatingPost(true);

    try {

      const postRef = doc(db, "discussions", postId);

      await updateDoc(postRef, {

        title: editTitle.trim(),

        content: editContent.trim(),

      });

      setDiscussions((prev) => {

        return prev.map((item) => {

          if (item.id === postId) {

            return {

              ...item,

              title: editTitle.trim(),

              content: editContent.trim(),

            };

          }

          return item;

        });

      });

      setEditingPostId(null);

    } catch (error) {

      console.error("Error updating post:", error);

    } finally {

      setUpdatingPost(false);

    }

  };

  // Handle Single Like / Unlike Toggle
  const handleLike = async (postId, likedByArray = []) => {

    if (!user) {

      alert("Please login to like posts.");

      return;

    }

    const hasLiked = likedByArray.includes(user.email);

    const postRef = doc(db, "discussions", postId);

    try {

      if (hasLiked) {

        await updateDoc(postRef, {

          likesCount: increment(-1),

          likedBy: arrayRemove(user.email),

        });

        setDiscussions((prev) => {

          return prev.map((item) => {

            if (item.id === postId) {

              return {

                ...item,

                likesCount: Math.max((item.likesCount || 0) - 1, 0),

                likedBy: (item.likedBy || []).filter((email) => {

                  return email !== user.email;

                }),

              };

            }

            return item;

          });

        });

      } else {

        await updateDoc(postRef, {

          likesCount: increment(1),

          likedBy: arrayUnion(user.email),

        });

        setDiscussions((prev) => {

          return prev.map((item) => {

            if (item.id === postId) {

              return {

                ...item,

                likesCount: (item.likesCount || 0) + 1,

                likedBy: [...(item.likedBy || []), user.email],

              };

            }

            return item;

          });

        });

      }

    } catch (error) {

      console.error("Error updating like status:", error);

    }

  };

  // Handle Submit Comment
  const handleAddComment = async (e, postId) => {

    e.preventDefault();

    if (!commentText.trim() || !user) return;

    setSubmittingComment(true);

    try {

      const commentsRef = collection(db, "discussions", postId, "comments");

      await addDoc(commentsRef, {

        text: commentText.trim(),

        userName: user.displayName || "Anonymous User",

        userPhoto: user.photoURL || "https://i.pravatar.cc/150",

        userEmail: user.email,

        createdAt: serverTimestamp(),

      });

      const postRef = doc(db, "discussions", postId);

      await updateDoc(postRef, {

        commentsCount: increment(1),

      });

      setCommentText("");

      fetchComments(postId);

      setDiscussions((prev) => {

        return prev.map((item) => {

          if (item.id === postId) {

            return {

              ...item,

              commentsCount: (item.commentsCount || 0) + 1,

            };

          }

          return item;

        });

      });

    } catch (error) {

      console.error("Error adding comment:", error);

    } finally {

      setSubmittingComment(false);

    }

  };

  // Handle Delete Comment
  const handleDeleteComment = async (postId, commentId) => {

    try {

      await deleteDoc(doc(db, "discussions", postId, "comments", commentId));

      const postRef = doc(db, "discussions", postId);

      await updateDoc(postRef, {

        commentsCount: increment(-1),

      });

      fetchComments(postId);

      setDiscussions((prev) => {

        return prev.map((item) => {

          if (item.id === postId) {

            return {

              ...item,

              commentsCount: Math.max((item.commentsCount || 0) - 1, 0),

            };

          }

          return item;

        });

      });

    } catch (error) {

      console.error("Error deleting comment:", error);

    }

  };

  // Handle Delete Post
  const handleDeletePost = async (postId) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this discussion?"

    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "discussions", postId));

      setDiscussions((prev) => {

        return prev.filter((item) => {

          return item.id !== postId;

        });

      });

    } catch (error) {

      console.error("Error deleting post:", error);

    }

  };

  if (loading) {

    return (

      <div className="py-20 text-center text-white">

        Loading Discussion Forum...

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
      className="mx-auto max-w-5xl px-6 py-12"
    >

      {/* Header */}
      <div className="text-center">

        <h1 className="text-4xl font-extrabold text-white">

          Academic Discussion Forum

        </h1>

        <p className="mt-3 text-slate-400">

          Ask questions, share insights, and discuss academic topics with peers.

        </p>

      </div>

      {/* Create Discussion Form */}
      {user ? (

        <div className="card-style mt-10 p-8">

          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">

            <Sparkles
              size={20}
              className="text-blue-400"
            />

            Start a Discussion

          </h2>

          <form
            onSubmit={handleCreatePost}
            className="flex flex-col gap-4"
          >

            <div className="grid gap-4 md:grid-cols-3">

              <div className="md:col-span-2">

                <input
                  type="text"
                  value={title}
                  onChange={(e) => {

                    return setTitle(e.target.value);

                  }}
                  placeholder="Discussion Topic / Title..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  required
                />

              </div>

              <div>

                <select
                  value={category}
                  onChange={(e) => {

                    return setCategory(e.target.value);

                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >

                  <option value="General">General Academic</option>

                  <option value="CSE">Computer Science</option>

                  <option value="EEE">Digital Electronics</option>

                  <option value="DBMS">Database Systems</option>

                  <option value="Exam Help">Exam & Assignments</option>

                </select>

              </div>

            </div>

            <div>

              <textarea
                value={content}
                onChange={(e) => {

                  return setContent(e.target.value);

                }}
                rows="4"
                placeholder="Write your question or thoughts in detail..."
                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-4 text-white focus:border-blue-500 focus:outline-none"
                required
              />

            </div>

            <div className="flex justify-end">

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
              >

                <Send size={18} />

                {submitting ? "Posting..." : "Post Discussion"}

              </button>

            </div>

          </form>

        </div>

      ) : (

        <div className="card-style mt-10 p-6 text-center text-slate-400">

          Please login to start or join academic discussions.

        </div>

      )}

      {/* Discussion List Feed */}
      <div className="mt-12">

        <h2 className="mb-6 text-2xl font-bold text-white">

          Recent Discussions

        </h2>

        {discussions.length === 0 ? (

          <div className="card-style flex flex-col items-center justify-center p-12 text-center">

            <MessageCircle
              size={48}
              className="mb-4 text-slate-500"
            />

            <h3 className="text-xl font-semibold text-white">

              No Discussions Yet

            </h3>

            <p className="mt-2 text-slate-400">

              Be the first to start a conversation!

            </p>

          </div>

        ) : (

          <div className="flex flex-col gap-6">

            {discussions.map((item) => {

              const isLiked = item.likedBy?.includes(user?.email);

              const isOwner = user?.email === item.authorEmail;

              return (

                <motion.div
                  key={item.id}
                  whileHover={{
                    scale: 1.005,
                  }}
                  className="card-style border border-slate-800 p-6 transition-all hover:border-slate-700"
                >

                  {/* Author Header */}
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={item.authorPhoto || "https://i.pravatar.cc/150"}
                        alt={item.authorName}
                        className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                      />

                      <div>

                        <h4 className="text-sm font-semibold text-white">

                          {item.authorName}

                        </h4>

                        <p className="text-xs text-slate-400">

                          {item.authorEmail}

                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">

                        {item.category}

                      </span>

                      {/* Owner Post Controls */}
                      {isOwner && (

                        <div className="flex items-center gap-1">

                          <button
                            onClick={() => {

                              return handleStartEdit(item);

                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            title="Edit Discussion"
                          >

                            <Edit3 size={16} />

                          </button>

                          <button
                            onClick={() => {

                              return handleDeletePost(item.id);

                            }}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Discussion"
                          >

                            <Trash2 size={16} />

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                  {/* Post Content OR Edit Form */}
                  {editingPostId === item.id ? (

                    <form
                      onSubmit={(e) => {

                        return handleSaveEditPost(e, item.id);

                      }}
                      className="mt-4 flex flex-col gap-3"
                    >

                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => {

                          return setEditTitle(e.target.value);

                        }}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        required
                      />

                      <textarea
                        value={editContent}
                        onChange={(e) => {

                          return setEditContent(e.target.value);

                        }}
                        rows="3"
                        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-blue-500 focus:outline-none"
                        required
                      />

                      <div className="flex gap-2">

                        <button
                          type="submit"
                          disabled={updatingPost}
                          className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                        >

                          {updatingPost ? "Saving..." : "Save Changes"}

                        </button>

                        <button
                          type="button"
                          onClick={() => {

                            return setEditingPostId(null);

                          }}
                          className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                        >

                          Cancel

                        </button>

                      </div>

                    </form>

                  ) : (

                    <>

                      <h3 className="mt-4 text-xl font-bold text-white">

                        {item.title}

                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-slate-300">

                        {item.content}

                      </p>

                    </>

                  )}

                  {/* Action Bar */}
                  <div className="mt-6 flex items-center gap-6 border-t border-slate-800/80 pt-4 text-xs text-slate-400">

                    <button
                      onClick={() => {

                        return handleLike(item.id, item.likedBy);

                      }}
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        isLiked
                          ? "font-bold text-blue-400"
                          : "text-slate-400 hover:text-blue-400"
                      }`}
                    >

                      <ThumbsUp
                        size={16}
                        className={isLiked ? "fill-blue-400 text-blue-400" : ""}
                      />

                      <span>{item.likesCount || 0} {isLiked ? "Liked" : "Likes"}</span>

                    </button>

                    <button
                      onClick={() => {

                        return handleToggleComments(item.id);

                      }}
                      className="flex items-center gap-1.5 font-medium text-slate-400 hover:text-blue-400 transition-colors"
                    >

                      <MessageSquare size={16} />

                      <span>{item.commentsCount || 0} Comments</span>

                    </button>

                  </div>

                  {/* Comment Section Dropdown */}
                  {activeCommentPostId === item.id && (

                    <div className="mt-6 border-t border-slate-800/80 pt-4">

                      {/* Comment Input Form */}
                      {user ? (

                        <form
                          onSubmit={(e) => {

                            return handleAddComment(e, item.id);

                          }}
                          className="flex gap-2"
                        >

                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => {

                              return setCommentText(e.target.value);

                            }}
                            placeholder="Write a reply or comment..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            required
                          />

                          <button
                            type="submit"
                            disabled={submittingComment}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                          >

                            {submittingComment ? "Replying..." : "Reply"}

                          </button>

                        </form>

                      ) : (

                        <p className="text-xs text-slate-500">

                          Login to leave a comment.

                        </p>

                      )}

                      {/* Comments List Display */}
                      <div className="mt-4 flex flex-col gap-3">

                        {postComments[item.id] && postComments[item.id].length > 0 ? (

                          postComments[item.id].map((comment) => {

                            const isCommentOwner = user?.email === comment.userEmail;

                            return (

                              <div
                                key={comment.id}
                                className="flex items-start justify-between gap-3 rounded-lg border border-slate-800/50 bg-slate-900/60 p-3"
                              >

                                <div className="flex items-start gap-3">

                                  <img
                                    src={comment.userPhoto || "https://i.pravatar.cc/150"}
                                    alt={comment.userName}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />

                                  <div>

                                    <h5 className="text-xs font-semibold text-white">

                                      {comment.userName}

                                    </h5>

                                    <p className="mt-1 text-xs text-slate-300">

                                      {comment.text}

                                    </p>

                                  </div>

                                </div>

                                {isCommentOwner && (

                                  <button
                                    onClick={() => {

                                      return handleDeleteComment(item.id, comment.id);

                                    }}
                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete Comment"
                                  >

                                    <Trash2 size={14} />

                                  </button>

                                )}

                              </div>

                            );

                          })

                        ) : (

                          <p className="pt-2 text-xs text-slate-500">

                            No comments yet. Start the conversation!

                          </p>

                        )}

                      </div>

                    </div>

                  )}

                </motion.div>

              );

            })}

          </div>

        )}

      </div>

    </motion.section>

  );

}

export default Discussion;