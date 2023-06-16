import { getServerSession } from "next-auth/next";
import { BlogsAddForm } from "./blogsAddForm";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export default async function BlogsPost() {
  // const session = useSession();
  // const router = useRouter();
  // if (session.status === "unauthenticated" || !session.data?.user.admin) router.push("/blogs");
  const session = await getServerSession();
  console.log(session);
  if (!session) return redirect("/");

  // const cookieStore = cookies();
  // return cookieStore.getAll().map((cookie) => (
  //   <div key={cookie.name}>
  //     <p>Name: {cookie.name}</p>
  //     <p>Value: {cookie.value}</p>
  //   </div>
  // ));

  return (
    <main className="p-10 flex justify-center items-center text-black h-screen overflow-hidden fixed w-screen">
      {/* <h1 className="text-3xl font-bold">Create a new blog post.</h1> */}
      <BlogsAddForm />
    </main>
  );
}
