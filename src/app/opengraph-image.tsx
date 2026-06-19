import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadQuicksandBold(): Promise<ArrayBuffer> {
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
  style,
}: {
  size: number;
  color: string;
  rotate: number;
  flip?: boolean;
  style: React.CSSProperties;
}) {
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
        transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
        ...style,
      }}
    >
      {ROSE_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
      <circle cx="17" cy="8" r="2" />
    </svg>
  );
}

export default async function Image() {
  const roseStrong = "rgba(253,164,175,0.7)";
  const roseSoft = "rgba(254,205,211,0.85)";
  const quicksandBold = await loadQuicksandBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#fce7f3",
        }}
      >
        <Rose
          size={180}
          color={roseStrong}
          rotate={-30}
          style={{ top: -30, left: -30 }}
        />
        <Rose
          size={180}
          color={roseSoft}
          rotate={30}
          flip
          style={{ top: -20, right: -40 }}
        />
        <Rose
          size={180}
          color={roseSoft}
          rotate={-30}
          style={{ bottom: -30, left: -10 }}
        />
        <Rose
          size={180}
          color={roseStrong}
          rotate={30}
          flip
          style={{ bottom: -40, right: -20 }}
        />
        <Rose
          size={130}
          color={roseStrong}
          rotate={25}
          flip
          style={{ top: 150, left: 40 }}
        />
        <Rose
          size={130}
          color={roseStrong}
          rotate={-25}
          flip
          style={{ top: 150, right: 40 }}
        />

        <div
          style={{
            display: "flex",
            zIndex: 1,
            fontFamily: "Quicksand",
            fontSize: 110,
            fontWeight: 700,
            color: "#18181b",
            letterSpacing: -2,
          }}
        >
          Aly Raffauf
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Quicksand", data: quicksandBold, weight: 700, style: "normal" },
      ],
    },
  );
}
