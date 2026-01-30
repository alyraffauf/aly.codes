import { Rose } from "lucide-react";

export default function BackgroundRoses() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Top left */}
      <Rose className="absolute -top-4 -left-4 w-24 h-24 md:w-48 md:h-48 text-rose-300/70 rotate-[-30deg] animate-pulse-subtle" />
      {/* Top right */}
      <Rose className="absolute -top-2 -right-6 w-24 h-24 md:w-48 md:h-48 text-rose-200/80 rotate-30 scale-x-[-1] animate-pulse-subtle" />
      {/* Bottom left */}
      <Rose className="absolute -bottom-4 -left-2 w-24 h-24 md:w-48 md:h-48 text-rose-200/80 rotate-[-30deg] animate-pulse-subtle" />
      {/* Bottom right */}
      <Rose className="absolute -bottom-6 -right-4 w-24 h-24 md:w-48 md:h-48 text-rose-300/70 rotate-30 scale-x-[-1] animate-pulse-subtle" />

      {/* Left edge */}
      <Rose className="hidden md:block md:absolute top-1/4 -left-8 w-24 h-24 text-rose-300/80 rotate-25 scale-x-[-1] animate-pulse-subtle" />
      <Rose className="hidden md:block md:absolute top-1/2 -left-6 w-28 h-28 text-rose-200/90 rotate-[-35deg] animate-pulse-subtle" />
      <Rose className="hidden md:block md:absolute top-3/4 -left-4 w-20 h-20 text-rose-300/80 rotate-40 scale-x-[-1] animate-pulse-subtle" />

      {/* Right edge */}
      <Rose className="hidden md:block md:absolute top-1/4 -right-8 w-24 h-24 text-rose-300/80 rotate-[-25deg] animate-pulse-subtle" />
      <Rose className="hidden md:block md:absolute top-1/2 -right-6 w-28 h-28 text-rose-200/90 rotate-35 scale-x-[-1] animate-pulse-subtle" />
      <Rose className="hidden md:block md:absolute top-3/4 -right-4 w-20 h-20 text-rose-300/80 rotate-[-40deg] animate-pulse-subtle" />
    </div>
  );
}
