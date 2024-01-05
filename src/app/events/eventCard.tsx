import Image from "next/image";

import { CSSProperties } from "react";

import { Card, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { getServerAuthSession } from "@/server/auth";

import { RouterOutputs } from "@/trpc/shared";

import { getEventImageRoute } from "@/app/utils/s3";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { generateHTML } from "@tiptap/html";

import { TIPTAP_EXTENSIONS } from "../blogs/tiptapExtensions";
import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL, isModerator } from "../utils";
import EventActionsModal from "./eventActions";
import EventCardActions from "./eventCardActions";
import { EventDescription } from "./eventDescription";
import EventInformation from "./eventInformation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const DEFAULT_EVENT_IMAGE = "/logo.png";

type Event = RouterOutputs["events"]["getAll"]["upcoming"][number];

function getEventCardStyle(event: Event): CSSProperties {
  return event.public // && inFuture // TODO: should we have this????
    ? {}
    : {
        opacity: 0.5,
      };
}

export async function EventsCard(props: { event: Event }) {
  const session = await getServerAuthSession();

  const startTime = dayjs(props.event.startTime);
  const endTime = dayjs(props.event.endTime);
  const inFuture = endTime.isAfter(Date.now());

  return (
    <>
      <EventDescription event={props.event}>
        {{
          trigger: (
            <Card
              className={`flex aspect-[16/9] min-w-[20rem] max-w-[400px] cursor-pointer flex-col items-center justify-center gap-2 duration-200 ease-in-out transition-all hover:scale-[.985] active:scale-95 ${
                session ? "relative" : ""
              }`}
              style={getEventCardStyle(props.event)}
            >
              <Image
                src={
                  props.event.photo
                    ? getEventImageRoute(props.event.id, props.event.photo)
                    : DEFAULT_EVENT_IMAGE
                }
                alt="Event Cover Photo"
                className={`h-full rounded-b-none rounded-t-xl object-cover ${
                  session ? "absolute left-0 top-0 z-30 w-full" : ""
                }`}
                height={Event_PHOTO_Y_PXL * 0.4}
                width={Event_PHOTO_X_PXL}
              />
              {!!session && (
                <CardFooter className="z-50 flex h-full w-full flex-col items-center justify-around gap-2 rounded-none bg-[#fffa] px-7 py-5 pb-6 align-baseline">
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full flex-col justify-start">
                      <div className="flex w-full flex-row justify-between">
                        <p className="text-lg font-bold">{props.event.title}</p>
                        <Link
                          isExternal
                          showAnchorIcon
                          href={props.event.link}
                          className="cursor-pointer"
                        >
                          View Event
                        </Link>
                      </div>
                      <p className="w-full text-left italic">
                        {inFuture
                          ? `Starts ${startTime.fromNow()}`
                          : `Ended ${endTime.toNow(true)} ago`}
                      </p>
                    </div>
                    {isModerator(session) && (
                      <div className="flex items-center justify-center px-3 align-baseline">
                        <EventActionsModal event={props.event} />
                        <EventCardActions event={props.event} />
                      </div>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          ),
          header: (
            <div className="pb-2 pt-3">
              <h3 className="text-2xl text-default-500">
                <Link
                  isExternal
                  showAnchorIcon
                  href={props.event.link}
                  className="cursor-pointer text-4xl"
                >
                  {props.event.title}
                </Link>
              </h3>
              <small className="text-default-500">
                {/* Only displays if user is admin */}
                <EventInformation event={props.event} />
              </small>
            </div>
          ),
          body: (
            <div className="flex flex-col gap-5 pb-5">
              <div className="flex flex-row justify-start gap-8">
                <p className="flex flex-row gap-1 text-xl">
                  <MapPinIcon height={28} /> <span>{props.event.location}</span>
                </p>
                <p className="flex flex-row gap-1 text-xl">
                  <ClockIcon height={28} />{" "}
                  <span>
                    {/* format the event datetime */}
                    {startTime.isSame(endTime)
                      ? `${startTime.format("DD MMM")}`
                      : startTime.isSame(endTime, "day")
                      ? `${startTime.format("hh:mm")} — ${endTime.format(
                          "hh:mm",
                        )}, ${startTime.format("DD MMM YYYY")}`
                      : `${startTime.format("DD MMM hh:mm")} — ${endTime.format(
                          "DD MMM hh:mm",
                        )}`}
                  </span>
                </p>
              </div>
              <Divider />
              <ScrollShadow>
                <p
                  dangerouslySetInnerHTML={{
                    __html: generateHTML(
                      JSON.parse(props.event.description),
                      TIPTAP_EXTENSIONS,
                    ),
                  }}
                ></p>
              </ScrollShadow>
            </div>
          ),
        }}
      </EventDescription>
    </>
  );
}
