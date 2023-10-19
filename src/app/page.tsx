import { endpoints } from "./api/backend/endpoints";
import { Image as NextUIImage } from "@nextui-org/react";
import Image from "next/image";
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
  Event_PHOTO_Y_PXL,
  Event_PHOTO_X_PXL,
} from "./utils";
import LinkButton from "./components/LinkButton";

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

const NUM_DISPLAY_EVENTS = 3;

export default async function Home() {
  const events = (await endpoints.events.getAll(false)).slice(
    0,
    NUM_DISPLAY_EVENTS,
  );
  const blogs = (await endpoints.blogs.getAll({ authRequired: false })).slice(
    0,
    NUM_DISPLAY_EVENTS,
  );
  const sponsors = await Promise.all(
    (await endpoints.sponsorships.getAll(false)).map(async (sponsorship) => {
      const company = await endpoints.companies.get(sponsorship.company);
      return {
        id: company.id,
        name: company.name,
        logo: endpoints.companies.getCompanyPhoto(company.id),
        link: company.website_url,
      };
    }),
  );

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
      <div className="flex flex-col items-center justify-center gap-7 bg-[#b6e2ff] p-12 py-24 align-baseline">
        <h3 className="w-full text-center text-3xl">Recent Blog Posts</h3>
        {blogs.length === 0 && (
          <p className="w-full text-center font-light">No blogs posts yet!</p>
        )}
        <div className="flex flex-row gap-8 p-3">
          {blogs.length > 0 &&
            blogs.map((blog) => {
              return (
                <div
                  className="flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-[#f5f5f5] align-baseline text-2xl shadow-xl"
                  key={blog.id}
                >
                  {/* <Image
                    src={endpoints.events.getEventPhoto(blog.id)}
                    alt="Profile picture"
                    className="rounded-xl object-cover"
                    height={Event_PHOTO_Y_PXL * 0.4}
                    width={Event_PHOTO_X_PXL * 0.4}
                  /> */}
                  <div className="flex h-full flex-col items-center justify-center bg-[#fffa] transition-all">
                    <p className="w-full text-center">{blog.title}</p>
                    <p className="w-full text-center">{blog.created_time}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-7 bg-[#fff] p-12 py-24 align-baseline">
        <h3 className="w-full text-center text-3xl">Upcoming Events</h3>
        {events.length === 0 && (
          <p className="w-full text-center font-light">
            No upcoming events! Stay peeled for more!
          </p>
        )}
        <div className="flex flex-row gap-8 p-3">
          {events.length > 0 &&
            events.map((event) => {
              return (
                <div
                  className="group/eventCard relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-[#f5f5f5] align-baseline text-2xl shadow-xl"
                  key={event.id}
                >
                  <Image
                    src={endpoints.events.getEventPhoto(event.id)}
                    alt="Profile picture"
                    className="rounded-xl object-cover"
                    height={Event_PHOTO_Y_PXL * 0.4}
                    width={Event_PHOTO_X_PXL * 0.4}
                  />
                  <div className="absolute z-10 flex h-full flex-col items-center justify-center bg-[#fffa] opacity-0 transition-all group-hover/eventCard:opacity-100">
                    <p className="w-full text-center">{event.title}</p>
                    <p className="w-full text-center">{event.start_date}</p>
                  </div>
                </div>
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
        <h3 className="w-full text-2xl font-light">Proudly sponsored by:</h3>
        <div className="flex flex-row flex-wrap justify-center">
          {sponsors.map((company, index) => (
            <div
              key={index}
              className="flex max-w-[19rem] items-center justify-center p-10"
            >
              <Link href={company.link}>
                <Image
                  src={company.logo}
                  alt="Sponsor Logo"
                  className="object-contain"
                  width={500}
                  height={500}
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
