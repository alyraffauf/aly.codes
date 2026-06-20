export const SIZE = { width: 1200, height: 630 };

export const ROSE_STRONG = "rgba(253,164,175,0.7)";
export const ROSE_SOFT = "rgba(254,205,211,0.85)";

export async function loadQuicksandBold(): Promise<ArrayBuffer> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Quicksand:wght@700",
    { headers: { "User-Agent": "Mozilla/4.0" } },
  ).then((res) => res.text());

  const fontUrl = css.match(/src: url\(([^)]+)\) format\('truetype'\)/)?.[1];
  if (!fontUrl) throw new Error("Could not resolve Quicksand font URL");

  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

const ROSE_PATHS = [
  "M17 10h-1a4 4 0 1 1 4-4v.534",
  "M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31",
  "M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2",
  "M9.77 12C4 15 2 22 2 22",
];

function Rose({
  size: roseSize,
  color,
  rotate,
  flip,
  top,
  left,
}: {
  size: number;
  color: string;
  rotate: number;
  flip?: boolean;
  top: number;
  left: number;
}) {
  // Satori/Yoga only fully resolves absolute position when both width/height
  // and an explicit top+left are set in style; right/bottom offsets fall back
  // to the parent's alignItems/justifyContent instead of the corner intended.
  return (
    <svg
      width={roseSize}
      height={roseSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        position: "absolute",
        width: roseSize,
        height: roseSize,
        top,
        left,
        transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
      }}
    >
      {ROSE_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
      <circle cx="17" cy="8" r="2" />
    </svg>
  );
}

export function RoseBackground({
  children,
  variant = "full",
}: {
  children: React.ReactNode;
  /** "full" is the dense six-rose pattern used for the site OG image.
   *  "corner" is a quieter two-rose pattern for post covers. */
  variant?: "full" | "corner";
}) {
  const corners = (
    <>
      <Rose size={180} color={ROSE_STRONG} rotate={-30} top={-30} left={-30} />
      <Rose
        size={180}
        color={ROSE_SOFT}
        rotate={30}
        flip
        top={-20}
        left={SIZE.width - 40 - 180}
      />
      <Rose
        size={180}
        color={ROSE_SOFT}
        rotate={-30}
        top={SIZE.height - 30 - 180}
        left={-10}
      />
      <Rose
        size={180}
        color={ROSE_STRONG}
        rotate={30}
        flip
        top={SIZE.height - 40 - 180}
        left={SIZE.width - 20 - 180}
      />
    </>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#fce7f3",
      }}
    >
      {corners}

      {variant === "full" && (
        <>
          <Rose size={130} color={ROSE_STRONG} rotate={25} flip top={150} left={40} />
          <Rose
            size={130}
            color={ROSE_STRONG}
            rotate={-25}
            flip
            top={150}
            left={SIZE.width - 40 - 130}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
