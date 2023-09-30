"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EventAddCard from "./eventAddCard";
import EventList from "./eventList";

export default function EventRoot() {
    return (
        <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
            <EventAddCard />
            <EventList />
        </div>
    );
}
