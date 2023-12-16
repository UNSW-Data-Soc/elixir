import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";

import { isModerator } from "../utils";

import { EventsCard } from "./eventCard";

export default async function EventList() {
  const session = await getServerAuthSession();

  const events = await api.events.getAll.query();

  if (!isModerator(session) && events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <p className="text-center text-[#555]">No events yet!</p>
      </div>
    );
  }

  return (
    <>
      {events.map((event) => (
        <EventsCard key={event.id} event={event} />
      ))}
    </>
  );
}
