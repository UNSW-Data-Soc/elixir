"use client";

import { Button } from "@nextui-org/button";
import { Event } from "../api/backend/events";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/modal";
import { endpoints } from "../api/backend/endpoints";
import toast from "react-hot-toast";

export default function EventActionsModal(props: {
    event: Event;
    handleDeletion: (id: string) => void;
    handleEventUpdate: (updatedBlog: Event) => void;
}) {
    const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);
    const [showVisibilityDialogue, setShowVisibilityDialogue] = useState(false);
    const session = useSession();
    const router = useRouter();

    if (session.status !== "authenticated" || !session.data.user.admin) {
        return <></>;
    }

    async function handleEventDeletion() {
        await endpoints.events
            .remove(props.event.id)
            .then(() => {
                toast.success("Event deleted successfully!");
                props.handleDeletion(props.event.id);
            })
            .catch(() => {
                toast.error("Failed to delete event");
            })
            .finally(() => {
                setShowDeletionDialogue(false);
                return;
            });
    }

    async function handleEventPublication() {
        let actionPubUnpub = props.event.public ? "unpublished" : "published";
        let actionPubUnpubPresent = props.event.public
            ? "unpublish"
            : "publish";

        await endpoints.events
            .updateVisibility(props.event.id, !props.event.public)
            .then(() => {
                toast.success(`Resource ${actionPubUnpub} successfully!`);
                let updatedEvent = props.event;
                updatedEvent.public = !props.event.public;
                props.handleEventUpdate(updatedEvent);
            })
            .catch(() => {
                toast.error(`Failed to ${actionPubUnpubPresent} event`);
            })
            .finally(() => {
                setShowVisibilityDialogue(false);
            });
    }

    return (
        <>
            <div className="items-center justify-center align-baseline">
            {
                    props.event.public ?
                    <Button
                        color="secondary"
                        radius="full"
                        variant="light"
                        onClick={() => {setShowVisibilityDialogue(true)}}
                    >
                        Unpublish
                    </Button> :
                    <Button
                        color="secondary"
                        radius="full"
                        variant="light"
                        onClick={() => {setShowVisibilityDialogue(true)}}
                    >
                        Publish
                    </Button>
                }
                
                <Button
                    color="danger"
                    radius="full"
                    variant="light"
                    onClick={() => {
                        setShowDeletionDialogue(true);
                    }}
                >
                    Delete
                </Button>
            </div>

            <Modal
                isOpen={showVisibilityDialogue}
                onOpenChange={() => setShowVisibilityDialogue(false)}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Are you sure?
                                <small className="text-default-500">
                                    {props.event.public
                                        ? "You can always publish again!"
                                        : "You can always unpublish later"}
                                </small>
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    {props.event.public
                                        ? `This action will remove the '${props.event.title}' event from public view`
                                        : `This will make the event '${props.event.title}' publicly available`}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={handleEventPublication}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={showDeletionDialogue}
                onOpenChange={() => setShowDeletionDialogue(false)}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Are you sure?
                                <small className="text-default-500">
                                    This action is permanent and irreversible!
                                </small>
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    This action will permanentely delete the
                                    event &apos;
                                    {props.event.title}&apos;!
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={handleEventDeletion}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
