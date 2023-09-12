"use client";

import { createContext, useEffect } from "react";
import toast from "react-hot-toast";
import BlogBlockWrapper from "./blogBlockWrapper";
import { useSessionStorage } from "usehooks-ts";
import { endpoints } from "@/app/api/backend/endpoints";
import { BlogBlock } from "./[slug]/page";
import { useSession } from "next-auth/react";

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

const BlogContentEditor = ({ blogSlug }: { blogSlug: string }) => {
  const [blockInfo, setBlockInfo] = useSessionStorage<{ [key: string]: BlogBlock }>(
    `blog-content-${blogSlug}`,
    {}
  );

  const [blogId, setBlogId] = useSessionStorage<string>(`blog-id-${blogSlug}`, "");
  const [blogTitle, setBlogTitle] = useSessionStorage<string>(`blog-title-${blogSlug}`, "");
  const [blogAuthor, setBlogAuthor] = useSessionStorage<string>(`blog-author-${blogSlug}`, "");
  const [blogPublic, setBlogPublic] = useSessionStorage<boolean>(`blog-public-${blogSlug}`, false);

  useEffect(() => {
    const getBlog = async () => {
      const blog = await endpoints.blogs.get({ slug: blogSlug, authRequired: true });
      return blog;
    };

    getBlog().then((blog) => {
      setBlogId(blog.id);
      setBlogTitle(blog.title);
      setBlogAuthor(blog.author);
      setBlockInfo(JSON.parse(blog.body));
      setBlogPublic(blog.public);
    });
  }, [blogId, blogSlug, setBlockInfo, setBlogAuthor, setBlogId, setBlogPublic, setBlogTitle]);

  // on change of content, send data to backend
  useEffect(() => {
    const updateDatabase = async () => {
      await endpoints.blogs.update({
        id: blogId,
        body: JSON.stringify(blockInfo),
        author: blogAuthor,
        title: blogTitle,
        blogPublic,
      });
    };
    console.log(blockInfo);
    toast.loading("Saving...", { id: "saving" });

    updateDatabase().then(() => {
      setTimeout(() => {
        toast.dismiss("saving");
      }, 500);
    });
  }, [blogId, blockInfo, blogAuthor, blogTitle, blogPublic]);

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
          width: 100, // default image width as a percentage
          alignment: "center",
        },
      };
    });
  };

  const addEmbedBlock = () => {
    const blockId = crypto.randomUUID();
    setBlockInfo((prev) => ({
      ...prev,
      [blockId]: {
        id: blockId,
        type: "embed",
        script: null,
        order: (Math.max(...Object.values(blockInfo).map((b) => b.order)) ?? 0) + 1,
      },
    }));
  };

  return (
    <EditorContext.Provider value={editorContext}>
      <div className="sm:px-0 sm:w-[80%] md:w-[75%] lg:w-[65%] xl:w-[60%] 2xl:w-[40%] mx-auto mb-10">
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setBlogTitle(e.target.value)}
          className="w-full text-6xl font-light tracking-tighter outline-none border border-transparent hover:border-[#eee] p-3 focus:border-[#aaa] transition-all"
          value={blogTitle}
        />
        <input
          type="text"
          placeholder="author"
          onChange={(e) => setBlogAuthor(e.target.value)}
          className="w-full text-[#555] text-xl font-light p-3 outline-none border border-transparent hover:border-[#eee] focus:border-[#aaa] transition-all"
          value={blogAuthor}
        />
      </div>
      <div className="flex flex-col gap-2">
        {Object.values(blockInfo)
          .sort((a, b) => a.order - b.order)
          .map((blog) => blogBlockToComponent(blog))}
        <div className="flex gap-2 sm:px-0 sm:w-[80%] md:w-[75%] lg:w-[65%] xl:w-[60%] 2xl:w-[40%] mx-auto my-10">
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
          <button
            className="p-3 w-full border rounded-lg font-light text-[#ddd] hover:text-[#333] hover:border-[#333] transition-all text-2xl"
            onClick={addEmbedBlock}
          >
            + {"</>"}
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
