import fs from "fs";
import path from "path";
import matter from "gray-matter";
import toml from "toml";
import { ImageResponse } from "next/og";
import { RoseBackground, SIZE, loadQuicksandBold } from "./lib/rose-background";

function fontSizeForTitle(title: string): number {
  if (title.length <= 20) return 64;
  if (title.length <= 40) return 52;
  if (title.length <= 60) return 42;
  return 34;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

function setFrontmatterField(raw: string, field: string, rawValue: string): string {
  const line = `${field} = ${rawValue}`;
  const fieldRegex = new RegExp(`^${field}\\s*=.*$`, "m");

  const match = raw.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
  if (!match) throw new Error("Could not find frontmatter block");
  const block = match[1];

  const newBlock = fieldRegex.test(block)
    ? block.replace(fieldRegex, line)
    : `${block}\n${line}`;

  return raw.replace(match[0], `+++\n${newBlock}\n+++`);
}

async function main() {
  const inputArg = process.argv[2];
  if (!inputArg) {
    console.error("Usage: npm run generate:cover-image -- <path-to-post.md>");
    process.exit(1);
  }

  const fullPath = path.resolve(inputArg);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(raw, {
    delimiters: ["+++", "+++"],
    language: "toml",
    engines: { toml: toml.parse.bind(toml) },
  });

  const title: string = data.title;
  if (!title) throw new Error(`${fullPath} is missing a title`);

  const slug = path.basename(fullPath).replace(/\.md$/, "");
  const quicksandBold = await loadQuicksandBold();

  const response = new ImageResponse(
    (
      <RoseBackground variant="corner">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            padding: "0 100px",
          }}
        >
          <div
            style={{
              width: 56,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#be123c",
              marginBottom: 28,
            }}
          />

          <div
            style={{
              display: "flex",
              fontFamily: "Quicksand",
              fontSize: fontSizeForTitle(title),
              fontWeight: 700,
              color: "#18181b",
              letterSpacing: -1,
              lineHeight: 1.15,
              maxWidth: 920,
            }}
          >
            {title}
          </div>

          {data.description && (
            <div
              style={{
                display: "flex",
                fontFamily: "Quicksand",
                fontSize: 28,
                fontWeight: 500,
                color: "#52525b",
                lineHeight: 1.3,
                maxWidth: 820,
                marginTop: 20,
              }}
            >
              {data.description}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Quicksand",
                fontSize: 24,
                fontWeight: 700,
                color: "#be123c",
              }}
            >
              Aly Raffauf
            </div>
            {data.date && (
              <div
                style={{
                  display: "flex",
                  fontFamily: "Quicksand",
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#a1a1aa",
                  marginLeft: 10,
                }}
              >
                · {formatDate(data.date)}
              </div>
            )}
          </div>
        </div>
      </RoseBackground>
    ),
    {
      ...SIZE,
      fonts: [
        {
          name: "Quicksand",
          data: quicksandBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const buffer = Buffer.from(await response.arrayBuffer());
  const coverRelPath = `imgs/covers/${slug}.png`;
  const outPath = path.join(process.cwd(), "public", coverRelPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath}`);

  const withCover = setFrontmatterField(
    raw,
    "cover",
    JSON.stringify(coverRelPath),
  );
  const withHideCover = setFrontmatterField(withCover, "hideCover", "true");
  fs.writeFileSync(fullPath, withHideCover);
  console.log(`Set cover = "${coverRelPath}" and hideCover = true in ${fullPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
