'use client';

import { CSSProperties, useEffect, useState } from 'react';

import { endpoints } from '../api/backend/endpoints';
import { toast } from 'react-hot-toast';
import {
  Image,
  Link,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Card,
  CardHeader,
  CardBody,
  ScrollShadow,
  CardFooter,
} from '@nextui-org/react';
import { Company } from '../api/backend/companies';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Job } from '../api/backend/jobs';
import JobInformation from './jobExpirationInfo';
import JobActionsModal from './jobActionsModal';
import TagReferencesList from '../tags/references/tagReferencesList';
import {
  Attachment,
  AttachmentInfo,
  Detachment,
  TagReferences,
} from '../api/backend/tags';
import JobActions from './jobActions';
import { get } from 'http';
dayjs.extend(relativeTime);

const MAX_DESCRIPTION_CHAR = 40;

export default function JobList() {
  const session = useSession();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
  const [tagReferences, setTagReferences] = useState<TagReferences[]>([]);

  async function getData() {
    let jobs: Job[] = [];
    let cmp: Company[] = [];
    let references_all: TagReferences[] = [];

    try {
      if (session.status !== 'authenticated') {
        [jobs, cmp, references_all] = await Promise.all([
          endpoints.jobs.getAll(false),
          endpoints.companies.getAll(),
          endpoints.tags.references(false),
        ]);
      } else {
        [jobs, cmp, references_all] = await Promise.all([
          endpoints.jobs.getAll(true),
          endpoints.companies.getAll(),
          endpoints.tags.references(true),
        ]);
      }
      setJobs(jobs);
      setCompanies(cmp);
      setTagReferences(references_all);
    } catch {
      return toast.error('Failed to retrieve jobs');
    }
  }

  useEffect(() => {
    getData();
  }, [session.status]);

  function getCompanyFromJobs(jobs: Job): Company {
    // should always exist
    for (let c of companies) {
      if (jobs.company === c.id) {
        return c;
      }
    }

    toast.error('Invalid sponsorship');
    throw Error('');
  }

  async function handleJobDeletion(id: string) {
    let updatedJobs: Job[] = [];
    for (let j of jobs) {
      if (j.id === id) {
        continue;
      }

      updatedJobs.push(j);
    }

    setJobs(updatedJobs);
  }

  async function updateAttachments(
    updatedAttachments: AttachmentInfo[],
    to_attach: Attachment[],
    to_detach: Detachment[]
  ) {
    let updatedTagReferences = updateTagReferencesResources(
      tagReferences,
      updatedAttachments,
      to_attach,
      to_detach
    );
    setAttachments(updatedAttachments);

    setTagReferences(updatedTagReferences);
  }

  function updateTagReferencesResources(
    currentTagReferences: TagReferences[],
    updatedAttachments: AttachmentInfo[],
    to_attach: Attachment[],
    to_detach: Detachment[]
  ): TagReferences[] {
    let updatedTagReferences: TagReferences[] = [];

    for (let u of currentTagReferences) {
      let new_tag_ref = u;
      for (let d of to_detach) {
        let attachment_info = attachments.find(
          (a) => a.attachment_id === d.attachment_id
        );
        if (!attachment_info) continue; // shouldn't occur
        if (new_tag_ref.tags_id === attachment_info.tag_id) {
          new_tag_ref.job = new_tag_ref.job.filter(
            (r) => r[0] !== attachment_info?.bearer_id
          );
        }
      }
      updatedTagReferences.push(new_tag_ref);
    }

    for (let a of to_attach) {
      for (let u of updatedAttachments) {
        if (a.bearer_id === u.bearer_id && a.tag_id === u.tag_id) {
          updatedTagReferences.push({
            tags_id: u.tag_id,
            tags_name: u.name,
            tags_colour: u.colour,
            portfolio: [],
            blog: [],
            event: [],
            resource: [],
            job: [
              [
                a.bearer_id,
                jobs.find((j) => j.id === a.bearer_id)?.title || '',
              ],
            ],
          });
        }
      }
    }

    return updatedTagReferences;
  }

  function allJobs() {
    return (
      <>
        <div className='flex items-stretch justify-center align-baseline gap-3 flex-wrap'>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              company={getCompanyFromJobs(job)}
              job={job}
              handleJobDeletion={handleJobDeletion}
              tagReferences={tagReferences}
              updateAttachments={updateAttachments}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center align-baseline gap-3'>
        {jobs.length > 0 ? (
          allJobs()
        ) : (
          <div>We will have more jobs coming soon, stay tuned!</div>
        )}
      </div>
    </>
  );
}

function JobCard(props: {
  company: Company;
  job: Job;
  tagReferences: TagReferences[];
  handleJobDeletion: (id: string) => void;
  updateAttachments: (
    updatedAttachments: AttachmentInfo[],
    to_attach: Attachment[],
    to_detach: Detachment[]
  ) => void;
}) {
  const [showcompanyDescription, setShowcompanyDescription] = useState(false);

  function getJobCardStyle(j: Job): CSSProperties {
    const expirationPassed = dayjs(Date.parse(j.expiration_time)).isAfter(
      Date.now()
    );

    return expirationPassed
      ? {}
      : {
          opacity: 0.5,
        };
  }

  return (
    <>
      <Card className='py-4' style={getJobCardStyle(props.job)}>
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
          <p className='text-tiny uppercase font-bold'>{props.company.name}</p>
          <small className='text-default-500'>
            {props.company.website_url}
          </small>
          <h4 className='font-bold text-md'>
            {props.job.description.substring(0, MAX_DESCRIPTION_CHAR)}
            ...
          </h4>
        </CardHeader>
        <CardBody className='flex items-center justify-center align-baseline overflow-visible py-2'>
          <Image
            isBlurred
            src={endpoints.jobs.getJobPhoto(props.job.id)}
            alt='Profile picture'
            className='object-cover rounded-xl'
            style={{ cursor: 'pointer' }}
            height={300}
            width={300}
            onClick={() => {
              setShowcompanyDescription(true);
            }}
          />
        </CardBody>
        <CardFooter>
          <TagReferencesList
            styleLarge={false}
            showEditingTools={false}
            tagReferences={
               // only show tags related to this particular job
               props.tagReferences.filter(r => {
                for(let i of r.job) {
                    if(i[0] === props.job.id) {
                        return true;
                    }
                }
                return false;
            })
            }
          />
        </CardFooter>
        <JobActions
          job={props.job}
          company={props.company}
          updateAttachments={props.updateAttachments}
        />
      </Card>
      {showcompanyDescription && (
        <JobDescriptionModal
          company={props.company}
          job={props.job}
          onOpenChange={() => setShowcompanyDescription(false)}
          handleJobDeletion={props.handleJobDeletion}
        />
      )}
    </>
  );
}

function JobDescriptionModal(props: {
  job: Job;
  company: Company;
  onOpenChange: () => void;
  handleJobDeletion: (id: string) => void;
}) {
  return (
    <Modal isOpen={true} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-row items-start justify-between align-baseline'>
              <div className='flex flex-col items-start justify-between align-baseline'>
                {props.job.title}
                <Link
                  isExternal
                  showAnchorIcon
                  href={props.company.website_url}
                  style={{ cursor: 'pointer' }}
                >
                  {props.company.name}
                </Link>
              </div>
              <small className='text-default-500'>
                {/* Only displays if user is admin */}
                <JobInformation job={props.job} />
              </small>
            </ModalHeader>
            <ModalBody className='flex flex-col items-start justify-center align-baseline'>
              <Divider />
              <p className='text-tiny uppercase font-bold'>Description</p>
              <ScrollShadow className='h-[100px]'>
                <p>{props.job.description}</p>
              </ScrollShadow>
              <Divider />
              <p className='text-tiny uppercase font-bold'>
                Further Information
              </p>
              <ScrollShadow className='h-[200px]'>
                <p>{props.job.body}</p>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter className='flex item-center justify-between align-baseline'>
              <JobActionsModal
                job={props.job}
                company={props.company}
                handleDeletion={props.handleJobDeletion}
              />
              <Button color='primary' variant='light' onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
