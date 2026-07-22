import SocialLink from "@/app/components/SocialLink";
import { socialLinks } from "@/content/social";

export default async function SocialLinkList() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-5">
        {socialLinks.map((link) => (
          <SocialLink key={link.href} href={link.href} icon={link.icon}>
            {link.label}
          </SocialLink>
        ))}
      </div>
    </>
  );
}
