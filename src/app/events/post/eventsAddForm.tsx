"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { TITLES, LOREM } from "./formPlaceholders";
import { Converter } from "showdown";
import { endpoints } from "@/app/api/backend/endpoints";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function EventsAddForm() {
    const router = useRouter();
    const session = useSession();

    // placeholder states
    const [titleNum, setTitleNum] = useState<number>(
        Math.floor(Math.random() * TITLES.length)
    );

    const [photo, setPhoto] = useState<string>("");
    const [creator, setCreator] = useState<string>(session.data?.user.name ? session.data.user.name : "anonymous");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [start_date, setStartDate] = useState<string>("");
    const [end_date, setEndDate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [link, setLink] = useState<string>("");

    const converter = new Converter();
    const html = converter.makeHtml(description);

    const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const blog = await endpoints.events.create({ photo, creator, title, description, start_date, end_date, location, link });

        if (blog) {
            router.push("/events");
        }
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className="flex flex-col justify-center items-center gap-5 py-5 container h-full"
        >
            <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                <input
                    type="text"
                    placeholder={`/https://instagram.fcbr1-1.fna.fbcdn.net/v/t51.2885-19/101069689_1093661394367192_909996565207187456_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fcbr1-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=4-hMnODjQFAAX_DlRgT&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfDWZB9EjEe-5zaOWq_Oz86ECUREIC9rlKV5el46Sh9ceg&oe=64A261F4&_nc_sid=8b3546`} //"Who wrote this?"
                    className="outline-none py-3 px-5 text-lg w-full rounded-full"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                />
                <label className="font-bold text-[#ebb43e] tracking-wider py-2 px-4 rounded-full bg-[#ffe7b5] uppercase m-auto h-11 border-2 border-[#ebb43e]">
                    Photo
                </label>
            </div>
            <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                <input
                    type="text"
                    placeholder={`${TITLES[titleNum]}`} //"Give the blog a title..."
                    className="outline-none py-3 px-5 text-2xl sm:text-3xl w-full rounded-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label className="font-bold text-[#ff6c28] tracking-wider py-2 px-4 rounded-full bg-[#ffaf8a] uppercase m-auto h-11 border-2 border-[#ff6c28]">
                    Title
                </label>
            </div>
            <div className="w-full flex flex-row gap-5">
                <div className="w-6/12 flex flex-row justify-start gap-2 border-2 rounded-3xl hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                    <textarea
                        placeholder={LOREM}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="no-scrollbars min-h-[15rem] outline-none py-3 px-5 w-full rounded-xl h-full"
                    ></textarea>
                    <label className="font-bold text-[#96659e] tracking-wider py-2 px-4 rounded-full bg-[#c3a4c7] uppercase h-11 mt-1 border-2 border-[#96659e]">
                        Description
                    </label>
                </div>
                <div className="w-6/12 flex flex-row justify-start gap-2 border-2 rounded-3xl hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-scroll no-scrollbars">
                    <div
                        className="m-0 no-scrollbars min-h-[15rem] outline-none py-3 px-5 w-full rounded-xl h-full markdown"
                        dangerouslySetInnerHTML={{ __html: html }}
                    ></div>
                    <label className="font-bold text-[#62bc4c] tracking-wider py-2 px-4 rounded-full bg-[#b7ffa4] uppercase h-11 mt-1 border-2 border-[#62bc4c]">
                        Preview
                    </label>
                </div>
            </div>
            <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                <input
                    type="text"
                    placeholder={"2023-06-29T20:49:42.189Z"}
                    className="outline-none py-3 px-5 text-2xl sm:text-3xl w-full rounded-full"
                    value={start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label className="font-bold text-[#ff6c28] tracking-wider py-2 px-4 rounded-full bg-[#ffaf8a] uppercase m-auto h-11 border-2 border-[#ff6c28]">
                    Start
                </label>
            </div>
            <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                <input
                    type="text"
                    placeholder={"2023-06-29T20:49:42.189Z"}
                    className="outline-none py-3 px-5 text-2xl sm:text-3xl w-full rounded-full"
                    value={end_date}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <label className="font-bold text-[#ff6c28] tracking-wider py-2 px-4 rounded-full bg-[#ffaf8a] uppercase m-auto h-11 border-2 border-[#ff6c28]">
                    End
                </label>
            </div>
            <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                <input
                    type="text"
                    placeholder={"where is it held?"}
                    className="outline-none py-3 px-5 text-2xl sm:text-3xl w-full rounded-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <label className="font-bold text-[#ff6c28] tracking-wider py-2 px-4 rounded-full bg-[#ffaf8a] uppercase m-auto h-11 border-2 border-[#ff6c28]">
                    Location
                </label>
            </div>
            <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
                <input
                    type="text"
                    placeholder={`https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
                    className="outline-none py-3 px-5 text-lg w-full rounded-full"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <label className="font-bold text-[#ebb43e] tracking-wider py-2 px-4 rounded-full bg-[#ffe7b5] uppercase m-auto h-11 border-2 border-[#ebb43e]">
                    Link
                </label>
            </div>
            <input
                type="submit"
                value="All done!"
                className="text-white px-5 py-4 rounded-xl shadow-lg bg-sky-500 cursor-pointer hover:bg-sky-600 transition-all focus:shadow-none font-bold uppercase tracking-wider"
            />
        </form>
    );
}
