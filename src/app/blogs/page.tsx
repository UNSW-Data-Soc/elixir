import { endpoints } from "../api/backend/endpoints";
import { type Blog } from "../api/backend/blogs";

// import { convert as htmlToTextConvert } from "html-to-text";

import BlogsAddCard from "./blogsAddCard";

import { getServerSession } from "next-auth";
import BlogCard from "./blogCard";
// import { type BlogBlock, textBlockTypes } from "./editor/blogContentEditor";

export default function Blog() {
  return (
    <main className="bg-white ">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to opinion articles about
          data science in the real world, they&apos;re here for you!
        </p>
      </header>
      <BlogsContainer />
    </main>
  );
}

async function BlogsContainer() {
  // TODO: make this a client comoponent and pass in auth depending on if user is logged in
  const blogs = await endpoints.blogs.getAll({authRequired: false});

  return (
    <div className="container m-auto flex gap-8 p-10 flex-wrap justify-center">
      <BlogsAddCard />
      {!!blogs &&
        blogs
          .sort((a, b) => b.created_time.localeCompare(a.created_time))
          .map((blog) => <BlogCard key={blog.id} {...blog} />)}
    </div>
  );
}






