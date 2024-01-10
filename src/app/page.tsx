import Image from "next/image";
import Link from "next/link";

import { api } from "@/trpc/server";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { getFirstImageUrl } from "./blogs/utils";
import BlogImageHomePage from "./components/blogImageHomePage";
import {
  COMPANY_PHOTO_X_PXL,
  COMPANY_PHOTO_Y_PXL,
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

const NUM_DISPLAY_EVENTS = 3;
const NUM_DISPLAY_BLOGS = 3;

export default async function Home() {
  const [futureEvents, blogs, sponsors, coverPhoto] = await Promise.all([
    api.events.getUpcoming.query({ limit: NUM_DISPLAY_EVENTS }),
    api.blogs.getRecent.query({ limit: NUM_DISPLAY_BLOGS }),
    api.sponsorships.getAll.query({ publicOnly: true }),
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
      <main className="bg-light-rainbow relative left-0 top-0 z-0 mt-[-4rem] min-h-screen w-full select-none mix-blend-multiply">
        <div className="mix-blend-multiply">
          {!!coverPhoto.id && (
            <Image
              src={getCoverPhotoRoute(coverPhoto.id)}
              alt="Cover Photo"
              fill
              sizes="100vw"
              priority
              quality={100}
              className="coverPhoto object-cover mix-blend-multiply"
              draggable={false}
            />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-5 px-8 pt-48 align-baseline text-white brightness-200 sm:items-start sm:pl-20 md:pt-48 lg:pl-36 xl:pl-36 2xl:pl-56 2xl:pt-56">
          <div className="flex flex-col gap-3">
            <div className="text-center text-3xl sm:text-left">
              Welcome to the
            </div>
            <div className="text-center text-6xl font-bold sm:text-left sm:text-7xl lg:text-8xl">
              Data Science Society
            </div>
            <div className="pt-2 text-center text-3xl sm:text-left">@ UNSW</div>
          </div>
        </div>
        <a
          href="#main"
          className="absolute bottom-0 left-[50%] flex translate-x-[-50%] items-center justify-center p-5"
        >
          <ChevronDownIcon height={50} color="white" />
        </a>
      </main>
      <div
        className="flex items-center justify-center p-12 py-16 align-baseline"
        id="main"
      >
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
        <h3 className="w-full text-center text-3xl">Upcoming Events</h3>
        {futureEvents.length === 0 && (
          <p className="w-full text-center text-xl font-light">
            No upcoming events! Stay peeled for more!
          </p>
        )}
        {futureEvents.length > 0 && (
          <div className="flex flex-row gap-8 p-3">
            {futureEvents.map((event) => (
              <Link key={event.id} href={event.link ?? `/events`}>
                <div
                  className="group/eventCard relative flex aspect-[16/9] flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-[#f5f5f5] align-baseline text-2xl shadow-xl"
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
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-7 bg-[#fff] p-12 py-24 align-baseline">
        <h3 className="w-full text-center text-3xl">Recent Blog Posts</h3>
        {blogs.length === 0 && (
          <p className="w-full text-center font-light">No blogs posts yet!</p>
        )}
        {blogs.length > 0 && (
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 p-3">
            <Link
              href={`/blogs/${blogs[0].slug}`}
              className="relative flex aspect-[8/7] flex-col items-stretch justify-center gap-1 overflow-hidden bg-transparent align-baseline sm:h-[500px]"
            >
              <BlogImageHomePage
                imgSrc={getFirstImageUrl(JSON.parse(blogs[0].body)).url}
              />
              <div className="absolute bottom-0 left-0 top-0 z-10 flex w-full flex-col justify-end gap-1 bg-gradient-to-t from-slate-800 p-5 text-white transition-all sm:gap-2">
                <p className="w-full text-2xl font-semibold tracking-wide sm:text-3xl">
                  {blogs[0].title}
                </p>
                <p className="w-full text-lg">
                  {dayjs(blogs[0].createdTime).fromNow()}
                </p>
              </div>
            </Link>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:flex-nowrap">
              {blogs.slice(1).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="relative flex aspect-[8/7] flex-col items-stretch gap-1 bg-transparent align-baseline sm:aspect-[9/16] sm:h-[500px]"
                >
                  <div className="h-full sm:aspect-[4/5] sm:h-auto sm:flex-shrink-0 sm:flex-grow-0">
                    <BlogImageHomePage
                      imgSrc={getFirstImageUrl(JSON.parse(blog.body)).url}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 top-0 z-10 flex w-full flex-col justify-end gap-1 bg-gradient-to-t from-slate-800 p-5 text-white sm:static sm:h-full sm:justify-start sm:bg-white sm:from-transparent sm:p-0 sm:py-1 sm:text-black">
                    <p className="w-full whitespace-pre-wrap text-2xl font-semibold">
                      {blog.title}
                    </p>
                    <p className="w-full text-base">
                      {dayjs(blog.createdTime).fromNow()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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
          Or get in touch with us{" "}
          <Link className="underline" href={"/contact"}>
            here
          </Link>
          .
        </p>
      </div>
      {companies.length > 0 && (
        <div className="container mx-auto flex flex-col items-center justify-center bg-[#fff] p-12 align-baseline">
          <h3 className="w-full text-2xl font-light">Proudly sponsored by:</h3>
          <div className="flex flex-row flex-wrap justify-center">
            {companies.map((company, index) => {
              if (!company.logo) return <></>;
              return (
                <div
                  key={index}
                  className="flex max-w-[19rem] items-center justify-center p-10"
                >
                  <Link href={company.websiteUrl ?? "/"}>
                    <Image
                      src={getCompanyImageRoute(company.id, company.logo)}
                      alt="Sponsor Logo"
                      className="object-contain"
                      width={COMPANY_PHOTO_X_PXL}
                      height={COMPANY_PHOTO_Y_PXL}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
