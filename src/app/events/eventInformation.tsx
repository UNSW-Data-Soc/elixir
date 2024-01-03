import { Tooltip } from "@nextui-org/tooltip";

import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";

import { isModerator } from "../utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Event = RouterOutputs["events"]["getAll"]["upcoming"][number];

export default async function EventInformation(props: { event: Event }) {
  const session = await getServerAuthSession();

  if (!isModerator(session)) {
    return <></>;
  }

  const author =
    (props.event.creator
      ? (await api.users.getInfo.query({ id: props.event.creator })).name
      : "unknown") ?? "unknown";

  const lastEditTime = dayjs(props.event.lastEditTime);

  return (
    <>
      <div className="flex w-full flex-row items-start justify-between align-baseline">
        {!!author && <p>Created {<>by {author}</>}</p>}
        <Tooltip content={lastEditTime.format("DD/MM/YYYY HH:mm")}>
          <p>Last edited {lastEditTime.toNow(true)} ago</p>
        </Tooltip>
      </div>
    </>
  );
}
