"use client";

import Image from "next/image";

import { useSession } from "next-auth/react";

import { RouterOutputs } from "@/trpc/shared";

import { MapPinIcon } from "@heroicons/react/24/outline";

import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL } from "../utils";
import { getEventImageRoute } from "../utils/s3";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Event = RouterOutputs["events"]["getAll"]["upcoming"][number];

export const DEFAULT_EVENT_IMAGE = "/logo.png";

export default function EventsCard({ event }: { event: Event }) {
  const session = useSession();

  return (
    <div className="flex max-w-lg flex-row justify-between gap-2 rounded-2xl border-2 border-[#eee] bg-[#fafafa] p-2">
      <div className="space-y-1 px-2 py-1">
        <p>{dayjs(event.startTime).format("HH:mm a")}</p>
        <h2 className="text-2xl font-semibold">{event.title}</h2>
        <div className="flex flex-row gap-1">
          <MapPinIcon height={24} /> <span>{event.location}</span>
        </div>
      </div>
      <div className="relative aspect-video h-full min-w-[200px]">
        <Image
          src={
            event.photo
              ? getEventImageRoute(event.id, event.photo)
              : DEFAULT_EVENT_IMAGE
          }
          alt="Event Cover Photo"
          className={`h-full rounded-xl ${
            session ? "absolute left-0 top-0 z-30 w-full" : ""
          } ${event.photo ? "object-cover" : "object-contain"}`}
          height={Event_PHOTO_Y_PXL * 0.4}
          width={Event_PHOTO_X_PXL}
        />
      </div>
    </div>
  );
}
