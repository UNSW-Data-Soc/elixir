import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { Tooltip } from "@nextui-org/tooltip";

import { RouterOutputs } from "@/trpc/shared";

import { isModerator } from "../utils";
import { getServerAuthSession } from "@/server/auth";

export default async function EventInformation(props: {
  event: RouterOutputs["events"]["getAll"][number];
}) {
  const session = await getServerAuthSession();

  const author = { name: "Prayag" }; // TODO: api.users.getById.query({id: props.event.creator});

  if (!isModerator(session)) {
    return <></>;
  }

  const lastEditTime = dayjs(props.event.lastEditTime);

  return (
    <>
      <div className="flex w-full flex-row items-start justify-between align-baseline">
        {!!author && <p>Created {<>by {author.name}</>}</p>}
        <Tooltip content={lastEditTime.format("DD/MM/YYYY HH:mm")}>
          <p>Last edited {lastEditTime.toNow(true)} ago</p>
        </Tooltip>
      </div>
    </>
  );
}
