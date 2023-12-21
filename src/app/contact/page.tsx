import Image from "next/image";
import Link from "next/link";

import LinkButton from "../components/LinkButton";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "../socialIcons";
import {
  DATASOC_ADDRESS_JSX,
  DATASOC_EMAIL,
  DATASOC_FACEBOOK_LINK,
  DATASOC_GITHUB_LINK,
  DATASOC_GOOGLE_MAPS_IFRAME_LINK,
  DATASOC_INSTAGRAM_LINK,
  DATASOC_LINKEDIN_LINK,
  DATASOC_REGISTRATION_LINK,
  DATASOC_YOUTUBE_LINK,
} from "../utils";
import ContactUsQuoteBackground from "/public/contact_us_quote_background.png";

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

export default function Contact() {
  return (
    <>
      <main className="bg-white">
        <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
          <h1 className="text-3xl font-semibold">Contact Us</h1>
          <p>
            Feel free to reach out to us here if you have any questions or
            queries!
          </p>
        </header>
        <div className="flex flex-col items-center justify-center align-baseline">
          <div className="flex max-w-xl flex-col items-start justify-center align-baseline gap-12 p-12">
            <div className="text-lg flex flex-col items-start justify-center gap-4 align-baseline">
              <p>
                Hi! Whether you&apos;ve got questions about DataSoc or just want
                to know more, feel free to reach out to us via the email below.
              </p>
              <p>
                Stay update to date with us by subscribing to our newletter
                using the form on this page. We send fortnightly news on events,
                workshops, and datathons run by DataSoc, blog posts published by
                our team, as well as carefully curated news from the wider data
                science community.
              </p>
              <p>Be sure to check out our social media links!</p>
              <p>
                Ready to make things official? Become a member of DataSoc with
                the link below!
              </p>
              <LinkButton
                to={DATASOC_REGISTRATION_LINK}
                text="Join Us!"
                className="text-bold bg-[#0957ff] p-6 text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              <p className="font-bold">Email:</p>
              <a className="text-blue-600" href={`mailto: ${DATASOC_EMAIL}`}>
                {DATASOC_EMAIL}
              </a>
            </div>
            <div className="flex flex-col flex-wrap gap-0">
              <p className="font-bold">Address:</p>
              {DATASOC_ADDRESS_JSX}
            </div>
            <SocialIcons />
            <div className="relative">
              <Image
                src={ContactUsQuoteBackground}
                alt="binary numbers on a blue background"
                width={600}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-white sm:text-lg">
                  &quot;The world is one big data problem.&quot;
                </div>
                <div className="text-xs text-white sm:text-lg">
                  Andrew McAfee
                </div>
              </div>
            </div>
          </div>
          <div className="w-full min-h-full">
            <iframe
              src={DATASOC_GOOGLE_MAPS_IFRAME_LINK}
              className="w-full h-full"
              allowFullScreen
              aria-hidden="false"
            />
          </div>
        </div>
      </main>
    </>
  );
}

function SocialIcons() {
  return (
    <>
      <div className="flex items-start justify-start gap-3 align-baseline text-[#b4b6b7]">
        <Link href={DATASOC_FACEBOOK_LINK} className="flex gap-1">
          <FacebookIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
        </Link>
        <Link href={DATASOC_INSTAGRAM_LINK} className="flex gap-1">
          <InstagramIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
        </Link>
        <Link href={DATASOC_LINKEDIN_LINK} className="flex gap-1">
          <LinkedInIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
        </Link>
        <Link href={DATASOC_GITHUB_LINK} className="flex gap-1">
          <GitHubIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
        </Link>
        <Link href={DATASOC_YOUTUBE_LINK} className="flex gap-1">
          <YouTubeIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
        </Link>
      </div>
    </>
  );
}
