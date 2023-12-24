import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";
import { Divider } from "@nextui-org/divider";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import ResourceActions from "./resourceActions";
import { getServerAuthSession } from "@/server/auth";
import { getResourceFileRoute } from "../utils/s3";
import { LinkIcon } from "@heroicons/react/24/outline";

dayjs.extend(relativeTime);

type Resource = RouterOutputs["resources"]["getAll"][number];
type Tag = RouterOutputs["tags"]["resources"]["get"][number];

export default async function ResourcesList() {
  const resources = await api.resources.getAll.query();

  return (
    <div>
      {resources.map((resource) => (
        <ResourceCard resource={resource} key={resource.id} />
      ))}
    </div>
  );
}

async function ResourceCard({ resource }: { resource: Resource }) {
  const session = await getServerAuthSession();

  const tags = await api.tags.resources.get.query({ id: resource.id });

  const time = dayjs(resource.createdTime).fromNow();

  const resourceLink = resource.internal
    ? getResourceFileRoute(resource.id, resource.link)
    : resource.link;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl p-5 shadow-xl ${
        resource.public ? "opacity-100" : "opacity-60"
      }`}
    >
      <div className="flex flex-row items-center gap-3">
        <h3 className="text-lg font-semibold">{resource.title}</h3>
        <a
          href={resourceLink}
          className="rounded-md p-1 transition-all hover:text-[#83aaff]"
        >
          <LinkIcon height={20} />
        </a>
      </div>
      <small>{time}</small>
      <Divider />
      <p>{resource.description}</p>
      {tags.length > 0 && (
        <>
          <Divider />
          <ResourceTags tags={tags} />
        </>
      )}
      {!!session && <ResourceActions resource={resource} tags={tags} />}
    </div>
  );
}

async function ResourceTags({ tags }: { tags: Tag[] }) {
  return (
    <div>
      {tags.map((tag) => (
        <p key={tag.id} style={{ backgroundColor: tag.colour }}>
          {tag.name}
        </p>
      ))}
    </div>
  );
}
