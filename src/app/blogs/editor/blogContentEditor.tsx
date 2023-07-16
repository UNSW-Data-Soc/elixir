import { createContext, useEffect } from "react";
import toast from "react-hot-toast";
import BlogBlockWrapper from "./blogBlockWrapper";
import { useSessionStorage } from "usehooks-ts";
import { endpoints } from "@/app/api/backend/endpoints";

export const textBlockTypes = ["h1", "h2", "h3", "p", "quote"] as const;
type TextBlockType = (typeof textBlockTypes)[number];

export type BlogBlock = {
  id: string;
  order: number;
} & (
  | {
      type: "image";
      caption?: string;
      imageId?: string;
      url?: string;
      width: number;
    }
  | {
      type: TextBlockType;
      content: string;
    }
  | {
      type: "embed";
      script: string;
    }
  | {
      type: "divider";
    }
);

export type EditorContext = {
  getters: {
    blockInfo: { [key: string]: BlogBlock };
    blogId: string;
  };
  setters: {
    setBlockInfo: React.Dispatch<React.SetStateAction<{ [key: string]: BlogBlock }>>;
  };
};

export const EditorContext = createContext<EditorContext | null>(null);

const BlogContentEditor = ({ blogId }: { blogId: string }) => {
  const [blockInfo, setBlockInfo] = useSessionStorage<{ [key: string]: BlogBlock }>(
    `blog-content-${blogId}`,
    {}
  );

  const [blogTitle, setBlogTitle] = useSessionStorage<string>(`blog-title-${blogId}`, "");
  const [blogAuthor, setBlogAuthor] = useSessionStorage<string>(`blog-author-${blogId}`, "");

  useEffect(() => {
    const getBlog = async () => {
      const blog = await endpoints.blogs.get({ blogId });
      return blog;
    };

    getBlog().then((blog) => {
      setBlogTitle(blog.title);
      setBlogAuthor(blog.author);
      setBlockInfo(JSON.parse(blog.body));
    });
  }, [blogId, setBlockInfo, setBlogAuthor, setBlogTitle]);

  // on change of content, send data to backend
  useEffect(() => {
    const updateDatabase = async () => {
      await endpoints.blogs.update({
        id: blogId,
        body: JSON.stringify(blockInfo),
        author: blogAuthor,
        title: blogTitle,
      });
    };
    console.log(blockInfo);
    toast.loading("Saving...", { id: "saving" });

    updateDatabase().then(async () => {
      toast.dismiss("saving");
    });
  }, [blogId, blockInfo, blogAuthor, blogTitle]);

  // create editor context
  const editorContext = {
    getters: {
      blockInfo,
      blogId,
    },
    setters: {
      setBlockInfo,
    },
  };

  const addTextBlock = () => {
    const blockId = crypto.randomUUID();
    setBlockInfo((prev) => {
      return {
        ...prev,
        [blockId]: {
          id: blockId,
          type: "p",
          order: (Math.max(...Object.values(blockInfo).map((b) => b.order)) ?? 0) + 1,
          content: "",
        },
      };
    });
  };

  const addImgBlock = () => {
    const blockId = crypto.randomUUID();
    setBlockInfo((prev) => {
      return {
        ...prev,
        [blockId]: {
          id: blockId,
          type: "image",
          order: (Math.max(...Object.values(blockInfo).map((b) => b.order)) ?? 0) + 1,
          width: 80, // default image width
        },
      };
    });
  };

  return (
    <EditorContext.Provider value={editorContext}>
      <input
        type="text"
        placeholder="title"
        onChange={(e) => setBlogTitle(e.target.value)}
        className="text-4xl w-full border-b border-black py-3 outline-none mb-4"
        value={blogTitle}
      />
      <input
        type="text"
        placeholder="author"
        onChange={(e) => setBlogAuthor(e.target.value)}
        className="text-xl w-full border-b border-black py-2 outline-none mb-4"
        value={blogAuthor}
      />
      <div className="flex flex-col gap-2">
        {Object.values(blockInfo)
          .sort((a, b) => a.order - b.order)
          .map((blog) => blogBlockToComponent(blog))}
        <div className="flex gap-2">
          <button
            className="p-3 w-full border rounded-lg font-light text-[#ddd] hover:text-[#333] hover:border-[#333] transition-all text-2xl"
            onClick={addTextBlock}
          >
            + T
          </button>
          <button
            className="p-3 w-full border rounded-lg font-light text-[#ddd] hover:text-[#333] hover:border-[#333] transition-all text-2xl"
            onClick={addImgBlock}
          >
            + Img
          </button>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

const blogBlockToComponent = (block: BlogBlock) => {
  console.log("AHHH", block);
  return <BlogBlockWrapper id={block.id} key={block.id} />;
};

export default BlogContentEditor;
