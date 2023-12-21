import Image from "next/image";
import Link from "next/link";

import { api } from "@/trpc/server";

import { getFirstImageUrl } from "./blogs/utils";
import LinkButton from "./components/LinkButton";
import BlogImageHomePage from "./components/blogImageHomePage";
import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "./socialIcons";
import {
  DATASOC_FACEBOOK_LINK,
  DATASOC_GITHUB_LINK,
  DATASOC_INSTAGRAM_LINK,
  DATASOC_LINKEDIN_LINK,
  DATASOC_REGISTRATION_LINK,
  DATASOC_YOUTUBE_LINK,
  Event_PHOTO_X_PXL,
  Event_PHOTO_Y_PXL,
} from "./utils";
import {
  getCompanyImageRoute,
  getCoverPhotoRoute,
  getEventImageRoute,
} from "./utils/s3";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

const NUM_DISPLAY_EVENTS = 3;
const NUM_DISPLAY_BLOGS = 3;

export default async function Home() {
  const [futureEvents, blogs, sponsors, coverPhoto] = await Promise.all([
    api.events.getUpcoming.query({ limit: NUM_DISPLAY_EVENTS }),
    api.blogs.getRecent.query({ limit: NUM_DISPLAY_BLOGS }),
    api.sponsorships.getAll.query(),
    api.coverPhotos.getLatest.query(),
  ]);

  // we only care about unique companies
  const companies = sponsors
    .map(({ company }) => company)
    .filter(
      (item, pos, self) => self.findIndex((c) => c.id === item.id) == pos,
    );

  return (
    <>
      {/* navbar height hardcoded as 4rem here */}
      <main className="bg-light-rainbow left-0 top-0 z-0 mt-[-4rem] min-h-screen w-full select-none">
        <div className="fade-in-image mix-blend-multiply">
          <Image
            src={getCoverPhotoRoute(coverPhoto.id)}
            alt="Cover Photo"
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
            }}
            priority
            quality={100}
            className="coverPhoto"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-3 px-8 pt-48 align-baseline  text-white brightness-200 sm:items-start md:pl-20 md:pt-48 lg:pl-36 xl:pl-48">
          <div className="text-center text-3xl sm:text-left">
            Welcome to the
          </div>
          <div className="text-center text-6xl font-bold sm:text-left sm:text-7xl">
            Data Science Society
          </div>
          <div className="text-center text-3xl sm:text-left">
            University of New South Wales
          </div>
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
      <div className="flex flex-col items-center justify-center gap-7 bg-[#b6e2ff] p-12 py-24 align-baseline">
        <h3 className="w-full text-center text-3xl">Recent Blog Posts</h3>
        {blogs.length === 0 && (
          <p className="w-full text-center font-light">No blogs posts yet!</p>
        )}
        <div className="flex flex-row flex-wrap items-center justify-center gap-8 p-3">
          {blogs.length > 0 &&
            blogs.map((blog) => {
              return (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group/eventCard relative flex h-[200px] min-w-[300px] flex-col items-stretch justify-center gap-1 overflow-hidden rounded-2xl bg-[#f5f5f5] align-baseline text-2xl shadow-xl"
                >
                  <BlogImageHomePage
                    imgSrc={getFirstImageUrl(JSON.parse(blog.body)).url}
                  />
                  <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center bg-[#fffa] opacity-80 transition-all group-hover/eventCard:opacity-100 md:opacity-0">
                    <p className="w-full text-center">{blog.title}</p>
                    <p className="w-full text-center text-xs">
                      {dayjs(blog.createdTime).fromNow()}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-7 bg-[#fff] p-12 py-24 align-baseline">
        <h3 className="w-full text-center text-3xl">Upcoming Events</h3>
        {futureEvents.length === 0 && (
          <p className="w-full text-center font-light">
            No upcoming events! Stay peeled for more!
          </p>
        )}
        <div className="flex flex-row gap-8 p-3">
          {futureEvents.length > 0 &&
            futureEvents.map((event) => {
              return (
                <Link key={event.id} href={`/events`}>
                  <div
                    className="group/eventCard relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-[#f5f5f5] align-baseline text-2xl shadow-xl"
                    key={event.id}
                  >
                    <Image
                      src={
                        event.photo
                          ? getEventImageRoute(event.id, event.photo)
                          : "/logo.png" // TODO: is this an ok default image?
                      }
                      alt="Event picture"
                      className="rounded-xl object-cover"
                      height={Event_PHOTO_Y_PXL * 0.4}
                      width={Event_PHOTO_X_PXL * 0.4}
                    />
                    <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center bg-[#fffa] opacity-0 transition-all group-hover/eventCard:opacity-100">
                      <p className="w-full text-center">{event.title}</p>
                      <p className="w-full text-center text-xs">
                        {dayjs(event.startTime).fromNow()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
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
        {companies.length > 0 && (
          <>
            <h3 className="w-full text-2xl font-light">
              Proudly sponsored by:
            </h3>
            <div className="flex flex-row flex-wrap justify-center">
              {companies.map((company, index) => {
                if (!company.logo || !company.websiteUrl) return <></>;
                return (
                  <div
                    key={index}
                    className="flex max-w-[19rem] items-center justify-center p-10"
                  >
                    <Link href={company.websiteUrl}>
                      <Image
                        src={getCompanyImageRoute(company.id, company.logo)}
                        alt="Sponsor Logo"
                        className="object-contain"
                        width={500}
                        height={500}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
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

// function sponsorshipTypeToPos(type: SponsorshipType): number {
//   switch (type) {
//     case "major":
//       return 0;
//     case "partner":
//       return 1;
//     case "other":
//       return 2;
//     default:
//       return 3;
//   }
// }
