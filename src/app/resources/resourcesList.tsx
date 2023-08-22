"use client";

import { CSSProperties } from "react";
import ResourceActions from "./resourceActions";
import { Resource } from "../api/backend/resources";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";
import { AttachmentInfo } from "../api/backend/tags";
import TagsComponent from "../tags/tagComponent";
import { Card, CardBody, CardFooter, CardHeader, Divider, Link, Image, Button } from "@nextui-org/react";

dayjs.extend(relativeTime);

const RESOURCE_NON_PUBLIC_OPACITY = 0.6;
const MAX_DESCRIPTION_CHAR = 250;

export default function ResourcesList(props: { attachments: AttachmentInfo[], resources: Resource[] }) {
    const session = useSession();
    const router = useRouter();

    let resources = props.resources;

    if (session.status !== "authenticated") {
        // only show unpublished resources
        resources = resources.filter((r) => r.public);
    }

    return (
        <>
            {resources.map((resource) => (
                <ResourcesCard key={resource.id} attachments={props.attachments} resource={resource} />
            ))}
        </>
    );
}

function ResourcesCard(props: {attachments: AttachmentInfo[], resource: Resource}) {
    const createdDate = dayjs(Date.parse(props.resource.created_time)).fromNow();
    
    
    async function handleResourceClick() {
        if(props.resource.internal) {
            await endpoints.resources.getInternalResource(props.resource.id)
                .then((link) => window.open(link))
                .catch(() => toast.error("Failed to retrieve resource."))

        } else {
            if(props.resource.link) {
                window.open(props.resource.link);
            } else {
                toast.error("Failed to retrieve resource.");
            }
        }
    }
    return (
        <Card className="max-w-[400px]" style={{ opacity: props.resource.public ? 1: RESOURCE_NON_PUBLIC_OPACITY}}>
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-lg">{props.resource.title}</p>
                    <p className="text-small text-default-500">{createdDate}</p>
                </div>
            </CardHeader>
            <Divider/>
            <CardBody>
                <p className="text-medium">{props.resource.description.substring(0, MAX_DESCRIPTION_CHAR)}...</p>
            </CardBody>
            <Divider/>
            <CardFooter>
                <Link
                    isExternal
                    showAnchorIcon
                    onClick={handleResourceClick}
                    style={{cursor: "pointer"}}
                >
                    View resource
                </Link>
                <TagsComponent
                    allowEditing={false}
                    tags={
                        props.attachments.filter(a => a.bearer_id === props.resource.id).map(a => {
                            return {
                                id: a.tag_id,
                                name: a.name,
                                colour: a.colour,
                            }
                        })
                    }
                />
            </CardFooter>
            <ResourceActions resource={props.resource} />
      </Card>
    );
}
