import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { RoseBackground, SIZE, loadQuicksandBold } from "./lib/rose-background";

async function main() {
  const quicksandBold = await loadQuicksandBold();

  const response = new ImageResponse(
    (
      <RoseBackground>
        <div
          style={{
            display: "flex",
            fontFamily: "Quicksand",
            fontSize: 110,
            fontWeight: 700,
            color: "#18181b",
            letterSpacing: -2,
          }}
        >
          Aly Raffauf
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
  const outPath = path.join(process.cwd(), "public/opengraph-image.png");
  fs.writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
