import Image from "next/image";

import { useSession } from "next-auth/react";

import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";

import { PastEventCard } from "./eventCard";
import EventCard from "./eventCard2";

type Event = RouterOutputs["events"]["getAll"]["upcoming"][number];

export default async function EventList() {
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
        <div className="flex flex-col flex-wrap justify-center gap-5">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
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
