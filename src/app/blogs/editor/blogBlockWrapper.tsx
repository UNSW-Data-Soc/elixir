import { useContext, useEffect, useRef, useState } from "react";
import { BlogBlock, textBlockTypes } from "./blogContentEditor";
import { EditorContext } from "./blogContentEditor";
import BlogBlockText from "./blogBlockText";
import useClickAway from "@/app/hooks/useClickAway";
import BlogBlockImage from "./blogBlockImage";

type BlogBlockProps = {
  id: BlogBlock["id"];
};

const BlogBlockWrapper = ({ id }: BlogBlockProps) => {
  console.log("ALKSDJHNKASJD", id);
  // get necessary data from context
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("editorContext is not defined"); // TODO: error to make typescript happy
  const blockInfo = editorContext.getters.blockInfo[id];

  // states
  const [showMenu, setShowMenu] = useState<boolean>(false);

  let blockComponent = <p>UNKNOWN BLOCK TYPE</p>;
  if (!blockInfo) return <p>ERROR: UNDEFINED BLOCK</p>;
  switch (blockInfo.type) {
    case "h1":
      blockComponent = (
        <BlogBlockText key={id} id={id} type="h1" initialContent={blockInfo.content} />
      );
      break;
    case "h2":
      blockComponent = (
        <BlogBlockText key={id} id={id} type="h2" initialContent={blockInfo.content} />
      );
      break;
    case "h3":
      blockComponent = (
        <BlogBlockText key={id} id={id} type="h3" initialContent={blockInfo.content} />
      );
      break;
    case "p":
      blockComponent = (
        <BlogBlockText key={id} id={id} type="p" initialContent={blockInfo.content} />
      );
      break;
    case "quote":
      blockComponent = (
        <BlogBlockText key={id} id={id} type="quote" initialContent={blockInfo.content} />
      );
      break;
    case "image":
      blockComponent = <BlogBlockImage key={id} id={id} initialUrl={blockInfo.url} />;
      break;
    default:
      break;
  }

  return (
    <div
      className="items-center relative flex flex-row gap-2"
      onMouseOver={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {blockComponent}
      <BlogBlockMenuToggle id={id} show={showMenu} />
    </div>
  );
};

const BlogBlockMenuToggle = ({ id, show }: { id: string; show: boolean }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log(showMenu);
  // }, [showMenu]);

  const clickAwayRef = useClickAway(() => setShowMenu(false));

  return (
    <div ref={clickAwayRef}>
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className={`${
          show || showMenu ? "flex" : "hidden"
        } flex-grow-0 top-0 bottom-0 align-middle justify-center items-center ${
          showMenu ? "bg-[#eee]" : "hover:bg-[#eee]"
        } px-2 py-1 rounded-xl transition-all`}
      >
        ::
      </button>
      {!!showMenu && <BlogBlockMenu id={id} />}
      {/* <BlogBlockMenu id={id} /> */}
    </div>
  );
};

const BlogBlockMenu = ({ id }: { id: string }) => {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("editorContext is not defined"); // TODO: error to make typescript happy
  const setBlockInfo = editorContext.setters.setBlockInfo;

  const deleteBlock = () => {
    setBlockInfo((prev) => {
      delete prev[id];
      return prev;
    });
  };
  console.log(id);
  return (
    <div className="absolute left-[100%] top-[0%] ml-2 z-30 shadow-md border-[#ddd] bg-white border rounded-md overflow-hidden active:scale-95 transition-all">
      <button
        className="bg-[#eee] hover:bg-[#e3e3e3] py-2 px-5 transition-all"
        onClick={deleteBlock}
      >
        delete
      </button>
      <button className="bg-[#eee] hover:bg-[#e3e3e3] py-2 px-5 transition-all">
        other action
      </button>
      <button className="bg-[#eee] hover:bg-[#e3e3e3] py-2 px-5 transition-all">
        other action
      </button>
    </div>
  );
};

export default BlogBlockWrapper;
