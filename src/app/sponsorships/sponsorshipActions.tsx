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
import { Sponsorship } from '../api/backend/sponsorships';

export default function SponsorshipsActions(props: {
  sponsorship: Sponsorship;
  company: Company;
  handleDeletion: (id: string) => void;
}) {
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);

  const session = useSession();
  const router = useRouter();

  if (session.status !== 'authenticated' || !session.data.user.admin) {
    return <></>;
  }

  async function handleSponsorshipDeletion() {
    await endpoints.sponsorships
      .remove(props.sponsorship.id)
      .then(() => {
        toast.success('Sponsorship deleted successfully!');
        props.handleDeletion(props.sponsorship.id);
      })
      .catch(() => {
        toast.error('Failed to delete sponsorship');
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
          Delete Sponsorship
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
                  This action will permanently delete the sponsorship by &apos;
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
                  onPress={handleSponsorshipDeletion}
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
