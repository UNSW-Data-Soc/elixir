"use client";

import { CSSProperties, useEffect, useState } from "react";

import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";
import {
    Image,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip,
    ScrollShadow,
} from "@nextui-org/react";

import { Event } from "../api/backend/events";
import EventActions from "./eventActions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import EventInformation from "./eventInformation";
import { useSession } from "next-auth/react";
import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL } from "../utils";

dayjs.extend(relativeTime);

export default function EventList() {
    const session = useSession();

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function getEvents() {
            let eventsAll = [];

            if (session.status !== "authenticated") {
                eventsAll = await endpoints.events.getAll(false);
            } else {
                eventsAll = await endpoints.events.getAll(true);
            }

            if (!eventsAll) {
                toast.error("Failed to retrieve events");
                return;
            }

            eventsAll.sort((a, b) => {
                let AStartTime = Date.parse(a.start_date);
                let BStartTime = Date.parse(b.start_date);
                let currentTime = Date.now();

                if (AStartTime < currentTime && BStartTime < currentTime) {
                    // Both events have already occurred, sort them based on their start times in descending order
                    return BStartTime - AStartTime;
                } else if (AStartTime < currentTime) {
                    // Event A has already occurred, so it should appear later
                    return 1;
                } else if (BStartTime < currentTime) {
                    // Event B has already occurred, so it should appear later
                    return -1;
                } else {
                    // Neither event has occurred yet, sort them based on their start times in ascending order
                    return AStartTime - BStartTime;
                }
            });

            setEvents(eventsAll);
        }

        getEvents();
    }, [session.status]);

    async function handleDeletion(id: string) {
        let updatedEvents: Event[] = [];
        for (let c of events) {
            if (c.id === id) {
                continue;
            }

            updatedEvents.push(c);
        }

        setEvents(updatedEvents);
    }

    if (session.status === "unauthenticated" && events.length === 0) {
        return (
            <div className="h-full flex justify-center items-center p-10">
                <p className="text-center text-[#555]">No events yet!</p>
            </div>
        );
    }

    return (
        <>
            {events.map((event) => (
                <EventsCard
                    key={event.id}
                    event={event}
                    handleDeletion={handleDeletion}
                />
            ))}
        </>
    );
}

function EventsCard(props: {
    event: Event;
    handleDeletion: (id: string) => void;
}) {
    const [showEventDescription, setShowEventDescription] = useState(false);

    const startTime = dayjs(Date.parse(props.event.start_date));
    const endTime = dayjs(Date.parse(props.event.end_date));
    const expirationPassed = endTime.isAfter(Date.now());

    function getEventCardStyle(e: Event): CSSProperties {
        const expirationPassed = dayjs(Date.parse(e.end_date)).isAfter(
            Date.now()
        );

        return expirationPassed
            ? {}
            : {
                  opacity: 0.5,
              };
    }

    return (
        <>
            <Card
                className="max-w-[400px]"
                style={getEventCardStyle(props.event)}
            >
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg font-bold">{props.event.title}</p>
                        <Link
                            isExternal
                            showAnchorIcon
                            href={props.event.link}
                            style={{ cursor: "pointer" }}
                        >
                            View Event
                        </Link>
                        <Tooltip
                            content={
                                expirationPassed
                                    ? startTime.format("DD/MM/YYYY HH:mm")
                                    : endTime.format("DD/MM/YYYY HH:mm")
                            }
                        >
                            <p className="italic">
                                {expirationPassed
                                    ? `Starts ${startTime.fromNow()}`
                                    : `Ended ${endTime.toNow(true)} ago`}
                            </p>
                        </Tooltip>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody
                    onClick={() => setShowEventDescription(true)}
                    className="cursor-pointer"
                >
                    <Image
                        src={endpoints.events.getEventPhoto(props.event.id)}
                        alt="Profile picture"
                        className="object-cover rounded-xl"
                        height={Event_PHOTO_Y_PXL * 0.4}
                        width={Event_PHOTO_X_PXL * 0.4}
                    />
                </CardBody>
                <CardFooter className="flex items-center justify-center align-baseline">
                    <EventActions
                        handleDeletion={props.handleDeletion}
                        event={props.event}
                    />
                </CardFooter>
            </Card>
            {showEventDescription && (
                <EventDescriptionModal
                    event={props.event}
                    onOpenChange={() => setShowEventDescription(false)}
                />
            )}
        </>
    );
}

function EventDescriptionModal(props: {
    event: Event;
    onOpenChange: () => void;
}) {
    const startDate = dayjs(Date.parse(props.event.start_date));
    const endDate = dayjs(Date.parse(props.event.end_date));

    return (
        <Modal isOpen={true} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <small className="text-default-500">
                                <Link
                                    isExternal
                                    showAnchorIcon
                                    href={props.event.link}
                                    style={{ cursor: "pointer" }}
                                >
                                    {props.event.title}
                                </Link>
                            </small>
                            <small className="text-default-500">
                                {/* Only displays if user is admin */}
                                <EventInformation event={props.event} />
                            </small>
                        </ModalHeader>
                        <ModalBody>
                            <p className="font-bold">Description</p>
                            <ScrollShadow className="h-[200px]">
                                <p>{props.event.description}</p>
                            </ScrollShadow>
                            <Divider />

                            <p className="font-bold">Location</p>
                            <p>{props.event.location}</p>

                            <Divider />

                            <p className="font-bold">Timing</p>
                            <Tooltip
                                content={`${startDate.format(
                                    "DD/MM/YYYY HH:mm"
                                )} - ${endDate.format("DD/MM/YYYY HH:mm")}`}
                            >
                                <p>
                                    {startDate.format("DD MMM h:mm A")} -{" "}
                                    {endDate.format("DD MMM h:mm A")}
                                </p>
                            </Tooltip>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}