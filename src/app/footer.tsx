import Image from "next/image";
import Link from "next/link";

import {
  DATASOC_FACEBOOK_LINK,
  DATASOC_GITHUB_LINK,
  DATASOC_INSTAGRAM_LINK,
  DATASOC_LINKEDIN_LINK,
  DATASOC_YOUTUBE_LINK,
} from "@/app/utils";

import LoginButton from "./components/loginButton";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "./socialIcons";

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-start justify-between gap-10 bg-[#f5f5f5] px-7 py-7 align-baseline md:px-12 md:py-12 lg:px-24">
      <div className="align-start flex flex-grow-[2] flex-col items-start justify-start gap-6 pr-5 text-sm text-[#808482] sm:w-2/5 md:pr-10">
        <Image
          src="/logo.png"
          width={118}
          height={32}
          className="h-[2rem] w-auto"
          alt="Picture of the author"
        />
        <p>Made with ❤️ by UNSW Data Science Society</p>
        <p>Proudly supported by Arc UNSW</p>
        <p className="max-w-[550px] text-justify">
          UNSW DataSoc acknowledges the Aboriginal and Torres Strait Islander
          peoples as the first inhabitants of this nation and the Bedegal people
          as the Traditional Custodians of the Land where the UNSW Kensington
          campus is situated. We pay our respects to all Elders past, present
          and future.
        </p>
      </div>
      <div className="flex flex-grow-[1] flex-col items-start justify-start gap-1 align-baseline text-[#808482]">
        <p className="font-bold uppercase tracking-wide text-[#444e5f]">
          DataSoc
        </p>
        {[
          { name: "Home", href: "/" },
          { name: "About Us", href: "/about" },
          { name: "Our Sponsors", href: "/sponsorships" },
          { name: "Our Events", href: "/events" },
          { name: "Jobs Board", href: "/jobs" },
          { name: "Blog", href: "/blogs" },
          { name: "Resources", href: "/resources" },
          { name: "Publications", href: "/publications" },
          { name: "Contact Us", href: "/contact" },
        ].map(({ name, href }) => (
          <Link
            key={name}
            className="text-[#808482] transition-all hover:text-[#5c5f5d]"
            href={href}
          >
            {name}
          </Link>
        ))}
      </div>
      <div className="flex flex-grow-[1] flex-col items-start justify-start gap-1 align-baseline text-[#808482]">
        <p className="font-bold uppercase tracking-wide text-[#444e5f]">
          Get In Touch
        </p>
        <Link
          href={DATASOC_FACEBOOK_LINK}
          className="flex gap-2 text-[#808482] transition-all hover:text-[#5c5f5d]"
        >
          <FacebookIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
          Facebook
        </Link>
        <Link
          href={DATASOC_INSTAGRAM_LINK}
          className="flex gap-2 text-[#808482] transition-all hover:text-[#5c5f5d]"
        >
          <InstagramIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
          Instagram
        </Link>
        <Link
          href={DATASOC_LINKEDIN_LINK}
          className="flex gap-2 text-[#808482] transition-all hover:text-[#5c5f5d]"
        >
          <LinkedInIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
          LinkedIn
        </Link>
        <Link
          href={DATASOC_GITHUB_LINK}
          className="flex gap-2 text-[#808482] transition-all hover:text-[#5c5f5d]"
        >
          <GitHubIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
          GitHub
        </Link>
        <Link
          href={DATASOC_YOUTUBE_LINK}
          className="flex gap-2 text-[#808482] transition-all hover:text-[#5c5f5d]"
        >
          <YouTubeIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
          YouTube
        </Link>
        <div className="h-4"></div>
        <p className="font-bold uppercase tracking-wide text-[#444e5f]">
          Internals
        </p>
        <Link
          href={"/about/tech"}
          className="flex gap-2 text-[#808482] transition-all hover:text-[#5c5f5d]"
        >
          Tech
        </Link>
        <LoginButton />
      </div>
    </footer>
  );
}
