"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner, JOB_PHOTO_X_PXL, JOB_PHOTO_Y_PXL } from "@/app/utils";
import { Company } from "@/app/api/backend/companies";
import { endpoints } from "@/app/api/backend/endpoints";
import { Select, SelectItem } from "@nextui-org/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import dayjs from "dayjs";
import { CreateJob } from "@/app/api/backend/jobs";
import FileUploader from "@/app/photoUploader";

export default function CreateJob() {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [companiesAll, setCompaniesAll] = useState<Company[]>([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [company, setCompany] = useState("");
    const [body, setBody] = useState("");
    const [creator, setCreator] = useState("");
    const [expirationTime, setExpirationTime] = useState(new Date());
    const [photo, setPhoto] = useState<Blob | null>(null);

    useEffect(() => {
        async function getData() {
            await endpoints.companies
                .getAll()
                .then((cmps) => {
                    setCompaniesAll(cmps);
                })
                .catch(() => {
                    toast.error("Failed to retrieve companies");
                });
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
        if (company === "") {
            return toast.error("Please select a company");
        }
        
        if(title === "" || body == "" || description == "") {
            return toast.error("Please fill all fields");
        }
        
        if (!photo) {
            return toast.error("Please upload a photo!");
        }
        
        if(!session.data || !session.data.user) {
            toast.error("Unauthorised");
            return router.push("/");
        }

        const exp = dayjs(expirationTime);

        if(!exp.isAfter(Date.now())) {
            return toast.error("Please select an expiration date in the future!");
        }
        

        let job: CreateJob = {
            title: title,
            description: description,
            body: body,
            company: company,
            creator: session.data.user.id,
            expiration_time: exp.toISOString(),
        };

        setLoading(true);
        endpoints.jobs
            .create(job, photo)
            .then((uploadedJob) => {
                setLoading(false);
                toast.success("Created job successfully");
                router.push("/jobs");
                return;
            })
            .catch(() => {
                toast.error("Failed to create job");
                setLoading(false);
                return;
            });
    }

    async function handleCancel() {
        return router.back();
    }

    function getCompaniesSelect(): Iterable<string> {
        for (let c of companiesAll) {
            if (c.id === company) {
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
                                New Job
                            </h1>
                            <div></div>
                        </div>
                    </div>

                    <p className="py-5  text-2xl font-semibold">Title</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Job title..."
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />

                    <p className="py-5  text-2xl font-semibold">Description</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Short description of the job..."
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />

                    <p className="py-5  text-2xl font-semibold">Body</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Further details..."
                        value={body}
                        onChange={(e) => {
                            setBody(e.target.value);
                        }}
                    />

                    <p className="py-5  text-2xl font-semibold">Company</p>
                    <Select
                        items={companiesAll}
                        label="Company"
                        placeholder="Select a company"
                        className="max-w-xs"
                        required
                        selectedKeys={getCompaniesSelect()}
                        onChange={(companyId) => {
                            setCompany(companyId.target.value);
                        }}
                    >
                        {(company) => (
                            <SelectItem key={company.id}>
                                {company.name}
                            </SelectItem>
                        )}
                    </Select>

                    <p className="py-5  text-2xl font-semibold">Expiration</p>
                    <DatePicker
                        className="bg-red"
                        showIcon={true}
                        showTimeSelect
                        selected={expirationTime}
                        onChange={(date: Date) => setExpirationTime(date)}
                    />

                    <p className="py-5  text-2xl font-semibold">Upload photo</p>
                    <FileUploader
                        uploadCroppedPhoto={
                            (blob: Blob) => {
                                setLoading(true);
                                setPhoto(blob);
                                setLoading(false);
                            }
                        }
                        cancelUploadingCroppedPhoto={
                            () => {setPhoto(null)}
                        }
                        xPixels={JOB_PHOTO_X_PXL}
                        yPixels={JOB_PHOTO_Y_PXL}
                    />

                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={handleConfirm}
                    >
                        Create job
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
