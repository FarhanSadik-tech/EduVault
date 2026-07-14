import {
  FileText,
  BookOpen,
  Users,
  Star,
} from "lucide-react";

function StatsSection() {
  return (
    <section className="mt-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* Card 1 */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">
            <Users size={42} className="text-green-400" />
          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">
            12K+
          </h2>

          <p className="mt-2 text-slate-400">
            Students
          </p>

        </div>

        {/* Card 2 */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">
            <BookOpen size={42} className="text-blue-400" />
          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">
            500+
          </h2>

          <p className="mt-2 text-slate-400">
            Courses
          </p>

        </div>

        {/* Card 3 */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">
            <FileText size={42} className="text-cyan-400" />
          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">
            35K+
          </h2>

          <p className="mt-2 text-slate-400">
            Resources
          </p>

        </div>

        {/* Card 4 */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-blue-500/20">

          <div className="flex justify-center">
            <Star size={42} className="text-yellow-400 fill-yellow-400" />
          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">
            4.9
          </h2>

          <p className="mt-2 text-slate-400">
            Average Rating
          </p>

        </div>

      </div>
    </section>
  );
}

export default StatsSection;