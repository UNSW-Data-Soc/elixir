import { useContext, useEffect, useRef, useState } from "react";
import { type BlogBlock } from "./[slug]/page";
import ContentEditable from "react-contenteditable";
import { EditorContext } from "./blogContentEditor";

type BlogBlockTextProps = {
  id: BlogBlock["id"];
  type: Extract<BlogBlock, { content: string }>["type"];
  initialContent?: string;
};
const BlogBlockText = ({ id, type, initialContent = "" }: BlogBlockTextProps) => {
  // get necessary data from context
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("editorContext is not defined"); // TODO: error to make typescript happy
  const setBlockInfo = editorContext.setters.setBlockInfo;

  // set up state
  const content = useRef<string>(initialContent);
  const [showSwitchOption, setShowSwitchOption] = useState<boolean>(false);
  const [blockType, setBlockType] = useState<Extract<BlogBlock, { content: string }>["type"]>(type);

  useEffect(() => {
    setBlockInfo((prev) => {
      return {
        ...prev,
        [id]: { id, type: blockType, order: prev[id].order, content: content.current },
      };
    });
  }, [blockType, id, setBlockInfo]);

  const contentUnblur = () => {
    setBlockInfo((prev) => {
      return { ...prev, [id]: { id, type, order: prev[id].order, content: content.current } };
    });
  };

  return (
    <div
      className="flex flex-row gap-2 flex-grow w-full"
      onMouseOver={() => setShowSwitchOption(true)}
      // onMouseLeave={() => setShowSwitchOption(false)}
    >
      <ContentEditable
        html={content.current}
        onChange={(e) => (content.current = e.target.value)}
        onBlur={contentUnblur}
        className={`text-justify outline-none w-full focus:bg-[#f5f5f5] p-2 rounded-lg transition-all ${blogBlockTextStyle(
          type
        )}`}
      />
      <select
        className={`${showSwitchOption ? "block" : "hidden"} transition-all outline-none`}
        value={blockType}
        onChange={(e) =>
          setBlockType(e.target.value as Extract<BlogBlock, { content: string }>["type"])
        }
      >
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="p">p</option>
        <option value="quote">q</option>
      </select>
    </div>
  );
};

const blogBlockTextStyle = (type: Extract<BlogBlock, { content: string }>["type"]) => {
  switch (type) {
    case "h1":
      return "text-4xl font-bold";
    case "h2":
      return "text-3xl font-bold";
    case "h3":
      return "text-2xl font-bold";
    case "p":
      return "";
    case "quote":
      return "border-l-[4px] border-[#ddd] pl-3 py-2 rounded-none bg-[#eee]";
    default:
      return "";
  }
};

export default BlogBlockText;
