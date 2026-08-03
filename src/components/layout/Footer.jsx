import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-[1400px] px-8 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              Edu<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">VaultBD</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              A collaborative academic platform where students can
              access notes, previous questions, solutions,
              learning resources and engage in academic discussions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-blue-400">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/department" className="text-slate-400 hover:text-blue-400">
                  Departments
                </Link>
              </li>

              <li>
                <Link to="/course" className="text-slate-400 hover:text-blue-400">
                  Courses
                </Link>
              </li>

              <li>
                <Link to="/discussion" className="text-slate-400 hover:text-blue-400">
                  Discussion
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Resources
            </h3>

            <ul className="space-y-3">
              <li className="text-slate-400">Question Bank</li>
              <li className="text-slate-400">Lecture Notes</li>
              <li className="text-slate-400">Solutions</li>
              <li className="text-slate-400">Video Lectures</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Contact
            </h3>

            <ul className="space-y-3">
              <li className="text-slate-400">
                📧 xarhan62@gmail.com
              </li>

              <li className="text-slate-400">
                🌍 Dhaka, Bangladesh
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500">
            © 2026 EduVaultBD Team. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;