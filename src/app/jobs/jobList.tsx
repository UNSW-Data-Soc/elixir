"use client";

import { CSSProperties, useEffect, useState } from "react";

import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";
import {
    Image,
    Link,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Chip,
    Divider,
    Card,
    CardHeader,
    CardBody,
    ScrollShadow,
    CardFooter,
} from "@nextui-org/react";
import { Company } from "../api/backend/companies";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Job } from "../api/backend/jobs";
import JobInformation from "./jobExpirationInfo";
import JobActionsModal from "./jobActionsModal";
import TagReferencesList from "../tags/references/tagReferencesList";
import { AttachmentInfo, TagReferences } from "../api/backend/tags";
import JobActions from "./jobActions";
dayjs.extend(relativeTime);

const MAX_DESCRIPTION_CHAR = 40;

export default function JobList() {
    const session = useSession();
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
    const [tagReferences, setTagReferences] = useState<TagReferences[]>([]);

    useEffect(() => {
        async function getData() {
            let jobs: Job[] = [];
            let cmp: Company[] = [];
            let references_all: TagReferences[] = [];

            try {
                if (session.status !== "authenticated") {
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
                return toast.error("Failed to retrieve jobs");
            }
        }

        getData();
    }, [session.status]);

    function getCompanyFromJobs(jobs: Job): Company {
        // should always exist
        for (let c of companies) {
            if (jobs.company === c.id) {
                return c;
            }
        }

        toast.error("Invalid sponsorship");
        throw Error("");
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

    async function updateAttachments(updatedAttachments: AttachmentInfo[]) {
        setAttachments(updatedAttachments);

        // doesn't modify actual references, only *removes* from reference list
        let updatedTagReferences: TagReferences[] = [];
        for (let t of tagReferences) {
            for (let a of updatedAttachments) {
                if (t.tags_id === a.tag_id) {
                    updatedTagReferences.push(t);
                    break;
                }
            }
        }

        // doesn't modify actual references, only *adds* to reference list
        for (let a of updatedAttachments) {
            let found = false;
            for (let t of updatedTagReferences) {
                if (t.tags_id === a.tag_id) {
                    found = true;
                }
            }

            if (!found) {
                updatedTagReferences.push({
                    tags_id: a.tag_id,
                    tags_name: a.name,
                    tags_colour: a.colour,
                    portfolio: [],
                    blog: [],
                    event: [],
                    resource: [],
                    job: [
                        [
                            a.bearer_id,
                            jobs.find((j) => j.id === a.bearer_id)?.title || "",
                        ],
                    ],
                });
            }
        }

        setTagReferences(updatedTagReferences);
    }

    function allJobs() {
        return (
            <>
                <div className="flex flex-col items-center justify-center align-baseline gap-3">
                    {jobs.map((job) => (
                        <div key={job.id} style={getJobCardStyle(job)}>
                            <JobCard
                                key={job.id}
                                company={getCompanyFromJobs(job)}
                                job={job}
                                handleJobDeletion={handleJobDeletion}
                                tagReferences={tagReferences}
                                updateAttachments={updateAttachments}
                            />
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center align-baseline gap-3">
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
    updateAttachments?: (updatedAttachments: AttachmentInfo[]) => void;
}) {
    const [showcompanyDescription, setShowcompanyDescription] = useState(false);

    return (
        <>
            <div className="max-w-[400px]">
                <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">
                            {props.company.name}
                        </p>
                        <small className="text-default-500">
                            {props.company.website_url}
                        </small>
                        <h4 className="font-bold text-md">
                            {props.job.description.substring(
                                0,
                                MAX_DESCRIPTION_CHAR
                            )}
                            ...
                        </h4>
                    </CardHeader>
                    <CardBody className="flex items-center justify-center align-baseline overflow-visible py-2">
                        <Image
                            isBlurred
                            src={endpoints.jobs.getJobPhoto(props.job.id)}
                            alt="Profile picture"
                            className="object-cover rounded-xl"
                            style={{ cursor: "pointer" }}
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
                            // pass in to prevent multiple fetch calls
                            tagReferences={
                                // only show tags related to this particular resource
                                props.tagReferences.filter((r) => {
                                    for (let i of r.job) {
                                        if (i[0] === props.job.id) {
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
            </div>
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
                        <ModalHeader className="flex flex-row items-start justify-between align-baseline">
                            <div className="flex flex-col items-start justify-between align-baseline">
                                {props.job.title}
                                <Link
                                    isExternal
                                    showAnchorIcon
                                    href={props.company.website_url}
                                    style={{ cursor: "pointer" }}
                                >
                                    {props.company.name}
                                </Link>
                            </div>
                            <small className="text-default-500">
                                {/* Only displays if user is admin */}
                                <JobInformation job={props.job} />
                            </small>
                        </ModalHeader>
                        <ModalBody className="flex flex-col items-start justify-center align-baseline">
                            <Divider />
                            <p className="text-tiny uppercase font-bold">
                                Description
                            </p>
                            <ScrollShadow className="h-[100px]">
                                <p>{props.job.description}</p>
                            </ScrollShadow>
                            <Divider />
                            <p className="text-tiny uppercase font-bold">
                                Further Information
                            </p>
                            <ScrollShadow className="h-[200px]">
                                <p>{props.job.body}</p>
                            </ScrollShadow>
                        </ModalBody>
                        <ModalFooter className="flex item-center justify-between align-baseline">
                            <JobActionsModal
                                job={props.job}
                                company={props.company}
                                handleDeletion={props.handleJobDeletion}
                            />
                            <Button
                                color="primary"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
