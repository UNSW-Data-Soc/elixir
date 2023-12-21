import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";

import { isModerator } from "../utils";
import BlogsList from "./blogList";
import BlogsAddCard from "./blogsAddCard";

export default function Blog() {
  return (
    <main className="bg-white relative flex-grow">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to
          opinion articles about data science in the real world, they&apos;re
          here for you!
        </p>
      </header>
      <BlogsContainer />
    </main>
  );
}

async function BlogsContainer() {
  const session = await getServerAuthSession();
  const blogs = await api.blogs.getAll.query();

  return (
    <div className="m-auto flex flex-wrap justify-center gap-8 px-10 py-10 lg:container md:px-0">
      {isModerator(session) && (
        <div className="absolute right-5 bottom-5">
          <BlogsAddCard />
        </div>
      )}

      <BlogsList />

      {!isModerator(session) && blogs.length === 0 && (
        <div className="flex h-full items-center justify-center p-10">
          <p className="text-center text-[#555]">No blogs yet!</p>
        </div>
      )}
    </div>
  );
}
