import { SocialLinkProps } from "@/app/types";

export default function SocialLink({
  href,
  children,
  icon: Icon,
}: SocialLinkProps) {
  return (
    <>
      <a
        href={href}
        target="_blank"
        className="flex p-4 items-center gap-4 py-2 border-2 border-rose-200 rounded-lg hover:bg-rose-300 transition-colors hover:scale-105 hover:animate-jiggle"
      >
        <Icon className="w-5 h-5" />
        {children}
      </a>
    </>
  );
}
