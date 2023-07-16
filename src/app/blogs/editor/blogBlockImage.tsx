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

  if (!imageInfo.url && !imageInfo.imageId) {
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

  if (imageInfo.imageId && imageInfo.imageId.length > 0) {
  }

  return (
    <div
      className="w-full flex flex-row justify-between relative"
      onMouseOver={() => setShowImageEditButton(true)}
      onMouseLeave={() => setShowImageEditButton(false)}
    >
      {/* <div className="w-full p-2">
        url is {imageInfo.url} and caption is {imageInfo.caption}
      </div> */}
      {!!imageInfo.url && (
        <div className="mx-auto" style={{ width: `${imageInfo.width}%` }}>
          <img
            src={imageInfo.url}
            alt={imageInfo.caption ?? ""}
            className={`mt-5 w-full ${imageInfo.caption ? "mb-1" : "mb-5"} text-${
              imageInfo.alignment
            }`}
          />
          {!!imageInfo.caption && <p className="text-[#555] italic mb-5">{imageInfo.caption}</p>}
        </div>
      )}
      {!!imageInfo.imageId && !imageInfo.url && (
        <>
          <p className="italic bg-[#eee]">Image Uploaded. See preview to view.</p>
          {!!imageInfo.caption && <p className="text-[#555] italic mb-5">{imageInfo.caption}</p>}
        </>
      )}
      <button
        className={`uppercase tracking-wide text-xl absolute w-full h-full bg-[#eeec] transition-all ${
          showImageEditButton ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setShowImageEditor(true)}
      >
        edit
      </button>
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
  const [imageWidth, setImageWidth] = useState<number>(imageInfo.width);
  const [imageId, setImageId] = useState<string>(imageInfo.imageId ?? "");

  const clickAwayRef = useClickAway(() => setShow(false));

  console.log("IMAGE BLOCK ID IS", id);

  const updateImage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setBlockInfo((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          url: imageUrl,
          caption: imageCaption,
          width: imageWidth,
          imageId,
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
        <BlogBlockImageUploader id={id} />
        <label htmlFor="url">(DEV USE ONLY) Image Id</label>
        <input
          type="text"
          name="url"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          className="p-2 border rounded-lg outline-none focus:border-[#333] transition-all"
        />
        <p className="text-center"> --- OR --- </p>
        <label htmlFor="url">Image URL</label>
        <input
          type="text"
          name="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="p-2 border rounded-lg outline-none focus:border-[#333] transition-all"
        />
        <hr className="my-5" />
        <label htmlFor="url">Image Caption</label>
        <input
          type="text"
          name="url"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          className="p-2 border rounded-lg outline-none focus:border-[#333] transition-all"
          placeholder="image caption (optional)"
        />
        <hr className="my-5" />
        <label htmlFor="url">Image Width (%)</label>
        <input
          type="number"
          name="width"
          value={imageWidth.toString()}
          onChange={(e) => setImageWidth(parseInt(e.target.value))}
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

const BlogBlockImageUploader = ({ id }: { id: string }) => {
  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("EditorContext not found"); // make typescript happy
  const blogId = editorContext.getters.blogId;
  const blockInfo = editorContext.getters.blockInfo[id];
  if (!blockInfo || blockInfo.type !== "image") throw new Error("Block is not an image"); // make typescript happy
  const setBlockInfo = editorContext.setters.setBlockInfo;

  const [imageId, setImageId] = useState<string>(blockInfo.imageId ?? "");

  useEffect(() => {
    setBlockInfo((prev) => {
      return {
        ...prev,
        [id]: { ...prev[id], imageId },
      };
    });
  }, [id, imageId, setBlockInfo]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files
      const imageRes = await endpoints.blogs.image.upload({
        blogId,
        file: acceptedFiles[0],
      });
      console.log(imageRes);
      setImageId(imageRes.id);
    },
    [blogId]
  );
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
