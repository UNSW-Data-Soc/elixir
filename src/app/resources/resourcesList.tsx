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

dayjs.extend(relativeTime);

const RESOURCE_NON_PUBLIC_OPACITY = 0.3;

export default function ResourcesList(props: { resources: Resource[] }) {
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
                <ResourcesCard key={resource.id} {...resource} />
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

function ResourcesCard(resource: Resource) {
    const createdDate = dayjs(Date.parse(resource.created_time)).fromNow();
    
    
    async function handleResourceClick() {
        if(resource.internal) {
            await endpoints.resources.getInternalResource(resource.id)
                .then((link) => window.open(link))
                .catch(() => toast.error("Failed to retrieve resource."))

        } else {
            if(resource.link) {
                window.open(resource.link);
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
                style={getResourceCardStyle(resource)}
            />
            <div
                style={{
                    opacity: resource.public ? 1 : RESOURCE_NON_PUBLIC_OPACITY,
                }}
            >
                <div className="flex flex-col gap-3 p-5 items-center">
                    <h3 className="text-xl font-bold">{resource.title}</h3>
                    <p className="">
                        <span className="italic">{resource.description}</span>
                        <span className="mx-3">|</span>
                        <span>{createdDate}</span>
                    </p>
                </div>
            </div>
            <ResourceActions resource={resource} />
        </div>
    );
}
