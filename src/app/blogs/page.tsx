import { endpoints } from "../api/backend/endpoints";
import { type Blog } from "../api/backend/blogs";

import BlogsAddButton from "./blogsAddButton";

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
      <button style={{ backgroundColor: "red" }}>
        Add Blog (TODO: change this button to a clickable &quot;+&quot; card, only visible to
        mods/admins)
      </button>
      <p>
        TODO: Dialog for <b>tags</b> go here!
      </p>
      <BlogsAddButton />
    </main>
  );
}

async function BlogsContainer() {
  const blogs = await endpoints.blogs.getAll();

  console.log(blogs);

  return (
    <div className="container">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} {...blog} />
      ))}
    </div>
  );
}

function BlogCard(blog: Blog) {
  return (
    <div>
      <h3>{blog.title}</h3>
      <p>{blog.author}</p>
    </div>
  );
}
