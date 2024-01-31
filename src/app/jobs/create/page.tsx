"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner, JOB_PHOTO_X_PXL, JOB_PHOTO_Y_PXL, DEFAULT_DATEPICKER_INTERVAL, isModerator } from "@/app/utils";
import { Select, SelectItem } from "@nextui-org/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import dayjs from "dayjs";
import { CreateJob } from "@/app/api/backend/jobs";
// import PhotoUploader from "@/app/photoUploader";
import { api } from "@/trpc/react";

export default function CreateJob() {
  const router = useRouter();
  const session = useSession();

  const { data: companiesAll, isLoading, isError } = api.companies.getAll.useQuery();
  const { mutate: createJob } = api.jobs.create.useMutation({
    onSuccess: async () => { 
      toast.success("Job created successfully.");
      router.push("/jobs");
    },
    onError: () => {
      toast.error("Failed to create job.");
    },
  }); 

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [body, setBody] = useState("");
  const [expirationTime, setExpirationTime] = useState(new Date());
  const [link, setLink] = useState<string>("");
  // const [photo, setPhoto] = useState<Blob | null>(null);

  if (session.status === "loading" || isLoading || isError) return <></>;
  if (!isModerator(session.data)) {
    router.push("/");
    return <></>;
  }

  async function handleConfirm() {
    if (company === "") {
      return toast.error("Please select a company");
    }

    if (title.trim() === "") {
      return toast.error("Please fill all fields");
    }

    // if (!photo) {
    //   return toast.error("Please upload a photo!");
    // }

    // TODO: check url is either valid or not given (since it is optional)

    if(!isModerator(session.data)) {
      toast.error("Unauthorised");
      return router.push("/");
    }

    if(!dayjs(expirationTime).isAfter(Date.now())) {
      return toast.error("Please select an expiration date in the future!");
    }

    createJob({
      title: title.trim(),
      description: description.trim(),
      body: body.trim(),
      companyId: company,
      photoFileType: undefined, // TODO: do we need a photo for job postings?
      expiration: expirationTime,
      link: link.trim() === "" ? undefined : link.trim(),
    });
  }

  async function handleCancel() {
    return router.back();
  }

  function getCompaniesSelect(): Iterable<string> {
    // for (let c of companiesAll) {
    //   if (c.id === company) {
    //     return new Set([company]);
    //   }
    // }
    const match = companiesAll?.find(c => c.id === company);
    if (match) {
      return new Set([company]);
    }
    return new Set([]);
  }

  return (
    <>
      {isLoading && <Spinner />}
      <main className="container m-auto flex flex-col p-10">
        <div className="container m-auto flex flex-row justify-between flex-wrap">
          <div>
            <h1 className="py-3 text-5xl font-semibold">
              New Job
            </h1>
          </div>
        </div>

        <p className="py-5  text-2xl font-semibold">Title</p>
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all"
          type="text"
          placeholder="Job title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="py-5  text-2xl font-semibold">Short Description <span className="text-sm">(optional)</span></p>
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all"
          type="text"
          placeholder="Short description of the job..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <p className="py-5  text-2xl font-semibold">Long Description <span className="text-sm">(optional)</span></p>
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all"
          type="text"
          placeholder="Further details..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <p className="py-5 text-2xl font-semibold">Company</p>
        <Select
            items={companiesAll}
            label="Company"
            placeholder="Select a company"
            className="max-w-xs"
            required
            selectedKeys={getCompaniesSelect()}
            onChange={(companyId) => setCompany(companyId.target.value)}
        >
          {(company) => (
            <SelectItem key={company.id}>
              {company.name}
            </SelectItem>
          )}
        </Select>

        <p className="py-5 text-2xl font-semibold">Expiration</p>
        <DatePicker
          className="bg-red"
          showIcon={true}
          showTimeSelect
          selected={expirationTime}
          timeIntervals={DEFAULT_DATEPICKER_INTERVAL}
          onChange={(date: Date) => setExpirationTime(date)}
        />

        <p className="py-5  text-2xl font-semibold">Link <small>(optional)</small></p>
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all"
          type="text"
          placeholder="Link to job posting..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* <p className="py-5 text-2xl font-semibold">Upload photo</p>
        <PhotoUploader
          uploadCroppedPhoto={(blob: Blob) => setPhoto(blob)}
          cancelUploadingCroppedPhoto={() => setPhoto(null)}
          xPixels={JOB_PHOTO_X_PXL}
          yPixels={JOB_PHOTO_Y_PXL}
        /> */}

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
      </main>
    </> 
  ); 
}
