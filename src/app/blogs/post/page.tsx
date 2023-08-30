import { getServerSession } from "next-auth/next";
import { BlogsAddForm } from "./blogsAddForm";
import { redirect } from "next/navigation";

export default async function BlogsPost() {
  const session = await getServerSession();
  if (!session) return redirect("/");

  return (
    <main className="p-10 flex justify-center items-center text-black h-screen overflow-hidden fixed w-screen">
      <BlogsAddForm />
    </main>
  );
}
