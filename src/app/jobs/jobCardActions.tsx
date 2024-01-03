"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

type Job = RouterOutputs["jobs"]["getAll"][number];

export default function JobCardActions({ job }: { job: Job["jobPosting"] }) {
  const publishModal = useDisclosure();
  const deleteModal = useDisclosure();

  return (
    <>
      <div className="absolute right-5 top-5 z-20 flex flex-row overflow-hidden rounded-lg">
        <JobActionButton className="bg-[#F29F05]" onClick={publishModal.onOpen}>
          {job.public ? <EyeSlashIcon height={20} /> : <EyeIcon height={20} />}
          <span className="hidden sm:block">
            {job.public ? "Unpublish" : "Publish"}
          </span>
        </JobActionButton>
        <JobActionButton className="bg-[#D9435F]" onClick={deleteModal.onOpen}>
          <TrashIcon height={20} />
          <span className="hidden sm:block">Delete</span>
        </JobActionButton>
      </div>

      {/* publish confirmation modal */}
      <JobPublishConfirmationModal job={job} {...publishModal} />

      {/* delete confirmation modal */}
      <JobDeleteConfirmationModal job={job} {...deleteModal} />
    </>
  );
}

function JobActionButton({
  className = "bg-white",
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex flex-row items-center gap-2 rounded-none p-2 px-3 text-sm text-white ${className} transition-all hover:brightness-110`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

type JobModalProps = {
  job: Job["jobPosting"];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

function JobPublishConfirmationModal({
  job,
  isOpen,
  onOpenChange,
}: JobModalProps) {
  const ctx = api.useUtils();

  const { mutate: togglePublishJob } = api.jobs.togglePublic.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      const actionPubUnpub = job.public ? "unpublish" : "publish";
      toast.success(`Job ${actionPubUnpub}ed successfully!`);
      void ctx.jobs.invalidate();
    },
    onError: () => {
      const actionPubUnpub = job.public ? "unpublish" : "publish";
      toast.error(`Failed to ${actionPubUnpub} job`);
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are you sure?
              <small className="text-default-500">
                {job.public
                  ? "You can always publish again!"
                  : "You can always unpublish later"}
              </small>
            </ModalHeader>
            <ModalBody>
              <p>{`This action will ${
                job.public ? "unpublish" : "publish"
              } the job posting`}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  togglePublishJob({ id: job.id });
                  onClose();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function JobDeleteConfirmationModal({
  job,
  isOpen,
  onOpenChange,
}: JobModalProps) {
  const ctx = api.useUtils();

  const { mutate: deleteJob } = api.jobs.delete.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      void ctx.jobs.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete job");
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                This action will permanently delete the job posting: {job.title}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  deleteJob({ id: job.id });
                  onClose();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
