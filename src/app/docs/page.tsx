import { doc } from "@/server/api/root";
import { getServerAuthSession } from "@/server/auth";

import Swagger from "./swagger";

export default async function Page() {
  const session = await getServerAuthSession();

  if (session?.user.role !== "admin") {
    return <div className="w-full text-center">Unauthorized</div>;
  }

  return (
    <main className="pb-10">
      <div className=" flex w-full flex-col items-center justify-center gap-4 bg-red-200 p-10 text-center text-red-800">
        <p className="text-4xl">Important!</p>
        <p className="max-w-4xl leading-8">
          I just used a library to auto-generate these docs but the{" "}
          <span className="font-semibold">&apos;try it out&apos;</span> button
          doesn&apos;t work for{" "}
          <code className="whitespace-nowrap rounded-lg bg-red-300 p-1 px-2">
            GET
          </code>{" "}
          requests with input. You have to wrap the input in a{" "}
          <code className="mx-1 whitespace-nowrap rounded-lg bg-[#333] p-1 px-2 text-[#fafafa]">{`{ "json": whatever-the-input-is }`}</code>{" "}
          object.
          <br />
          <br />
          For example, to try out the{" "}
          <code className="whitespace-nowrap rounded-lg bg-red-300 p-1 px-2">
            blogs.getBySlug
          </code>{" "}
          endpoint, you have set the input to{" "}
          <code className="mx-1 whitespace-nowrap rounded-lg bg-[#333] p-1 px-2 text-[#fafafa]">{`{ "json": { "slug": "my-blog-slug" } }`}</code>{" "}
          instead of just{" "}
          <code className="mx-1 whitespace-nowrap rounded-lg bg-[#333] p-1 px-2 text-[#fafafa]">{`{ "slug": "my-blog-slug" }`}</code>{" "}
          as incorrectly suggested by the auto-generated docs.
          <br />
          <br />
          Sorry about the inconvenience. On the plus side, the docs
          automatically update if the backend every changes :))
        </p>
      </div>
      <Swagger doc={doc} />
    </main>
  );
}
