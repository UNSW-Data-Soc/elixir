"use client";

import { useState } from "react";
import { endpoints } from "../api/backend/endpoints";
import { Resource } from "../api/backend/resources";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ModifyBearerTags from "../modifyBearerTags";
import { AttachmentInfo } from "../api/backend/tags";
import { Button } from "@nextui-org/react";


export default function ResourceActions(props: {resource: Resource}) {
    const [showVisibilityDialogue, setShowVisibilityDialogue] = useState(false);
    const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);
    const [showModifyTagsDialogue, setShowModifyTagsDialogue] = useState(false);
    
    const session = useSession();
    const router = useRouter();

    if (session.status !== "authenticated" || !session.data.user.admin) {
        return <></>;
    }
    
    async function handleResourceDeletion() {
        await endpoints.resources.remove(props.resource.id)
            .then(() => {
                toast.success("Resource deleted successfully!");
            })
            .catch(() => {
                toast.error("Failed to delete resource");
            })
            .finally(() => {
                setShowDeletionDialogue(false);
                router.refresh();
                return;
            });
    }

    async function handleResourcePublication() {
        let actionPubUnpub = props.resource.public ? "unpublished" : "published";
        let actionPubUnpubPresent = props.resource.public ? "unpublish" : "publish";

        await endpoints.resources.updateVisibility(props.resource.id, !props.resource.public)
            .then(() => {
                toast.success(`Resource ${actionPubUnpub} successfully!`);
            })
            .catch(() => {
                toast.error(`Failed to ${actionPubUnpubPresent} resource`);
            })
            .finally(() => {
                setShowVisibilityDialogue(false);
                router.refresh();
                return;
            });
    }

    return(
        <>
            {
                showDeletionDialogue &&
                <ConfirmationDialogue
                    heading="Are you sure?"
                    subHeading="This action is permanent and irreversible!"
                    resource={props.resource}
                    confirmation={handleResourceDeletion}
                    hideDialogue={() => {setShowDeletionDialogue(false)}}
                />
            }

            {
                showVisibilityDialogue &&
                <ConfirmationDialogue
                    heading="Are you sure?"
                    subHeading={props.resource.public ? "This will remove the resource from public view" : "This will make the resource publicly available"}
                    resource={props.resource}
                    confirmation={handleResourcePublication}
                    hideDialogue={() => {setShowVisibilityDialogue(false)}}
                />
            }
            {
                showModifyTagsDialogue &&
                <>
                    <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="flex flex-col justify-center align-baseline items-center bg-white p-10">
                        <p className="text-2xl font-semibold">Edit tags</p>
                        <div className="p-20 flex flex-col justify-center align-baseline items-center bg-white gap-5">
                            <div className="w-full m-5">
                                <ModifyBearerTags
                                    bearer="resource"
                                    bearer_id={props.resource.id}
                                    initialOptionsFilter={ai => ai.bearer_id === props.resource.id}
                                />
                            </div>
                            <div>
                                <button
                                    className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                                    onClick={() => setShowModifyTagsDialogue(false)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </>
            }

            <div
                className="flex gap-5 m-3 items-center justify-between align-baseline"
            >
                {
                    props.resource.public ?
                    <Button
                        color="secondary"
                        radius="full"
                        onClick={() => {setShowVisibilityDialogue(true)}}
                    >
                        Unpublish
                    </Button> :
                    <Button
                        color="secondary"
                        radius="full"
                        onClick={() => {setShowVisibilityDialogue(true)}}
                    >
                        Publish
                    </Button>
                }
                <Button
                    color="danger"
                    radius="full"
                    onClick={() => {setShowDeletionDialogue(true)}}>
                    Delete
                </Button>
                <Button
                    color="warning"
                    radius="full"
                    onClick={() => {setShowModifyTagsDialogue(true)}}>
                    Edit Tags
                </Button>
            </div>
        </>
    );
}


function ConfirmationDialogue(props: {
    heading: string,
    subHeading: string,
    resource: Resource,
    confirmation: () => void
    hideDialogue: () => void
}) {
    return (
        <>
            <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="flex flex-col justify-center align-baseline items-center bg-white p-10">
                        <p className="text-[black] text-xl">{props.heading}</p>
                        <p className="text-[red] italic">{props.subHeading}</p>
                        <div>
                            <button
                                className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                                onClick={props.confirmation}
                            >
                                Confirm
                            </button>
                            <button
                                className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                                onClick={props.hideDialogue}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
            </div>
        </>
    );
}