import { BlogBlock } from "../editor/blogContentEditor";

export default function BlogContent({ content }: { content: BlogBlock[] }) {
  console.log(content);
  const contentJSX = content.map((block) => {
    if (!block) return <></>;
    switch (block.type) {
      case "h1":
        return (
          <h1
            className="w-full text-4xl font-bold"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: block.content }}
          ></h1>
        );
      case "h2":
        return (
          <h2
            className="w-full text-3xl font-bold"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: block.content }}
          ></h2>
        );
      case "h3":
        return (
          <h3
            className="w-full text-3xl font-bold"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: block.content }}
          ></h3>
        );
      case "p":
        return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.content }}></p>;
      case "quote":
        return (
          <blockquote
            className="w-full border-l-[4px] border-[#ddd] pl-3 py-2 rounded-none bg-[#eee]"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: block.content }}
          ></blockquote>
        );
      case "image":
        // TODO get from database if id set but not url
        return <img key={block.id} src={block.url} alt={block.caption} />;
      default:
        return <div key={block.id}>UNKNONW BLOCK TYPE</div>;
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
