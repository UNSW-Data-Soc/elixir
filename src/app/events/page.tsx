import { endpoints } from "../api/backend/endpoints";
import { type Event } from "../api/backend/events";

import EventsAddCard from "./eventsAddCard";

import { remark } from "remark";
import strip from "strip-markdown";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Events() {
  return (
    <main className="bg-white ">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Events</h1>
        <p>
          From social events to workshops to networking opportunities, stay updated to make sure you don’t miss out!
        </p>
      </header>
      <EventsContainer />
      <p>TODO: Dialog for <b>tags</b> go here!</p>
    </main>
  );
}

async function EventsContainer() {
  const events = await endpoints.events.getAll();
  console.log("Events: " + events);

  return (
    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
      <EventsAddCard />
      {events?.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
}

async function EventCard(event: Event) {
  const startDate = dayjs(Date.parse(event.start_date)).fromNow();

  const strippedBody = String(await remark().use(strip).process(event.description));

  return (
    <div className="border-[1px] border-black flex flex-col items-center w-4/12">
      <div
        className="w-full relative h-[200px]"
        style={{
          backgroundImage: "url(/https://instagram.fcbr1-1.fna.fbcdn.net/v/t51.2885-19/101069689_1093661394367192_909996565207187456_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fcbr1-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=4-hMnODjQFAAX_DlRgT&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfDWZB9EjEe-5zaOWq_Oz86ECUREIC9rlKV5el46Sh9ceg&oe=64A261F4&_nc_sid=8b3546)",
          backgroundOrigin: "content-box",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex flex-col gap-3 p-5 items-center">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p className="">
          <span className="italic">{event.location}</span>
          <span className="mx-3">|</span>
          <span>{startDate}</span>
        </p>
        <p className="text-[#555]">{strippedBody.substring(0, 200)}...</p>
      </div>
    </div>
  );
}