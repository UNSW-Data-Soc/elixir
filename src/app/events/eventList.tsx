import { api } from "@/trpc/server";

import { EventsCard } from "./eventCard";

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
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {upcoming.map((event) => (
          <EventsCard key={event.id} event={event} />
        ))}
      </div>
      <h2 className="text-2xl font-semibold">Past Events</h2>
      <div className="flex flex-row flex-wrap justify-center gap-5">
        {past.map((event) => (
          <EventsCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
