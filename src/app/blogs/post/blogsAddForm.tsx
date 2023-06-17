"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { HEADLINES, LOREM, NAMES } from "./formPlaceholders";
import { Converter } from "showdown";

export function BlogsAddForm() {
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED");
  };

  const [headlineNum, setHeadlineNum] = useState<number>(
    Math.floor(Math.random() * HEADLINES.length)
  );
  const [nameNum, setNameNum] = useState<number>(Math.floor(Math.random() * NAMES.length));
  const [body, setBody] = useState<string>("");

  const converter = new Converter();
  const html = converter.makeHtml(body);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeadlineNum(Math.floor(Math.random() * HEADLINES.length));
      setNameNum(Math.floor(Math.random() * NAMES.length));
    }, 2500);
    return () => clearTimeout(timer);
  }, [headlineNum, nameNum]);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col justify-center items-center gap-5 py-5 container h-full"
    >
      <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
        <input
          type="text"
          placeholder={`${HEADLINES[headlineNum]}`} //"Give the blog a title..."
          className="outline-none py-3 px-5 text-2xl sm:text-3xl w-full rounded-full"
        />
        <label className="font-bold text-[#ff6c28] tracking-wider py-2 px-4 rounded-full bg-[#ffaf8a] uppercase m-auto h-11 border-2 border-[#ff6c28]">
          Title
        </label>
      </div>
      <div className="w-full flex gap-2 border-2 rounded-full hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
        <input
          type="text"
          placeholder={`${NAMES[nameNum]}`} //"Who wrote this?"
          className="outline-none py-3 px-5 text-lg w-full rounded-full"
        />
        <label className="font-bold text-[#ebb43e] tracking-wider py-2 px-4 rounded-full bg-[#ffe7b5] uppercase m-auto h-11 border-2 border-[#ebb43e]">
          Author
        </label>
      </div>
      <div className="w-full flex flex-row gap-5">
        <div className="w-6/12 flex flex-row justify-start gap-2 border-2 rounded-3xl hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
          <textarea
            placeholder={LOREM}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="no-scrollbars h-[30rem] outline-none py-3 px-5 w-full rounded-xl min-h-fit"
          ></textarea>
          <label className="font-bold text-[#96659e] tracking-wider py-2 px-4 rounded-full bg-[#c3a4c7] uppercase h-11 mt-1 border-2 border-[#96659e]">
            Body
          </label>
        </div>
        <div className="w-6/12 flex flex-row justify-start gap-2 border-2 rounded-3xl hover:border-slate-400 transition-all py-2 ps-2 pe-4 overflow-hidden">
          <div
            className="no-scrollbars h-[30rem] outline-none py-3 px-5 w-full rounded-xl min-h-fit markdown-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
          <label className="font-bold text-[#62bc4c] tracking-wider py-2 px-4 rounded-full bg-[#b7ffa4] uppercase h-11 mt-1 border-2 border-[#62bc4c]">
            Preview
          </label>
        </div>
      </div>
      <input
        type="submit"
        value="All done!"
        className="text-white px-5 py-4 rounded-xl shadow-lg bg-sky-500 cursor-pointer hover:bg-sky-600 transition-all focus:shadow-none font-bold uppercase tracking-wider"
      />
    </form>
  );
}
