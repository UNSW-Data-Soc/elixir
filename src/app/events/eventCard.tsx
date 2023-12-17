import { CSSProperties } from "react";

import { Image } from "@nextui-org/image";
import { Card, CardFooter } from "@nextui-org/card";
import { Link } from "@nextui-org/link";

import EventActionsModal from "./eventActions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL, isModerator } from "../utils";
import EventCardActions from "./eventCardActions";
import { getServerAuthSession } from "@/server/auth";
import { RouterOutputs } from "@/trpc/shared";

import { EventDescription } from "./eventDescription";
import EventInformation from "./eventInformation";

import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Tooltip } from "@nextui-org/tooltip";

import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "../blogs/tiptapExtensions";
import {
  ArrowLeftOnRectangleIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { env } from "@/env";

function getEventCardStyle(
  event: RouterOutputs["events"]["getAll"][number],
): CSSProperties {
  return event.public // && inFuture // TODO: should we have this????
    ? {}
    : {
        opacity: 0.5,
      };
}

export async function EventsCard(props: {
  event: RouterOutputs["events"]["getAll"][number];
}) {
  const session = await getServerAuthSession();

  const startTime = dayjs(props.event.startTime);
  const endTime = dayjs(props.event.endTime);
  const inFuture = endTime.isAfter(Date.now());

  let url: string | undefined;
  if (props.event.photo) {
    const res = await fetch(
      `${env.NEXTAUTH_URL}/api/download?key=events/${props.event.id}/${props.event.photo}`,
    );
    url = (await res.json()).url as string;
  }

  return (
    <>
      <EventDescription event={props.event}>
        {{
          trigger: (
            <Card
              className="flex aspect-video max-w-[400px] cursor-pointer flex-col items-center justify-center gap-2 duration-200 ease-in-out transition-all hover:scale-95 active:scale-90"
              style={getEventCardStyle(props.event)}
            >
              <Image
                src={
                  props.event.photo
                    ? // ? `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION_NAME}.amazonaws.com/events/${props.event.id}/${props.event.photo}`
                      url
                    : "./logo.png" /*endpoints.events.getEventPhoto(props.event.id)*/
                } // TODO: get event photo
                alt="Profile picture"
                className="h-full rounded-b-none rounded-t-xl object-cover"
                height={Event_PHOTO_Y_PXL * 0.4}
                width={Event_PHOTO_X_PXL}
              />
              {!!session && (
                <CardFooter className="flex w-full flex-col items-center justify-between gap-2 px-7 py-5 pb-6 align-baseline">
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
