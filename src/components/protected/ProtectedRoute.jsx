import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
    const location = useLocation();

  const { user, loading } = useContext(AuthContext);

  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">

      <div className="text-center">

        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        <p className="mt-5 text-lg text-slate-300">
          Loading EduVault...
        </p>

      </div>

    </div>
  );
}

  if (!user) {
  return (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
}

  return children;
}

export default ProtectedRoute;