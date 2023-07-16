import sanitizeHtml from "sanitize-html";

import { BlogBlock } from "../editor/blogContentEditor";
import Image from "next/image";

export default function BlogContent({ content }: { content: BlogBlock[] }) {
  const contentJSX = content.map((block) => {
    if (!block) return <></>;

    switch (block.type) {
      case "h1":
        return (
          <div
            className="w-full text-4xl font-bold mt-3"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
          ></div>
        );
      case "h2":
        return (
          <div
            className="w-full text-3xl font-bold mt-2"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
          ></div>
        );
      case "h3":
        return (
          <div
            className="w-full text-3xl font-bold mt-1"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
          ></div>
        );
      case "p":
        return (
          <div
            key={block.id}
            className="text-justify font-light"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
          ></div>
        );
      case "quote":
        return (
          <div
            className="w-full border-l-[4px] border-[#ddd] pl-3 py-2 rounded-none bg-[#eee]"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
          ></div>
        );
      case "image":
        // TODO get from database if id set but not url
        return (
          <div className="relative mx-auto" style={{ width: `${block.width}%` }}>
            {/* <Image
              key={block.id}
              src={block.url ?? ""} // TODO: fix this
              alt={block.caption ?? ""}
              className={`mt-5 ${block.caption ? "" : "mb-5"}`}
              fill
            /> */}
            <img
              key={block.id}
              src={block.url ?? ""} // TODO: fix this
              alt={block.caption ?? ""}
              className={`mt-5 w-full ${block.caption ? "mb-1" : "mb-5"} text-${block.alignment}`}
            />
            {!!block.caption && <p className="text-[#555] italic mb-5">{block.caption}</p>}
          </div>
        );
      default:
        return <div key={block.id}>UNKNOWN BLOCK TYPE</div>;
    }
  });

  return (
    <div className="py-5">
      <div className="flex flex-col gap-2">{contentJSX}</div>
    </div>
  );
}

// const BlogText = ({
//   id,
//   type,
//   content,
// }: {
//   id: BlogBlock["id"];
//   type: Extract<BlogBlock, { content: string }>["type"];
//   content: string;
// }) => {};
