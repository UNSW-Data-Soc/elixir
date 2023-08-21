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

dayjs.extend(relativeTime);

const RESOURCE_NON_PUBLIC_OPACITY = 0.3;
const MAX_DESCRIPTION_CHAR = 75;

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

function getResourceCardStyle(resource: Resource): CSSProperties {
    let cssProps = {
        backgroundColor: "#abcdef",
        backgroundOrigin: "content-box",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: 1,
    };
    
    if (!resource.public) {
        cssProps.opacity = RESOURCE_NON_PUBLIC_OPACITY;
    }

    return cssProps;
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
        <div
            className="border-[1px] border-black flex flex-col items-center w-4/12"
            >
            <div
                className="w-full relative h-[200px] cursor-pointer"
                onClick={handleResourceClick}
                style={getResourceCardStyle(props.resource)}
            />
            <div
                style={{
                    opacity: props.resource.public ? 1 : RESOURCE_NON_PUBLIC_OPACITY,
                }}
            >
                <div className="flex flex-col gap-3 p-5 items-center">
                    <h3 className="text-xl font-bold">{props.resource.title}</h3>
                    <div className="flex flex-col items-center align-baseline justify-center">
                        <span className="italic mb-1">{props.resource.description.substring(0, MAX_DESCRIPTION_CHAR)}...</span>
                        <hr className="w-full mt-1"/>
                        <span>{createdDate}</span>
                    </div>
                </div>
            </div>
            <div>
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
            </div>
            <ResourceActions resource={props.resource} />
        </div>
    );
}
