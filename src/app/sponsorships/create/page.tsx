"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

import { Select, SelectItem } from "@nextui-org/select";

import { api } from "@/trpc/react";

import { DEFAULT_DATEPICKER_INTERVAL, Spinner, isModerator } from "@/app/utils";

// import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

const sponsorshipTypes = ["major", "partner", "other"] as const;
type SponsorshipType = (typeof sponsorshipTypes)[number];

function checkSponsorshipType(s: string): s is SponsorshipType {
  return sponsorshipTypes.includes(s as SponsorshipType);
}

export default function CreateSponsorship() {
  const router = useRouter();
  const session = useSession();

  const [message, setMessage] = useState("");
  const [sponsorshipType, setSponsorshipType] =
    useState<SponsorshipType>("other");
  const [company, setCompany] = useState("");
  const [expiration, setExpiration] = useState(new Date());

  const {
    data: companiesAll,
    isLoading,
    isError,
  } = api.companies.getAll.useQuery();
  const { mutate: createSpon } = api.sponsorships.create.useMutation({
    onSuccess: () => {
      toast.success("Created sponsorship successfully");
      router.push("/sponsorships");
    },
    onError: () => {
      toast.error("Failed to create sponsorship");
    },
  });

  if (session.status == "loading") return <Spinner />;
  if (session.status === "unauthenticated" || !isModerator(session.data)) {
    router.push("/auth/login");
  }
  if (isLoading) return <Spinner />;
  if (!companiesAll && isError) {
    toast.error("Error getting companies");
    return <></>;
  }

  async function handleConfirm() {
    if (company === "") {
      return toast.error("Please select a company");
    }

    // TODO: do we need this check
    // if(!dayjs(expiration).isAfter(Date.now())) {
    //     return toast.error("Please select an expiration date in the future!");
    // }

    createSpon({
      message,
      sponPublic: true,
      type: sponsorshipType,
      company,
      expiration,
    });
  }

  return (
    <>
      {isLoading && <Spinner />}
      <div className="container m-auto flex flex-col">
        <div className="container m-auto flex flex-row justify-between flex-wrap">
          <div>
            <h1 className="py-3 text-5xl font-semibold">New Sponsorship</h1>
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
          onChange={(t) => {
            const sType = t.target.value;
            if (checkSponsorshipType(sType)) setSponsorshipType(sType);
          }}
        >
          {sponsorshipTypes.map((sType) => (
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
          selectedKeys={(() => {
            const companyObj = companiesAll.find((c) => c.id === company);
            if (!companyObj) return new Set([]);
            return new Set([companyObj.id]);
          })()}
          onChange={(companyId) => {
            setCompany(companyId.target.value);
          }}
        >
          {(company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          )}
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
          timeIntervals={DEFAULT_DATEPICKER_INTERVAL}
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
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
