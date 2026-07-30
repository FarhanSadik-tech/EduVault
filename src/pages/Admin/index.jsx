import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import useAuth from "../../hooks/useAuth";

import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getCountFromServer,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.config";

import {
  ShieldAlert,
  Database,
  MessageSquare,
  Users,
  Trash2,
  ExternalLink,
  PieChart,
  CheckSquare,
  Square,
  Search,
  UserCheck,
  Flag,
  CheckCircle2,
  BellRing,
  Send,
} from "lucide-react";

function Admin() {

  const { user, loading } = useAuth();

  const [resources, setResources] = useState([]);

  const [discussions, setDiscussions] = useState([]);

  const [userList, setUserList] = useState([]);

  const [reportsList, setReportsList] = useState([]);

  const [noticesList, setNoticesList] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);

  const [fetchingData, setFetchingData] = useState(true);

  const [activeTab, setActiveTab] = useState("analytics");

  // Step 4: Notice Input States
  const [noticeTitle, setNoticeTitle] = useState("");

  const [noticeMessage, setNoticeMessage] = useState("");

  const [submittingNotice, setSubmittingNotice] = useState(false);

  // Bulk Selection States
  const [selectedResources, setSelectedResources] = useState([]);

  // User Search State
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Fetch all data
  const fetchAdminData = async () => {

    try {

      // Fetch Resources
      const resourcesSnapshot = await getDocs(collection(db, "resources"));

      const resourceList = resourcesSnapshot.docs.map((itemDoc) => {

        return {

          id: itemDoc.id,

          ...itemDoc.data(),

        };

      });

      setResources(resourceList);

      // Fetch Discussions
      const discussionsSnapshot = await getDocs(collection(db, "discussions"));

      const discussionList = discussionsSnapshot.docs.map((itemDoc) => {

        return {

          id: itemDoc.id,

          ...itemDoc.data(),

        };

      });

      setDiscussions(discussionList);

      // Fetch Users List
      const usersSnapshot = await getDocs(collection(db, "users"));

      const fetchedUsers = usersSnapshot.docs.map((uDoc) => {

        return {

          id: uDoc.id,

          ...uDoc.data(),

        };

      });

      setUserList(fetchedUsers);

      setTotalUsers(fetchedUsers.length);

      // Fetch Reports List
      const reportsSnapshot = await getDocs(collection(db, "reports"));

      const fetchedReports = reportsSnapshot.docs.map((rDoc) => {

        return {

          id: rDoc.id,

          ...rDoc.data(),

        };

      });

      setReportsList(fetchedReports);

      // Step 4: Fetch Notices List
      const noticesSnapshot = await getDocs(collection(db, "notices"));

      const fetchedNotices = noticesSnapshot.docs.map((nDoc) => {

        return {

          id: nDoc.id,

          ...nDoc.data(),

        };

      });

      setNoticesList(fetchedNotices);

    } catch (error) {

      console.error("Error fetching admin panel data:", error);

    } finally {

      setFetchingData(false);

    }

  };

  useEffect(() => {

    fetchAdminData();

  }, []);

  // Department Distribution Calculation
  const getDepartmentStats = () => {

    const deptCounts = {};

    resources.forEach((item) => {

      const dept = item.department || "General";

      deptCounts[dept] = (deptCounts[dept] || 0) + 1;

    });

    return deptCounts;

  };

  const deptStats = getDepartmentStats();

  // Filtered Users List
  const filteredUsers = userList.filter((u) => {

    const searchLower = userSearchQuery.toLowerCase();

    const nameMatch = u.name?.toLowerCase().includes(searchLower);

    const emailMatch = u.email?.toLowerCase().includes(searchLower);

    return nameMatch || emailMatch;

  });

  // Step 4 Admin Action: Create Notice
  const handleCreateNotice = async (e) => {

    e.preventDefault();

    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    setSubmittingNotice(true);

    try {

      const docRef = await addDoc(collection(db, "notices"), {

        title: noticeTitle.trim(),

        message: noticeMessage.trim(),

        postedBy: user.email,

        createdAt: serverTimestamp(),

      });

      setNoticesList((prev) => {

        return [

          {

            id: docRef.id,

            title: noticeTitle.trim(),

            message: noticeMessage.trim(),

            postedBy: user.email,

          },

          ...prev,

        ];

      });

      setNoticeTitle("");

      setNoticeMessage("");

      alert("Global Notice Broadcasted Successfully!");

    } catch (error) {

      console.error("Error creating notice:", error);

    } finally {

      setSubmittingNotice(false);

    }

  };

  // Step 4 Admin Action: Delete Notice
  const handleDeleteNotice = async (noticeId) => {

    try {

      await deleteDoc(doc(db, "notices", noticeId));

      setNoticesList((prev) => {

        return prev.filter((item) => {

          return item.id !== noticeId;

        });

      });

    } catch (error) {

      console.error("Error deleting notice:", error);

    }

  };

  // Admin Action: Dismiss Report
  const handleDismissReport = async (reportId) => {

    try {

      await deleteDoc(doc(db, "reports", reportId));

      setReportsList((prev) => {

        return prev.filter((item) => {

          return item.id !== reportId;

        });

      });

    } catch (error) {

      console.error("Error dismissing report:", error);

    }

  };

  // Admin Action: Delete Single Resource
  const handleDeleteResource = async (resourceId) => {

    const confirmDelete = window.confirm(

      "Admin Action: Are you sure you want to delete this resource?"

    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "resources", resourceId));

      setResources((prev) => {

        return prev.filter((item) => {

          return item.id !== resourceId;

        });

      });

      setSelectedResources((prev) => {

        return prev.filter((id) => {

          return id !== resourceId;

        });

      });

    } catch (error) {

      console.error("Error deleting resource:", error);

    }

  };

  // Bulk Delete Resources
  const handleBulkDeleteResources = async () => {

    if (selectedResources.length === 0) return;

    const confirmDelete = window.confirm(

      `Are you sure you want to delete ${selectedResources.length} selected resources?`

    );

    if (!confirmDelete) return;

    try {

      for (const id of selectedResources) {

        await deleteDoc(doc(db, "resources", id));

      }

      setResources((prev) => {

        return prev.filter((item) => {

          return !selectedResources.includes(item.id);

        });

      });

      setSelectedResources([]);

    } catch (error) {

      console.error("Error in bulk deleting resources:", error);

    }

  };

  // Toggle Resource Checkbox
  const toggleSelectResource = (id) => {

    setSelectedResources((prev) => {

      if (prev.includes(id)) {

        return prev.filter((itemId) => {

          return itemId !== id;

        });

      } else {

        return [...prev, id];

      }

    });

  };

  // Select All / Deselect All Resources
  const toggleSelectAllResources = () => {

    if (selectedResources.length === resources.length) {

      setSelectedResources([]);

    } else {

      setSelectedResources(resources.map((item) => {

        return item.id;

      }));

    }

  };

  // Admin Action: Delete Single Discussion
  const handleDeleteDiscussion = async (discussionId) => {

    const confirmDelete = window.confirm(

      "Admin Action: Are you sure you want to delete this discussion post?"

    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "discussions", discussionId));

      setDiscussions((prev) => {

        return prev.filter((item) => {

          return item.id !== discussionId;

        });

      });

    } catch (error) {

      console.error("Error deleting discussion:", error);

    }

  };

  if (loading || fetchingData) {

    return (

      <div className="py-20 text-center text-white">

        Loading Admin Panel Data...

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
      className="mx-auto max-w-7xl px-6 py-12"
    >

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">

            <ShieldAlert
              size={32}
              className="text-red-500"
            />

            EduVault Administration Panel

          </h1>

          <p className="mt-1 text-sm text-slate-400">

            Manage platform resources, monitor community posts, and review system status.

          </p>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">

          Admin: <span className="font-semibold text-white">{user?.email}</span>

        </div>

      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-4">

        <div className="card-style p-6">

          <div className="flex items-center justify-between">

            <Database
              size={28}
              className="text-blue-400"
            />

            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">

              Active

            </span>

          </div>

          <h2 className="mt-4 text-xs font-medium text-slate-400">

            Total Resources

          </h2>

          <p className="mt-1 text-2xl font-bold text-white">

            {resources.length}

          </p>

        </div>

        <div className="card-style p-6">

          <div className="flex items-center justify-between">

            <MessageSquare
              size={28}
              className="text-cyan-400"
            />

            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">

              Community

            </span>

          </div>

          <h2 className="mt-4 text-xs font-medium text-slate-400">

            Total Discussions

          </h2>

          <p className="mt-1 text-2xl font-bold text-white">

            {discussions.length}

          </p>

        </div>

        <div className="card-style p-6">

          <div className="flex items-center justify-between">

            <Users
              size={28}
              className="text-green-400"
            />

            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">

              Registered

            </span>

          </div>

          <h2 className="mt-4 text-xs font-medium text-slate-400">

            Total Users

          </h2>

          <p className="mt-1 text-2xl font-bold text-white">

            {totalUsers}

          </p>

        </div>

        <div className="card-style p-6">

          <div className="flex items-center justify-between">

            <Flag
              size={28}
              className="text-red-400"
            />

            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400">

              Reports

            </span>

          </div>

          <h2 className="mt-4 text-xs font-medium text-slate-400">

            Flagged Items

          </h2>

          <p className="mt-1 text-2xl font-bold text-white">

            {reportsList.length}

          </p>

        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="mt-10 flex flex-wrap gap-4 border-b border-slate-800 pb-4">

        <button
          onClick={() => {

            return setActiveTab("analytics");

          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "analytics"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >

          Analytics & Distribution

        </button>

        <button
          onClick={() => {

            return setActiveTab("notice");

          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "notice"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >

          Global Notice Broadcast ({noticesList.length})

        </button>

        <button
          onClick={() => {

            return setActiveTab("reports");

          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "reports"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >

          Flagged Reports ({reportsList.length})

        </button>

        <button
          onClick={() => {

            return setActiveTab("users");

          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "users"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >

          User Directory ({totalUsers})

        </button>

        <button
          onClick={() => {

            return setActiveTab("resources");

          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "resources"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >

          Manage Resources ({resources.length})

        </button>

        <button
          onClick={() => {

            return setActiveTab("discussions");

          }}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "discussions"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >

          Manage Discussions ({discussions.length})

        </button>

      </div>

      {/* Tab 1: Department-wise Resource Distribution */}
      {activeTab === "analytics" && (

        <div className="mt-6 card-style p-8">

          <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6">

            <PieChart
              size={22}
              className="text-blue-400"
            />

            Department-wise Resource Distribution

          </h3>

          {Object.keys(deptStats).length === 0 ? (

            <p className="text-slate-400">No resources available for analysis.</p>

          ) : (

            <div className="flex flex-col gap-5 max-w-2xl">

              {Object.entries(deptStats).map(([dept, count]) => {

                const percentage = Math.round((count / resources.length) * 100) || 0;

                return (

                  <div key={dept}>

                    <div className="flex justify-between text-sm font-medium mb-1">

                      <span className="text-white">{dept}</span>

                      <span className="text-slate-400">{count} Files ({percentage}%)</span>

                    </div>

                    <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">

                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      )}

      {/* Tab 2: Global Notice Broadcast System */}
      {activeTab === "notice" && (

        <div className="mt-6 grid gap-8 md:grid-cols-2">

          {/* Broadcast Form */}
          <div className="card-style p-6">

            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">

              <BellRing size={20} className="text-blue-400" />

              Post New Announcement Notice

            </h3>

            <form onSubmit={handleCreateNotice} className="flex flex-col gap-4">

              <div>

                <label className="block text-xs text-slate-400 mb-1">Notice Headline Title</label>

                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => {

                    return setNoticeTitle(e.target.value);

                  }}
                  placeholder="e.g. Exam Schedule Notice / Server Maintenance"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />

              </div>

              <div>

                <label className="block text-xs text-slate-400 mb-1">Detailed Announcement Message</label>

                <textarea
                  value={noticeMessage}
                  onChange={(e) => {

                    return setNoticeMessage(e.target.value);

                  }}
                  rows="4"
                  placeholder="Write message for all students..."
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />

              </div>

              <button
                type="submit"
                disabled={submittingNotice}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white hover:bg-blue-500 transition disabled:opacity-50"
              >

                <Send size={16} />

                {submittingNotice ? "Broadcasting..." : "Broadcast Notice"}

              </button>

            </form>

          </div>

          {/* Active Notices List */}
          <div className="card-style p-6">

            <h3 className="text-lg font-bold text-white mb-4">Active Broadcasted Notices</h3>

            {noticesList.length === 0 ? (

              <p className="text-xs text-slate-500">No notices currently broadcasted.</p>

            ) : (

              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">

                {noticesList.map((n) => {

                  return (

                    <div
                      key={n.id}
                      className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex justify-between items-start gap-2"
                    >

                      <div>

                        <h4 className="text-sm font-bold text-blue-400">{n.title}</h4>

                        <p className="text-xs text-slate-300 mt-1">{n.message}</p>

                      </div>

                      <button
                        onClick={() => {

                          return handleDeleteNotice(n.id);

                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete Notice"
                      >

                        <Trash2 size={16} />

                      </button>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

        </div>

      )}

      {/* Tab 3: Flagged Reports Management */}
      {activeTab === "reports" && (

        <div className="mt-6">

          {reportsList.length === 0 ? (

            <div className="card-style p-8 text-center text-slate-400">

              No reported content or broken links reported.

            </div>

          ) : (

            <div className="flex flex-col gap-4">

              {reportsList.map((item) => {

                return (

                  <div
                    key={item.id}
                    className="card-style p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">

                          {item.type || "Resource Report"}

                        </span>

                        <span className="text-xs text-slate-400">

                          Reported by: {item.reportedBy || "Anonymous Student"}

                        </span>

                      </div>

                      <h4 className="mt-2 text-base font-bold text-white">

                        {item.targetTitle || "Untitled Item"}

                      </h4>

                      <p className="mt-1 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">

                        <span className="font-semibold text-red-400">Reason: </span>

                        {item.reason || "No detailed reason provided."}

                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => {

                          return handleDismissReport(item.id);

                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >

                        <CheckCircle2 size={16} className="text-green-400" />

                        Dismiss Report

                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      )}

      {/* Tab 4: Registered User Directory Table */}
      {activeTab === "users" && (

        <div className="mt-6">

          {/* Search Box */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 max-w-md">

            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => {

                return setUserSearchQuery(e.target.value);

              }}
              placeholder="Search user by name or email..."
              className="w-full bg-transparent text-sm text-white focus:outline-none"
            />

          </div>

          {filteredUsers.length === 0 ? (

            <div className="card-style p-8 text-center text-slate-400">

              No registered users found matching your search.

            </div>

          ) : (

            <div className="card-style overflow-x-auto p-6">

              <table className="w-full text-left text-sm text-slate-300">

                <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">

                  <tr>

                    <th className="px-4 py-3">Full Name</th>

                    <th className="px-4 py-3">Email Address</th>

                    <th className="px-4 py-3">Role</th>

                    <th className="px-4 py-3">User UID</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800/60">

                  {filteredUsers.map((item) => {

                    return (

                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-900/50"
                      >

                        <td className="px-4 py-4 font-semibold text-white flex items-center gap-2">

                          <UserCheck size={16} className="text-blue-400" />

                          {item.name || "N/A"}

                        </td>

                        <td className="px-4 py-4 text-xs text-slate-300">

                          {item.email}

                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">

                            {item.role || "student"}

                          </span>

                        </td>

                        <td className="px-4 py-4 text-xs text-slate-500 font-mono">

                          {item.uid || item.id}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

      {/* Tab 5: Manage Resources with Bulk Delete */}
      {activeTab === "resources" && (

        <div className="mt-6">

          {/* Bulk Delete Bar */}
          {selectedResources.length > 0 && (

            <div className="mb-4 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-white">

              <span className="text-sm font-medium">

                {selectedResources.length} items selected

              </span>

              <button
                onClick={handleBulkDeleteResources}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition"
              >

                <Trash2 size={16} />

                Delete Selected (Bulk)

              </button>

            </div>

          )}

          {resources.length === 0 ? (

            <div className="card-style p-8 text-center text-slate-400">

              No platform resources found.

            </div>

          ) : (

            <div className="card-style overflow-x-auto p-6">

              <table className="w-full text-left text-sm text-slate-300">

                <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">

                  <tr>

                    <th className="px-4 py-3">

                      <button
                        onClick={toggleSelectAllResources}
                        className="text-slate-400 hover:text-white"
                      >

                        {selectedResources.length === resources.length ? (

                          <CheckSquare size={18} className="text-blue-400" />

                        ) : (

                          <Square size={18} />

                        )}

                      </button>

                    </th>

                    <th className="px-4 py-3">Title</th>

                    <th className="px-4 py-3">Department / Course</th>

                    <th className="px-4 py-3">Uploaded By</th>

                    <th className="px-4 py-3 text-right">Actions</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800/60">

                  {resources.map((item) => {

                    const isSelected = selectedResources.includes(item.id);

                    return (

                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-slate-900/50 ${
                          isSelected ? "bg-slate-900/80" : ""
                        }`}
                      >

                        <td className="px-4 py-4">

                          <button
                            onClick={() => {

                              return toggleSelectResource(item.id);

                            }}
                            className="text-slate-400 hover:text-white"
                          >

                            {isSelected ? (

                              <CheckSquare size={18} className="text-blue-400" />

                            ) : (

                              <Square size={18} />

                            )}

                          </button>

                        </td>

                        <td className="px-4 py-4 font-semibold text-white">

                          {item.title}

                        </td>

                        <td className="px-4 py-4 text-xs text-slate-400">

                          {item.department} • {item.course}

                        </td>

                        <td className="px-4 py-4 text-xs text-slate-400">

                          {item.uploadedBy || "Unknown"}

                        </td>

                        <td className="px-4 py-4 text-right">

                          <div className="flex items-center justify-end gap-3">

                            {item.driveLink && (

                              <a
                                href={item.driveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg p-2 text-blue-400 transition-colors hover:bg-blue-500/10"
                                title="View Google Drive Link"
                              >

                                <ExternalLink size={16} />

                              </a>

                            )}

                            <button
                              onClick={() => {

                                return handleDeleteResource(item.id);

                              }}
                              className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                              title="Delete Resource"
                            >

                              <Trash2 size={16} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

      {/* Tab 6: Manage Discussions */}
      {activeTab === "discussions" && (

        <div className="mt-6">

          {discussions.length === 0 ? (

            <div className="card-style p-8 text-center text-slate-400">

              No discussions found.

            </div>

          ) : (

            <div className="flex flex-col gap-4">

              {discussions.map((item) => {

                return (

                  <div
                    key={item.id}
                    className="card-style flex items-start justify-between gap-4 border border-slate-800 p-6"
                  >

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400">

                          {item.category}

                        </span>

                        <span className="text-xs text-slate-400">

                          By {item.authorName} ({item.authorEmail})

                        </span>

                      </div>

                      <h3 className="mt-2 text-lg font-bold text-white">

                        {item.title}

                      </h3>

                      <p className="mt-1 text-sm text-slate-300">

                        {item.content}

                      </p>

                    </div>

                    <button
                      onClick={() => {

                        return handleDeleteDiscussion(item.id);

                      }}
                      className="rounded-lg bg-red-600/10 p-2.5 text-red-400 transition-colors hover:bg-red-600 hover:text-white"
                      title="Delete Discussion Post"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      )}

    </motion.section>

  );

}

export default Admin;