import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedAdminRoute({ children }) {

  const { user, loading } = useAuth();

  // Define authorized Admin Emails
  const adminEmails = [
    "xarhan62@gmail.com",
  ];

  if (loading) {

    return (

      <div className="py-20 text-center text-white">

        Checking admin privileges...

      </div>

    );

  }

  if (!user || !adminEmails.includes(user.email)) {

    return (

      <Navigate
        to="/"
        replace
      />

    );

  }

  return children;

}

export default ProtectedAdminRoute;