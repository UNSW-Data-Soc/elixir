"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useState } from "react";
import { endpoints } from "../api/backend/endpoints";
import { UserPublic } from "../api/backend/users";
import { Event } from "../api/backend/events";
dayjs.extend(relativeTime);

export default function EventInformation(props: { event: Event }) {
    const session = useSession();
    const router = useRouter();

    const [author, setAuthor] = useState<UserPublic>();

    useEffect(() => {
        async function getDetails() {
            let user = await endpoints.users.get(props.event.creator);
            setAuthor(user);
        }

        getDetails();
    }, [props.event.creator]);

    if (session.status !== "authenticated" || !session.data.user.admin) {
        return <></>;
    }

    const lastEditTime = dayjs(Date.parse(props.event.last_edit_time));

    return (
        <>
            <div className="flex flex-col items-start align-baseline">
                <p>Created {author && <>by {author.name}</>}</p>
                <Tooltip content={lastEditTime.format("DD/MM/YYYY HH:mm")}>
                    <p>Last edited {lastEditTime.toNow(true)} ago</p>
                </Tooltip>
            </div>
        </>
    );
}
