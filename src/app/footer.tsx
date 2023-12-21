import Image from "next/image";
import Link from "next/link";

import {
  DATASOC_FACEBOOK_LINK,
  DATASOC_GITHUB_LINK,
  DATASOC_INSTAGRAM_LINK,
  DATASOC_LINKEDIN_LINK,
  DATASOC_YOUTUBE_LINK,
} from "@/app/utils";

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
    <>
      <div className="flex flex-wrap items-start justify-between gap-10 bg-[#f1f1f1] py-7 md:py-12 px-7 align-baseline md:px-12 lg:px-24">
        <div className="align-start flex flex-col flex-grow-[2] items-start justify-start gap-6 text-sm text-[#b4b6b7] sm:w-2/5 pr-5 md:pr-10">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="Picture of the author"
          />
          <p>Made with ❤️ by UNSW Data Science Society</p>
          <p>Proudly supported by Arc UNSW</p>
          <p className="text-justify max-w-[550px]">
            UNSW DataSoc acknowledges the Aboriginal and Torres Strait Islander
            peoples as the first inhabitants of this nation and the Bedegal
            people as the Traditional Custodians of the Land where the UNSW
            Kensington campus is situated. We pay our respects to all Elders
            past, present and future.
          </p>
        </div>
        <div className="flex flex-col items-start flex-grow-[1] justify-start gap-1 align-baseline text-[#b4b6b7]">
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
              className="text-[#aaa] transition-all hover:text-[#888]"
              href={href}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-start flex-grow-[1] justify-start gap-1 align-baseline text-[#b4b6b7]">
          <p className="font-bold uppercase tracking-wide text-[#444e5f]">
            Get In Touch
          </p>
          <Link
            href={DATASOC_FACEBOOK_LINK}
            className="flex gap-2 text-[#aaa] transition-all hover:text-[#888]"
          >
            <FacebookIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
            Facebook
          </Link>
          <Link
            href={DATASOC_INSTAGRAM_LINK}
            className="flex gap-2 text-[#aaa] transition-all hover:text-[#888]"
          >
            <InstagramIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
            Instagram
          </Link>
          <Link
            href={DATASOC_LINKEDIN_LINK}
            className="flex gap-2 text-[#aaa] transition-all hover:text-[#888]"
          >
            <LinkedInIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
            LinkedIn
          </Link>
          <Link
            href={DATASOC_GITHUB_LINK}
            className="flex gap-2 text-[#aaa] transition-all hover:text-[#888]"
          >
            <GitHubIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
            GitHub
          </Link>
          <Link
            href={DATASOC_YOUTUBE_LINK}
            className="flex gap-2 text-[#aaa] transition-all hover:text-[#888]"
          >
            <YouTubeIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
            YouTube
          </Link>
          <div className="h-4"></div>
          <p className="font-bold uppercase tracking-wide text-[#444e5f]">
            Internals
          </p>
          <Link href="/auth/login">Login</Link>
          <Link href="#">Feedback</Link> {/* // TODO: feedback page */}
        </div>
      </div>
    </>
  );
}
