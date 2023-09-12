import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EditorContext } from "./blogContentEditor";
import useClickAway from "@/app/hooks/useClickAway";
import { endpoints } from "@/app/api/backend/endpoints";

export default function BlogBlockEmbed({
  id,
  initialContent,
}: {
  id: string;
  initialContent: string | null;
}) {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("EditorContext not found"); // make typescript happy

  const embedInfo = editorContext.getters.blockInfo[id];
  if (embedInfo.type !== "embed") throw new Error("Block is not an embed"); // make typescript happy

  const [showEmbedEditor, setShowEmbedEditor] = useState<boolean>(false);
  const [showEmbedEditButton, setShowEmbedEditButton] = useState<boolean>(false);

  return (
    <div
      className="w-full flex flex-row justify-between relative"
      onMouseOver={() => setShowEmbedEditButton(true)}
      onMouseLeave={() => setShowEmbedEditButton(false)}
    >
      {/* {!!initialContent && <div className="mx-auto">{initialContent}</div>} */}
      {!!initialContent && (
        <div className="mx-auto" dangerouslySetInnerHTML={{ __html: initialContent }}></div>
      )}
      <button
        className={`uppercase tracking-wide text-xl absolute w-full h-full bg-[#eeec] transition-all ${
          showEmbedEditButton ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setShowEmbedEditor(true)}
      >
        edit
      </button>
      {!!showEmbedEditor && <BlogBlockEmbedEditor id={id} setShow={setShowEmbedEditor} />}
    </div>
  );
}

const BlogBlockEmbedEditor = ({
  id,
  setShow,
}: {
  id: string;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("EditorContext not found"); // make typescript happy
  const embedInfo = editorContext.getters.blockInfo[id];
  if (embedInfo.type !== "embed") throw new Error("Block is not an image"); // make typescript happy
  const setBlockInfo = editorContext.setters.setBlockInfo;

  const [embedScript, setEmbedScript] = useState<string>(embedInfo.script ?? "");

  const clickAwayRef = useClickAway(() => setShow(false));

  const updateImage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setBlockInfo((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          script: embedScript.length > 0 ? embedScript : null,
        },
      };
    });
    setShow(false);
  };

  return (
    <div className="fixed w-full h-full z-50 bg-[#555a] top-0 left-0 backdrop-blur-sm p-20 flex items-center justify-center">
      <form
        className="flex flex-col gap-3 min-w-[600px] min-h-[500px] p-10 bg-white rounded-xl shadow-lg"
        onSubmit={updateImage}
        ref={clickAwayRef}
      >
        <label htmlFor="url" className="text-lg">
          paste embed html code here:
        </label>
        <textarea
          className="flex-grow outline-none border p-5"
          value={embedScript}
          onChange={(e) => setEmbedScript(e.target.value)}
        ></textarea>
        <input
          type="submit"
          className="cursor-pointer my-3 p-2 bg-[#eee] rounded-lg hover:bg-[#ddd] transition-all"
        />
      </form>
    </div>
  );
};
