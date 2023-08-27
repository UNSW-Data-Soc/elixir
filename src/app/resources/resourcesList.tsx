"use client";

import { CSSProperties, useEffect, useState } from "react";
import ResourceActions from "./resourceActions";
import { Resource } from "../api/backend/resources";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";
import { AttachmentInfo, TagReferences } from "../api/backend/tags";
import { Card, CardBody, CardFooter, CardHeader, Divider, Link, Image, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import TagReferencesList from "../tags/references/tagReferencesList";

dayjs.extend(relativeTime);

const RESOURCE_NON_PUBLIC_OPACITY = 0.6;
const MAX_DESCRIPTION_CHAR = 250;

export default function ResourcesList() {
    const session = useSession();
    const router = useRouter();
    const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [tagReferences, setTagReferences] = useState<TagReferences[]>([]);

    useEffect(() => {
        async function getData() {
            let references_all: TagReferences[] = [];
            let resources_all: Resource[] = [];
            let attachments_all: AttachmentInfo[] = [];

            if (session.status !== "authenticated") {
                [resources_all, references_all, attachments_all] = await Promise.all([
                    endpoints.resources.getAll(false),
                    endpoints.tags.references(false),
                    endpoints.tags.attachments('resource', false),
                ]
                );
            } else {
                [resources_all, references_all, attachments_all] = await Promise.all([
                    endpoints.resources.getAll(true),
                    endpoints.tags.references(true),
                    endpoints.tags.attachments('resource', true),
                ]
                );
            }
            
            if(!references_all) {
                toast.error("Failed to load tag references");
                return;
            }
            setResources(resources_all);
            setTagReferences(references_all);
            setAttachments(attachments_all);
        }

        getData();
    }, [session.status]);

    async function updateResource(updatedResource: Resource, remove: boolean) {
        let updatedResources: Resource[] = [];
        if(remove) {
            updatedResources = resources.filter(r => r.id !== updatedResource.id);
        } else {
            for(let r of resources) {
                if(r.id === updatedResource.id) {
                    updatedResources.push(updatedResource);
                    continue;
                }

                updatedResources.push(r);
            }
        }

        setResources(updatedResources);
    }

    async function updateAttachments(updatedAttachments: AttachmentInfo[]) {
        setAttachments(updatedAttachments);

        // doesn't modify actual references, only *removes* from reference list
        let updatedTagReferences: TagReferences[] = [];
        for(let t of tagReferences) {
            for(let a of updatedAttachments) {
                if(t.tags_id === a.tag_id) {
                    updatedTagReferences.push(t);
                    break;
                }
            }
        }
        
        // doesn't modify actual references, only *adds* to reference list
        for(let a of updatedAttachments) {
            let found = false;
            for(let t of updatedTagReferences) {
                if(t.tags_id === a.tag_id) {
                    found = true;
                }
            }
            
            if(!found) {
                updatedTagReferences.push({
                    tags_id: a.tag_id,
                    tags_name: a.name,
                    tags_colour: a.colour,
                    portfolio: [],
                    blog: [],
                    event: [],
                    resource: [[a.bearer_id, resources.find(r => r.id === a.bearer_id)?.title || ""]],
                    job: []
                })
            }
        }

        setTagReferences(updatedTagReferences);
    }

    return (
        <>
            {resources.map((resource) => (
                <ResourcesCard
                    key={resource.id}
                    attachments={attachments}
                    resource={resource}
                    updateResource={updateResource}
                    updateAttachments={updateAttachments}
                    tagReferences={tagReferences}
                />
            ))}
        </>
    );
}

function ResourcesCard(props: {
    attachments: AttachmentInfo[],
    resource: Resource,
    tagReferences: TagReferences[],
    updateResource: (updatedResources: Resource, remove: boolean) => void,
    updateAttachments?: (updatedAttachments: AttachmentInfo[]) => void,
}) {
    const [showResourceDescription, setShowResourceDescription] = useState(false);

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
        <>
            <Card
                className="max-w-[400px]"
                style={{ opacity: props.resource.public ? 1: RESOURCE_NON_PUBLIC_OPACITY}}
                // isPressable
                >
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg">{props.resource.title}</p>
                        <p className="text-small text-default-500">{createdDate}</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody onClick={() => setShowResourceDescription(true)}>
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
                    <TagReferencesList
                        styleLarge={false}
                        showEditingTools={false}
                        // pass in to prevent multiple fetch calls
                        tagReferences={
                            // only show tags related to this particular resource
                            props.tagReferences.filter(r => {
                                for(let i of r.resource) {
                                    if(i[0] === props.resource.id) {
                                        return true;
                                    }
                                }
                                return false;
                            })
                        }
                    />
                </CardFooter>
                <ResourceActions
                    resource={props.resource}
                    updateResource={props.updateResource}
                    updateAttachments={props.updateAttachments}
                />
                {showResourceDescription && <ResourceDescription resource={props.resource} onOpenChange={() => setShowResourceDescription(false)}/>}
            </Card>
        
        </>
    );
}

function ResourceDescription(props: {resource: Resource, onOpenChange: () => void}) {
    const createdDate = dayjs(Date.parse(props.resource.created_time)).fromNow();
    
    return (
        <Modal isOpen={true} onOpenChange={props.onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">
                    {props.resource.title}
                    <small className="text-default-500">{createdDate}</small>
                </ModalHeader>
                <ModalBody>
                    <p> 
                    {props.resource.description}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    );
}
