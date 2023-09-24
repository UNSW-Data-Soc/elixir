'use client';

import { Button } from '@nextui-org/button';
import { Company } from '../api/backend/companies';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { endpoints } from '../api/backend/endpoints';
import toast from 'react-hot-toast';
import { Job } from '../api/backend/jobs';

export default function JobActions(props: {
  job: Job;
  company: Company;
  handleDeletion: (id: string) => void;
}) {
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);

  const session = useSession();
  const router = useRouter();

  if (session.status !== 'authenticated' || !session.data.user.admin) {
    return <></>;
  }

  async function handleJobDeletion() {
    await endpoints.jobs
      .remove(props.job.id)
      .then(() => {
        toast.success('Job deleted successfully!');
        props.handleDeletion(props.job.id);
      })
      .catch(() => {
        toast.error('Failed to delete job');
      })
      .finally(() => {
        setShowDeletionDialogue(false);
        return;
      });
  }

  return (
    <>
      <div className='items-center justify-center align-baseline'>
        <Button
          color='danger'
          radius='full'
          variant='light'
          onClick={() => {
            setShowDeletionDialogue(true);
          }}
        >
          Delete Job
        </Button>
      </div>
      <Modal
        isOpen={showDeletionDialogue}
        onOpenChange={() => setShowDeletionDialogue(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Are you sure?
                <small className='text-default-500'>
                  This action is permanent and irreversible!
                </small>
              </ModalHeader>
              <ModalBody>
                <p>
                  This action will permanently delete the job by &apos;
                  {props.company.name}&apos;!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color='primary' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='danger'
                  variant='light'
                  onPress={handleJobDeletion}
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
