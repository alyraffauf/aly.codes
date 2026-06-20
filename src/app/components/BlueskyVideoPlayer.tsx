"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export default function BlueskyVideoPlayer({
  playlist,
  thumbnail,
}: {
  playlist: string;
  thumbnail: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playlist;
      video.play();
      return;
    }

    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) return;
      hls = new Hls();
      hls.loadSource(playlist);
      hls.attachMedia(video);
      video.play();
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [playing, playlist]);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setPlaying(true);
        }}
        className="relative block w-full overflow-hidden rounded-md"
      >
        <Image
          src={thumbnail}
          alt=""
          width={600}
          height={340}
          className="w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="h-12 w-12 fill-white text-white" />
        </span>
      </button>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      poster={thumbnail}
      className="w-full rounded-md"
      onClick={(e) => e.preventDefault()}
    />
  );
}
