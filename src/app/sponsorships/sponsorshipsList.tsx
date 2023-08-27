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
} from "@nextui-org/react";
import { Company } from "../api/backend/companies";
import { Sponsorship } from "../api/backend/sponsorships";
import SponsorshipsActions from "./sponsorshipActions";
import SponsorshipExpirationInfo from "./sponsorshipExpirationInfo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function SponsorshipsList() {
    const session = useSession();
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);

    useEffect(() => {
        async function getData() {
            let spons: Sponsorship[] = [];
            let cmp: Company[] = [];

            try {
                if (session.status !== "authenticated") {
                    [spons, cmp] = await Promise.all([
                        endpoints.sponsorships.getAll(false),
                        endpoints.companies.getAll(),
                    ]);
                } else {
                    [spons, cmp] = await Promise.all([
                        endpoints.sponsorships.getAll(true),
                        endpoints.companies.getAll(),
                    ]);
                }
                setSponsorships(spons);
                setCompanies(cmp);
            } catch {
                return toast.error("Failed to retrieve sponsorships");
            }
        }

        getData();
    }, [session.status]);

    function getCompanyFromSpons(spons: Sponsorship): Company {
        // should always exist
        for (let c of companies) {
            if (spons.company === c.id) {
                return c;
            }
        }

        toast.error("Invalid sponsorship");
        throw Error("");
    }

    async function handleSponsorshipDeletion(id: string) {
        let updatedSponsorships: Sponsorship[] = [];
        for (let s of sponsorships) {
            if (s.id === id) {
                continue;
            }

            updatedSponsorships.push(s);
        }

        setSponsorships(updatedSponsorships);
    }

    function getSponsorshipCardStyle(s: Sponsorship): CSSProperties {
        const expirationPassed = dayjs(Date.parse(s.expiration)).isAfter(
            Date.now()
        );

        return expirationPassed
            ? {}
            : {
                  opacity: 0.5,
              };
    }

    function allSponsorships() {
        return (
            <>
                {sponsorships.filter((s) => s.sponsorship_type === "major")
                    .length > 0 && (
                    <div className="flex flex-col items-center justify-center align-baseline gap-3">
                        <h1 className="text-3xl font-semibold">
                            Major Sponsors
                        </h1>
                        <div className="flex flex-wrap items-center justify-center align-baseline">
                            {sponsorships
                                .filter((s) => s.sponsorship_type === "major")
                                .map((sponsorship) => (
                                    <div
                                        key={sponsorship.id}
                                        style={getSponsorshipCardStyle(
                                            sponsorship
                                        )}
                                    >
                                        <SponsorshipCard
                                            key={sponsorship.id}
                                            company={getCompanyFromSpons(
                                                sponsorship
                                            )}
                                            sponsorship={sponsorship}
                                            handleSponsorshipDeletion={
                                                handleSponsorshipDeletion
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
                {sponsorships.filter((s) => s.sponsorship_type === "partner")
                    .length > 0 && (
                    <div className="flex flex-col items-center justify-center align-baseline gap-3">
                        <h1 className="text-3xl font-semibold">Partners</h1>
                        <div className="flex flex-wrap items-center justify-center align-baseline">
                            {sponsorships
                                .filter((s) => s.sponsorship_type === "partner")
                                .map((sponsorship) => (
                                    <div
                                        key={sponsorship.id}
                                        style={getSponsorshipCardStyle(
                                            sponsorship
                                        )}
                                    >
                                        <SponsorshipCard
                                            key={sponsorship.id}
                                            company={getCompanyFromSpons(
                                                sponsorship
                                            )}
                                            sponsorship={sponsorship}
                                            handleSponsorshipDeletion={
                                                handleSponsorshipDeletion
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
                {sponsorships.filter((s) => s.sponsorship_type === "other")
                    .length > 0 && (
                    <div className="flex flex-col items-center justify-center align-baseline gap-3">
                        <h1 className="text-3xl font-semibold">Other</h1>
                        <div className="flex flex-wrap items-center justify-center align-baseline">
                            {sponsorships
                                .filter((s) => s.sponsorship_type === "other")
                                .map((sponsorship) => (
                                    <div
                                        key={sponsorship.id}
                                        style={getSponsorshipCardStyle(
                                            sponsorship
                                        )}
                                    >
                                        <SponsorshipCard
                                            key={sponsorship.id}
                                            company={getCompanyFromSpons(
                                                sponsorship
                                            )}
                                            sponsorship={sponsorship}
                                            handleSponsorshipDeletion={
                                                handleSponsorshipDeletion
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center align-baseline gap-3">
                {sponsorships.length > 0 ? (
                    allSponsorships()
                ) : (
                    <div> We're still looking for sponsors! Please reach out to us if you are interested.</div>
                )}
            </div>
        </>
    );
}

function SponsorshipCard(props: {
    company: Company;
    sponsorship: Sponsorship;
    handleSponsorshipDeletion: (id: string) => void;
}) {
    const [showcompanyDescription, setShowcompanyDescription] = useState(false);

    return (
        <>
            <div className="max-w-[400px]">
                <Image
                    src={endpoints.companies.getCompanyPhoto(props.company.id)}
                    alt="Profile picture"
                    className="object-cover rounded-xl"
                    style={{ cursor: "pointer" }}
                    height={300}
                    width={300}
                    isZoomed
                    onClick={() => {
                        setShowcompanyDescription(true);
                    }}
                />
                {showcompanyDescription && (
                    <SponsorshipDescriptionModal
                        company={props.company}
                        sponsorship={props.sponsorship}
                        onOpenChange={() => setShowcompanyDescription(false)}
                        handleSponsorshipDeletion={
                            props.handleSponsorshipDeletion
                        }
                    />
                )}
            </div>
        </>
    );
}

function SponsorshipDescriptionModal(props: {
    company: Company;
    sponsorship: Sponsorship;
    onOpenChange: () => void;
    handleSponsorshipDeletion: (id: string) => void;
}) {
    return (
        <Modal isOpen={true} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {props.company.name}
                            <small className="text-default-500">
                                {/* Only displays if user is admin */}
                                <SponsorshipExpirationInfo
                                    sponsorship={props.sponsorship}
                                />
                                <Link
                                    isExternal
                                    showAnchorIcon
                                    href={props.company.website_url}
                                    style={{ cursor: "pointer" }}
                                >
                                    {props.company.website_url}
                                </Link>
                            </small>
                        </ModalHeader>
                        <ModalBody className="flex flex-col items-center justify-center align-baseline">
                            <Image
                                src={endpoints.companies.getCompanyPhoto(
                                    props.company.id
                                )}
                                alt="Profile picture"
                                className="object-cover rounded-xl"
                                height={300}
                                width={300}
                            />
                            <p>{props.sponsorship.message}</p>
                        </ModalBody>
                        <ModalFooter className="flex item-center justify-between align-baseline">
                            <SponsorshipsActions
                                sponsorship={props.sponsorship}
                                company={props.company}
                                handleDeletion={props.handleSponsorshipDeletion}
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
