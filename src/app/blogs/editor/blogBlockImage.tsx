import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { EditorContext } from "./blogContentEditor";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import useClickAway from "@/app/hooks/useClickAway";
import { endpoints } from "@/app/api/backend/endpoints";

export default function BlogBlockImage({
  id,
}: {
  id: string;
  initialUrl?: string;
  initialCaption?: string;
}) {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("EditorContext not found"); // make typescript happy
  const imageInfo = editorContext.getters.blockInfo[id];
  if (imageInfo.type !== "image") throw new Error("Block is not an image"); // make typescript happy

  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [showImageEditButton, setShowImageEditButton] = useState<boolean>(false);

  if (!imageInfo.url) {
    return (
      <>
        <button
          className="p-2 w-full flex flex-row gap-3 items-center bg-[#eee] hover:bg-[#ddd] transition-all rounded-lg"
          onClick={() => setShowImageEditor(true)}
        >
          <p className="italic">No image uploaded.</p>
          <p>Click to upload image.</p>
        </button>
        {!!showImageEditor && <BlogBlockImageEditor id={id} setShow={setShowImageEditor} />}
      </>
    );
  }

  return (
    <div
      className="w-full flex flex-row justify-between"
      onMouseOver={() => setShowImageEditButton(true)}
      onMouseLeave={() => setShowImageEditButton(false)}
    >
      {/* <div className="w-full p-2">
        url is {imageInfo.url} and caption is {imageInfo.caption}
      </div> */}
      <img src={imageInfo.url} className="w-[80%]" alt={imageInfo.caption ?? ""} />
      {!!showImageEditButton && <button onClick={() => setShowImageEditor(true)}>edit</button>}
      {!!showImageEditor && <BlogBlockImageEditor id={id} setShow={setShowImageEditor} />}
    </div>
  );
}

const BlogBlockImageEditor = ({
  id,
  setShow,
}: {
  id: string;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("EditorContext not found"); // make typescript happy
  const imageInfo = editorContext.getters.blockInfo[id];
  if (imageInfo.type !== "image") throw new Error("Block is not an image"); // make typescript happy
  const setBlockInfo = editorContext.setters.setBlockInfo;

  const [imageUrl, setImageUrl] = useState<string>(imageInfo.url ?? "");
  const [imageCaption, setImageCaption] = useState<string>(imageInfo.caption ?? "");

  const clickAwayRef = useClickAway(() => setShow(false));

  const updateImage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setBlockInfo((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          url: imageUrl,
          caption: imageCaption,
        },
      };
    });
    setShow(false);
  };

  return (
    <div className="fixed w-full h-full z-50 bg-[#555a] top-0 left-0 backdrop-blur-sm p-20 flex items-center justify-center">
      <form
        className="flex flex-col gap-3 p-10 bg-white rounded-xl shadow-lg"
        onSubmit={updateImage}
        ref={clickAwayRef}
      >
        <label htmlFor="url">Image Upload</label>
        <BlogBlockImageUploader />
        <p className="text-center"> --- OR --- </p>
        <label htmlFor="url">Image URL</label>
        <input
          type="text"
          name="url"
          id="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="p-2 border rounded-lg outline-none focus:border-[#333] transition-all"
        />
        <hr className="my-5" />
        <label htmlFor="url">Image Caption</label>
        <input
          type="text"
          name="url"
          id="url"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          className="p-2 border rounded-lg outline-none focus:border-[#333] transition-all"
          placeholder="image caption (optional)"
        />
        <input
          type="submit"
          className="cursor-pointer my-3 p-2 bg-[#eee] rounded-lg hover:bg-[#ddd] transition-all"
        />
      </form>
    </div>
  );
};

const BlogBlockImageUploader = () => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const imageRes = await endpoints.blogs.image.upload({
      blogId: "TODO: CHANGE THIS",
      file: acceptedFiles[0],
    });
    console.log(imageRes);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="w-full bg-[#fafafa] p-10 text-center border-4 rounded-xl">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag &apos;n&apos; drop an image here, or click to select files</p>
      )}
    </div>
  );
};
