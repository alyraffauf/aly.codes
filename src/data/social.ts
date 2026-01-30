import type { SocialLink } from "@/app/types";
import { FaGithub, FaLinkedin, FaBluesky, FaEnvelope } from "react-icons/fa6";

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
];
