import { FileText } from "lucide-react";

function ResourceCard({ resource }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
          {resource.type}
        </span>

        <FileText
          size={22}
          className="text-blue-400"
        />

      </div>

      <h2 className="mt-5 text-2xl font-semibold text-white">
        {resource.title}
      </h2>

      <p className="mt-2 text-slate-400">
        {resource.description}
      </p>

      <div className="mt-6 space-y-2 text-sm text-slate-300">

        <p>
          <span className="font-semibold text-white">
            Department:
          </span>{" "}
          {resource.department}
        </p>

        <p>
          <span className="font-semibold text-white">
            Course:
          </span>{" "}
          {resource.course}
        </p>

        <p>
          <span className="font-semibold text-white">
            File:
          </span>{" "}
          {resource.fileName}
        </p>

      </div>

    </div>
  );
}

export default ResourceCard;