import Image from "next/image";
import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";

import { getEventImageRoute } from "@/app/utils/s3";

import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL } from "../utils";
import { EventsCard, PastEventCard } from "./eventCard";
import { DEFAULT_EVENT_IMAGE } from "./eventCard";

export default async function EventList() {
  const session = await getServerAuthSession();

  const { upcoming, past } = await api.events.getAll.query();

  return (
    <div className="flex flex-col gap-5">
      {upcoming.length === 0 && (
        <div className="flex h-full items-center justify-center p-10">
          <p className="text-center text-[#555]">
            No upcoming events! Stay peeled for more.
          </p>
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="flex flex-row flex-wrap justify-center gap-5">
          {upcoming.map((event) => (
            <EventsCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {past.length > 0 && (
        <>
          <h2 className="text-center text-2xl font-semibold lg:text-left">
            Past Events
          </h2>
          <div className="flex flex-row flex-wrap justify-center gap-5">
            {past.map((event) => (
              // <EventsCard key={event.id} event={event} />
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
