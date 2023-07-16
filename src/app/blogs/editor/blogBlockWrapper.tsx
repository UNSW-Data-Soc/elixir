import { useContext, useEffect, useRef, useState } from "react";
import { BlogBlock, textBlockTypes } from "./[slug]/page";
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
      className="items-center relative flex flex-row gap-2 w-full sm:ml-[10%] md:ml-[12.5%] lg:ml-[17.5%] xl:ml-[20%] 2xl:ml-[30%]"
      onMouseOver={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="sm:px-0 sm:w-[80%] md:w-[75%] lg:w-[65%] xl:w-[60%] 2xl:w-[40%]">
        {blockComponent}
      </div>
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
    <div ref={clickAwayRef} className="relative">
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

  const moveBlockUp = () => {
    setBlockInfo((prev) => {
      const blockOrder = prev[id].order;
      const prevOrder = Math.max(
        ...Object.values(prev)
          .map((block) => block.order)
          .filter((order) => order < blockOrder)
      );
      const prevId = Object.keys(prev).find((key) => prev[key].order === prevOrder);
      if (!prevId) return prev;
      const temp = prev[prevId].order;
      prev[prevId].order = prev[id].order;
      prev[id].order = temp;
      return prev;
    });
  };

  const moveBlockDown = () => {
    setBlockInfo((prev) => {
      const blockOrder = prev[id].order;
      const nextOrder = Math.max(
        ...Object.values(prev)
          .map((block) => block.order)
          .filter((order) => order > blockOrder)
      );
      const nextId = Object.keys(prev).find((key) => prev[key].order === nextOrder);
      if (!nextId) return prev;
      const temp = prev[nextId].order;
      prev[nextId].order = prev[id].order;
      prev[id].order = temp;
      return prev;
    });
  };

  return (
    <div className="absolute left-[100%] top-[0%] ml-2 z-30 shadow-md border-[#ddd] bg-white border rounded-md overflow-hidden active:scale-95 transition-all">
      <button
        className="bg-[#eee] hover:bg-[#e3e3e3] py-2 px-5 transition-all"
        onClick={deleteBlock}
      >
        delete
      </button>
      <button
        className="bg-[#eee] hover:bg-[#e3e3e3] py-2 px-5 transition-all"
        onClick={moveBlockUp}
      >
        move up
      </button>
      <button
        className="bg-[#eee] hover:bg-[#e3e3e3] py-2 px-5 transition-all"
        onClick={moveBlockDown}
      >
        move down
      </button>
    </div>
  );
};

export default BlogBlockWrapper;
