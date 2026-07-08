import type { SocialLink } from "@/app/types";
import { FaGithub, FaLinkedin, FaBluesky, FaEnvelope, FaMonero } from "react-icons/fa6";

export const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/alyraffauf",
    label: "GitHub",
    icon: FaGithub,
  },
  {
    href: "https://linkedin.com/in/alyraffauf",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    href: "https://bsky.app/profile/aly.codes",
    label: "Bluesky",
    icon: FaBluesky,
  },
  {
    href: "mailto:aly@aly.codes",
    label: "Email",
    icon: FaEnvelope,
  },
  {
    href: "monero:88VjvLZhDncTnCc2zHmB8k1tGmiYPR2Yy9UuRVJpUcyVcTrxsNfGhZFcvyGmtExpiGQKoE5UYX6uqLeWXsZgM99oAdA2Zue",
    label: "XMR",
    icon: FaMonero,
  },
];
