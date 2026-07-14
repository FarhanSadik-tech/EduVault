import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

function ResourceCard({ resource }) {

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleDownload = () => {

  if (!user) {

    setShowModal(true);

    return;

  }

  alert("Download feature will be connected after Storage integration.");

};
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      className="card-style group p-7"
    >
      <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-400">
        {resource.type}
      </span>

      <h3 className="mt-6 text-2xl font-bold text-white">
        {resource.course}
      </h3>

      <p className="mt-2 text-slate-400">
        {resource.title}
      </p>

      <p className="mt-2 text-slate-500">
        {resource.department}
      </p>

      <button
        onClick={handleDownload}
        className="primary-btn mt-8 w-full">
          Download Resource
      </button>
      {showModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

    <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

      <h2 className="text-2xl font-bold text-white">
        Login Required
      </h2>

      <p className="mt-4 text-slate-300">
        Please login to download this resource.
      </p>

      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() => setShowModal(false)}
          className="rounded-xl border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          onClick={() => navigate("/login")}
          className="primary-btn px-6 py-2"
        >
          Login
        </button>

      </div>

    </div>

  </div>

)}
    </motion.div>
  );
}

export default ResourceCard;