import Image from "next/image";
import { endpoints } from "./api/backend/endpoints";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  GitHubIcon,
  YouTubeIcon,
} from "./socialIcons";
import {
  DATASOC_FACEBOOK_LINK,
  DATASOC_INSTAGRAM_LINK,
  DATASOC_LINKEDIN_LINK,
  DATASOC_GITHUB_LINK,
  DATASOC_YOUTUBE_LINK,
  DATASOC_REGISTRATION_LINK,
} from "./utils";
import LinkButton from "./components/LinkButton";

import AccentureLogo from "public//sponsorLogos/accenture.png";
import AkunaLogo from "public//sponsorLogos/akuna.png";
import AllianzLogo from "public//sponsorLogos/allianz.png";
import AlteryxLogo from "public//sponsorLogos/alteryx.png";
import AtlassianLogo from "public//sponsorLogos/atlassian.png";
import CitadelLogo from "public//sponsorLogos/citadel.png";
import EYLogo from "public//sponsorLogos/ey.png";
import NABLogo from "public//sponsorLogos/nab.png";
import QuantiumLogo from "public//sponsorLogos/quantium.png";
import ResolutionLifeLogo from "public//sponsorLogos/resolution_life.png";
import SynogizeLogo from "public//sponsorLogos/synogize.png";

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

const SPONSORS = [
  { img: QuantiumLogo, url: "https://www.quantium.com/" },
  { img: AtlassianLogo, url: "https://www.atlassian.com/" },
  {
    img: NABLogo,
    url: "https://www.nab.com.au/about-us/careers/business-areas/technology-digital",
  },
  { img: ResolutionLifeLogo, url: "https://www.resolutionlife.com/" },
  {
    img: AllianzLogo,
    url: "https://careers.allianz.com/AUS/go/Graduates-AUS/8779701/",
  },
  { img: SynogizeLogo, url: "https://www.synogize.io/" },
  { img: AkunaLogo, url: "https://akunacapital.com/" },
  { img: AlteryxLogo, url: "https://www.alteryx.com/" },
  { img: EYLogo, url: "https://www.ey.com/" },
  { img: CitadelLogo, url: "https://www.citadel.com/" },
  { img: AccentureLogo, url: "https://www.accenture.com/" },
];

export default function Home() {
  return (
    <>
      <main className="bg-light-rainbow left-0 top-0 z-0 min-h-screen w-full select-none gap-10 pb-48">
        <div className="fade-in-image mix-blend-multiply">
          <div>
            <Image
              src={endpoints.file.getCoverPhoto()}
              alt="Cover Photo"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
              priority
              quality={100}
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-3 pl-48 pt-48 align-baseline text-white brightness-200">
          <div className="text-3xl">Welcome to the</div>
          <div className="text-7xl font-bold">Data Science Society</div>
          <div className="text-3xl">University of New South Wales</div>
          <LinkButton
            to={DATASOC_REGISTRATION_LINK}
            text="Join Us!"
            className="text-bold bg-[#0957ff] p-6 text-lg"
          />
          <SocialIcons />
        </div>
      </main>
      <div className="flex items-center justify-center p-12 align-baseline">
        <div className="flex flex-col items-center justify-center gap-1 align-baseline text-2xl">
          <p className="w-full text-center">UNSW DataSoc</p>
          <p className="w-full text-center font-light">
            Uniting students with a passion for data science,
            <br />
            machine learning and artificial intelligence.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-[#9ad6ff] p-12 align-baseline">
        <h3 className="w-full text-center text-3xl">Recent Blog Posts</h3>
        <p className="w-full text-center font-light">
          Uniting students with a passion for data science,
          <br />
          machine learning and artificial intelligence.
        </p>
      </div>
      <div className="flex items-center justify-center bg-[#fff] p-12 align-baseline">
        <h3 className="w-full text-center text-3xl">Upcoming Events</h3>
        <p className="w-full text-center font-light">
          Uniting students with a passion for data science,
          <br />
          machine learning and artificial intelligence.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-5 bg-[#fadcff] p-12 py-20 align-baseline">
        <p className="w-full text-center text-xl">
          Curated content, straight to your mailbox.
        </p>
        <Link
          href="https://unswdata.us19.list-manage.com/subscribe/post?u=8dc568d0db37b26ed75ba4d94&id=01f8128da2"
          className="rounded-xl bg-[#0001] px-5 py-3 text-lg"
        >
          Subscribe to our newsletter
        </Link>
        <p className="w-full text-center text-xl">
          Or get in touch with us {/* TODO: update to new contact us page */}
          <Link className="underline" href={"/contact"}>
            here
          </Link>
          .
        </p>
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center bg-[#fff] p-12 align-baseline">
        <h3 className="w-full text-2xl font-light">Proudly sponsored by:</h3>
        <div className="flex flex-row flex-wrap justify-center">
          {SPONSORS.map((img, index) => (
            <div
              key={index}
              className="flex max-w-[19rem] items-center justify-center p-10"
            >
              <Link href={img.url}>
                <Image
                  src={img.img}
                  alt="Sponsor Logo"
                  className="object-contain"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
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
