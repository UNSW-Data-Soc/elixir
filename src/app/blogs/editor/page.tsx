"use client";

import { randomUUID } from "crypto";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { toast } from "react-hot-toast";

type BlogBlock = {
  id: string;
  order: number;
} & (
  | {
      type: "image";
      url: string;
    }
  | {
      type: "h1" | "h2" | "h3" | "p" | "quote";
      content: string;
    }
  | {
      type: "embed";
      script: string;
    }
);

export default function BlogsEditor() {
  const router = useRouter();
  const session = useSession();

  const blogTitle = useRef<string>("");
  const blogAuthor = useRef<string>("");
  const blogContent = useRef<BlogBlock[]>([]);

  blogContent.current[0];

  if (session.status === "loading") return <div>Loading...</div>;
  // redirect use if unauthenticated
  if (session.status === "unauthenticated" || !session.data?.user.admin) {
    router.push("/auth/login");
  }

  return (
    <main className="2xl:max-w-[40%] mx-auto py-12">
      <input
        type="text"
        placeholder="title"
        onBlur={(e) => (blogTitle.current = e.target.value)}
        className="text-4xl w-full border-b border-black py-3 outline-none mb-4"
      />
      <input
        type="text"
        placeholder="author"
        onBlur={(e) => (blogAuthor.current = e.target.value)}
        className="text-xl w-full border-b border-black py-2 outline-none mb-4"
      />
      <BlogContentEditor />
    </main>
  );
}

const BlogContentEditor = () => {
  const [blockInfo, setBlockInfo] = useState<{ [key: string]: BlogBlock }>({});

  // on change of content, send data to backend
  useEffect(() => {
    const updateDatabase = async () => {
      setTimeout(() => {}, 3000);
    };
    console.log(blockInfo);
    toast.loading("Saving...", { id: "saving" });

    updateDatabase().then(() => {
      toast.dismiss("saving");
    });
  }, [blockInfo]);

  const addBlock = () => {
    const blockId = crypto.randomUUID();
    setBlockInfo((prev) => {
      return {
        ...prev,
        [blockId]: { id: blockId, type: "p", order: Object.keys(blockInfo).length, content: "" },
      };
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.values(blockInfo)
        .sort((a, b) => a.order - b.order)
        .map((blog) => blogBlockToComponent(blog, setBlockInfo))}
      <button
        className="p-3 w-full border rounded-lg font-light text-[#ddd] hover:text-[#333] hover:border-[#333] transition-all text-2xl"
        onClick={addBlock}
      >
        +
      </button>
    </div>
  );
};

const blogBlockToComponent = (
  block: BlogBlock,
  setBlockInfo: React.Dispatch<React.SetStateAction<{ [key: string]: BlogBlock }>>
) => {
  if (
    block.type === "p" ||
    block.type === "h1" ||
    block.type === "h2" ||
    block.type === "h3" ||
    block.type === "quote"
  ) {
    return (
      <BlogBlockText
        key={block.id}
        id={block.id}
        type={block.type}
        setBlockInfo={setBlockInfo}
        initialContent={block.content}
      />
    );
  }
};

type BlogBlockTextProps = {
  id: BlogBlock["id"];
  type: Extract<BlogBlock, { content: string }>["type"];
  initialContent?: string;
  setBlockInfo: React.Dispatch<React.SetStateAction<{ [key: string]: BlogBlock }>>;
};
const BlogBlockText = ({ id, type, setBlockInfo, initialContent = "" }: BlogBlockTextProps) => {
  const content = useRef<string>(initialContent);

  const updateContent = () => {
    console.log(content.current);
    setBlockInfo((prev) => {
      return { ...prev, [id]: { id, type, order: 1, content: content.current } };
    });
  };

  return (
    <ContentEditable
      html={content.current}
      onChange={(e) => (content.current = e.target.value)}
      onBlur={updateContent}
      className="outline-none w-full focus:bg-[#f5f5f5] p-2 rounded-lg transition-all"
    />
  );
};
