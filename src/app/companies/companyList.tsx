"use client";

import { useEffect, useState } from "react";

import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";
import {
    Image,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import { Company } from "../api/backend/companies";
import CompanyActions from "./companyActions";
import { COMPANY_PHOTO_X_PXL, COMPANY_PHOTO_Y_PXL } from "../utils";

export default function CompanyList() {
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        async function getCompanies() {
            await endpoints.companies
                .getAll()
                .then((companies) => {
                    setCompanies(companies);
                })
                .catch(() => {
                    return toast.error("Failed to retrieve companies");
                });
        }

        getCompanies();
    }, []);

    async function handleDeletion(id: string) {
        let updatedCompanies: Company[] = [];
        for (let c of companies) {
            if (c.id === id) {
                continue;
            }

            updatedCompanies.push(c);
        }

        setCompanies(updatedCompanies);
    }

    return (
        <>
            {companies.map((company) => (
                <CompaniesCard
                    key={company.id}
                    company={company}
                    handleDeletion={handleDeletion}
                />
            ))}
        </>
    );
}

function CompaniesCard(props: {
    company: Company,
    handleDeletion: (id: string) => void
}) {
    const [showcompanyDescription, setShowcompanyDescription] = useState(false);

    return (
        <>
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg">{props.company.name}</p>
                        <Link
                            isExternal
                            showAnchorIcon
                            href={props.company.website_url}
                            style={{ cursor: "pointer" }}
                        >
                            {props.company.website_url}
                        </Link>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody onClick={() => setShowcompanyDescription(true)}>
                    <Image
                        src={endpoints.companies.getCompanyPhoto(
                            props.company.id
                        )}
                        alt="Profile picture"
                        className="object-cover rounded-xl"
                        height={COMPANY_PHOTO_Y_PXL}
                        width={COMPANY_PHOTO_X_PXL}
                    />
                </CardBody>
                <CardFooter className="flex items-center justify-center align-baseline">
                    <CompanyActions
                        handleDeletion={props.handleDeletion}
                        company={props.company}
                    />
                </CardFooter>
            </Card>
            {showcompanyDescription && (
                <CompanyDescriptionModal
                    company={props.company}
                    onOpenChange={() => setShowcompanyDescription(false)}
                />
            )}
        </>
    );
}

function CompanyDescriptionModal(props: {
    company: Company;
    onOpenChange: () => void;
}) {
    return (
        <Modal isOpen={true} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {props.company.name}
                            <small className="text-default-500">
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
                        <ModalBody>
                            <p>{props.company.description}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
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
