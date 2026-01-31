import type { ProjectProps } from "@/app/types";

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    Go: "bg-cyan-200",
    TypeScript: "bg-blue-200",
    JavaScript: "bg-yellow-200",
    Python: "bg-green-200",
    Rust: "bg-orange-200",
    Nix: "bg-indigo-200",
    Shell: "bg-zinc-200",
    CSS: "bg-purple-200",
  };

  return colors[language] || "bg-zinc-500";
}

export default function Project({
  title,
  description,
  language,
  link,
  stars,
}: ProjectProps) {
  return (
    <>
      <a
        href={link}
        target="_blank"
        className="block p-4 border-2 border-rose-200 rounded-lg hover:bg-rose-300 transition-colors hover:scale-105 hover:animate-jiggle"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{title}</h3>

          <div className="flex gap-4 text-sm shrink-0">
            <span
              className={`${getLanguageColor(language)} px-2 py-0.5 rounded-full`}
            >
              {language}
            </span>
            <span className="border border-zinc-300 px-2 py-0.5 rounded-full">
              ⭐ {stars}
            </span>
          </div>
        </div>

        <p className="text-sm text-zinc-600 mt-1">{description}</p>
      </a>
    </>
  );
}
