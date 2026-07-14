import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { signIn, forgotPassword } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const { email, password } = formData;

  if (!email.trim()) {
    return setError("Email is required.");
  }

  if (!password.trim()) {
    return setError("Password is required.");
  }

  try {
    setLoading(true);

    await signIn(email, password);

    setFormData({
      email: "",
      password: "",
    });

    navigate(from, { replace: true });

  } catch (err) {

    if (err.code === "auth/invalid-credential") {
      setError("Invalid email or password.");
    } else if (err.code === "auth/user-not-found") {
      setError("User not found.");
    } else if (err.code === "auth/wrong-password") {
      setError("Incorrect password.");
    } else if (err.code === "auth/invalid-email") {
      setError("Please enter a valid email.");
    } else {
      setError("Something went wrong. Please try again.");
    }

  } finally {
    setLoading(false);
  }
};

const handleForgotPassword = async () => {
  setError("");
  setSuccess("");

  if (!formData.email.trim()) {
    return setError("Please enter your email first.");
  }

  try {
    await forgotPassword(formData.email);

    setSuccess(
      "Password reset email has been sent. Please check your inbox."
    );

  } catch (err) {

    if (err.code === "auth/user-not-found") {
      setError("No account found with this email.");
    } else if (err.code === "auth/invalid-email") {
      setError("Please enter a valid email address.");
    } else {
      setError("Unable to send reset email. Please try again.");
    }

  }
};

  return (
    <section className="flex min-h-[85vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-slate-400">
            Login to continue using EduVault
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

          </div>

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none transition focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

          </div>

          {/* Remember Me */}

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-slate-300">

              <input
                type="checkbox"
                className="accent-blue-600"
              />

              Remember Me

            </label>

            <button
  type="button"
  onClick={handleForgotPassword}
  className="text-sm text-blue-400 transition hover:text-blue-300"
>
  Forgot Password?
</button>

          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}
          

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-slate-400">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>

        </p>

      </div>
    </section>
  );
}

export default Login;