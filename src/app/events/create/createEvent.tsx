"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL, Spinner } from "@/app/utils";
import { CreateEvent } from "@/app/api/backend/events";
import { endpoints } from "@/app/api/backend/endpoints";
import PhotoUploader from "@/app/photoUploader";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

export default function CreateEvent() {
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [photo, setPhoto] = useState<Blob | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (session.status == "loading") return <></>;
  if (session.status === "unauthenticated" || !session.data?.user) {
    router.push("/");
    return <></>;
  }

  async function handleConfirm() {
    if (!session.data || !session.data.user) {
      toast.error("Unauthorised");
      return router.push("/");
    }

    if (!isValidURL(link)) {
      return toast.error("Please enter a valid link");
    }

    if (title === "" || description == "" || location == "") {
      return toast.error("Please fill all fields");
    }

    if (!photo) {
      return toast.error("Please upload a photo!");
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isAfter(end)) {
      return toast.error("The start date cannot occur after the end date!");
    }

    let event: CreateEvent = {
      creator: session.data.user.id,
      title: title,
      description: description,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      location: location,
      link: link,
      public: false,
    };

    setLoading(true);
    endpoints.events
      .create(event, photo)
      .then((uploadedEvent) => {
        setLoading(false);
        toast.success("Created event successfully");
        router.push("/events");
        return;
      })
      .catch((e) => {
        toast.error(`Failed to create event: ${e}`);
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

  return (
    <>
      {loading && <Spinner />}
      {
        <div className="container m-auto flex flex-col">
          <div className="container m-auto flex flex-row flex-wrap justify-between">
            <div>
              <h1 className="py-3 text-5xl font-semibold">New Event</h1>
              <div></div>
            </div>
          </div>
          <p className="py-5  text-2xl font-semibold">Title</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Event Name..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p className="py-5  text-2xl font-semibold">Description</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="A short vision statement..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <p className="py-5  text-2xl font-semibold">Link </p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Link to event..."
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
          />

          <p className="py-5  text-2xl font-semibold">Location</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Place where the event will occur..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />

          <p className="py-5  text-2xl font-semibold">Start Time</p>
          <DatePicker
            className="bg-red"
            showIcon={true}
            showTimeSelect
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
          />

          <p className="py-5  text-2xl font-semibold">End Time</p>
          <DatePicker
            className="bg-red"
            showIcon={true}
            showTimeSelect
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
          />

          <p className="py-5  text-2xl font-semibold">Upload photo</p>
          <PhotoUploader
            uploadCroppedPhoto={(blob: Blob) => {
              setLoading(true);
              setPhoto(blob);
              setLoading(false);
            }}
            cancelUploadingCroppedPhoto={() => {
              setPhoto(null);
            }}
            xPixels={Event_PHOTO_X_PXL}
            yPixels={Event_PHOTO_Y_PXL}
          />

          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={handleConfirm}
          >
            Add event
          </button>
          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      }
    </>
  );
}
