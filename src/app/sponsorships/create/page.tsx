"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/app/utils";
import { Company } from "@/app/api/backend/companies";
import { endpoints } from "@/app/api/backend/endpoints";
import { CreateSponsorship, SponsorshipType, isOfTypeSponsorshipType } from "@/app/api/backend/sponsorships";
import { Select, SelectItem } from "@nextui-org/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import dayjs from "dayjs";

export default function CreateSponsorship() {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [companiesAll, setCompaniesAll] = useState<Company[]>([]);

    const [message, setMessage] = useState("");
    const [sponsorshipType, setSponsorshipType] = useState<SponsorshipType>("other");
    const [company, setCompany] = useState("");
    const [expiration, setExpiration] = useState(new Date());

    useEffect(() => {
        async function getData() {
            await endpoints.companies.getAll()
                .then(cmps => {
                    setCompaniesAll(cmps);
                })
                .catch(() => {
                    toast.error("Failed to retrieve companies");
                })
        }
        
        setLoading(true);
        getData();
        setLoading(false);
    }, []);

    if (session.status == "loading") return <></>;
    if (session.status === "unauthenticated" || !session.data?.user) {
        router.push("/");
        return <></>;
    }

    async function handleConfirm() {
        if(company === "") {
            return toast.error("Please select a company");
        }

        const exp = dayjs(expiration);

        if(!exp.isAfter(Date.now())) {
            return toast.error("Please select an expiration date in the future!");
        }
        
        let sponsorship: CreateSponsorship = {
            message: message,
            sponsorship_type: sponsorshipType,
            company: company,
            expiration: dayjs(expiration).toISOString(),
        };

        setLoading(true);
        endpoints.sponsorships.create(sponsorship)
        .then(uploadedSponsorship => {
            setLoading(false);
            toast.success("Created sponsorship successfully");
            router.push("/sponsorships");
            return;
        }).catch(() => {
            toast.error("Failed to create sponsorship");
            setLoading(false);
            return;
        });

    }

    async function handleCancel() {
        return router.back();
    }

    function isValidURL(text: string) {
        let url: URL;

        try {
            url = new URL(text);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    function getCompaniesSelect(): Iterable<string> {
        for(let c of companiesAll) {
            if(c.id === company) {
                return new Set([company]);
            }
        }
        return new Set([]);
    }

    return (
        <>
            {loading && <Spinner />}
            {
                <div className="container m-auto flex flex-col">
                    <div className="container m-auto flex flex-row justify-between flex-wrap">
                        <div>
                            <h1 className="py-3 text-5xl font-semibold">
                                New Sponsorship
                            </h1>
                            <div></div>
                        </div>
                    </div>

                    <p className="py-5  text-2xl font-semibold">Type</p>
                    <Select
                        label="Type"
                        placeholder="Select an sponsorship type"
                        className="max-w-xs"
                        selectedKeys={new Set([sponsorshipType])}
                        isRequired
                        onChange={t => {
                            let sType = t.target.value;
                            if(isOfTypeSponsorshipType(sType)) {
                                setSponsorshipType(sType);
                            }
                        }}
                    >
                        {["major", "partner", "other"].map((sType) => (
                        <SelectItem key={sType} value={sType}>
                            {sType}
                        </SelectItem>
                        ))}
                    </Select>
                    
                    <p className="py-5  text-2xl font-semibold">Company</p>
                    <Select
                        items={companiesAll}
                        label="Company"
                        placeholder="Select a company"
                        className="max-w-xs"
                        required
                        selectedKeys={getCompaniesSelect()}
                        onChange={companyId => {
                            setCompany(companyId.target.value)
                        }}
                        >
                        {(company) => <SelectItem key={company.id}>{company.name}</SelectItem>}
                    </Select>

                    <p className="py-5  text-2xl font-semibold">Sponsorship Message</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="A call to action..."
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                    />

                    <p className="py-5  text-2xl font-semibold">Expiration</p>
                    <DatePicker
                        className="bg-red"
                        showIcon={true}
                        showTimeSelect
                        selected={expiration}
                        onChange={(date: Date) => setExpiration(date)}
                    />

                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={handleConfirm}
                    >
                        Create sponsorship
                    </button>
                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            }
        </>
    );
}
