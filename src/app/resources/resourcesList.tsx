import Link from "next/link";

import { Divider } from "@nextui-org/divider";

import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";

import { LinkIcon } from "@heroicons/react/24/outline";

import { getResourceFileRoute } from "../utils/s3";
import ResourceActions from "./resourceActions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Resource = RouterOutputs["resources"]["getAll"][number];
type Tag = RouterOutputs["tags"]["resources"]["get"][number];

export default async function ResourcesList() {
  const resources = await api.resources.getAll.query();

  if (resources.length === 0) {
    return <p className="text-lg">No resources for now. Check back later!</p>;
  }

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
      className={`flex max-w-sm flex-col gap-3 rounded-xl border p-5 transition-all hover:shadow-md ${
        resource.public ? "opacity-100" : "opacity-60"
      }`}
    >
      <div>
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
      </div>
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
    <div className="flex flex-row flex-wrap gap-2 text-xs">
      {tags.map((tag) => (
        <p
          key={tag.id}
          style={{ backgroundColor: tag.colour }}
          className="rounded-xl border border-white p-1 px-2 text-white"
        >
          {tag.name}
        </p>
      ))}
    </div>
  );
}
