import { redirect } from "next/navigation";

import { doc } from "@/server/api/root";
import { getServerAuthSession } from "@/server/auth";

import Swagger from "./swagger";

export default async function Page() {
  const session = await getServerAuthSession();

  if (session?.user.role !== "admin") {
    return redirect("/auth/login?from=/docs");
  }

  return (
    <main className="pb-10">
      <div className=" flex w-full flex-col items-center justify-center gap-6 bg-purple-200 p-10 text-center text-purple-900">
        <p className="text-4xl">
          Welcome to the backend documentation for{" "}
          <span className="font-semibold">elixir</span>!
        </p>
        <p className="max-w-2xl leading-8">
          Feel free to use the{" "}
          <span className="font-semibold">&apos;try it out&apos;</span> button
          to send{" "}
          <code className="whitespace-nowrap rounded-lg bg-purple-300 p-1 px-2">
            GET
          </code>{" "}
          and{" "}
          <code className="whitespace-nowrap rounded-lg bg-purple-300 p-1 px-2">
            POST
          </code>{" "}
          requests. But proceed with{" "}
          <span className="font-semibold text-red-800">caution</span> because
          you are technically{" "}
          <span className="whitespace-nowrap rounded-lg bg-purple-400 p-1 px-2 text-white">
            ✨interacting with our production database✨
          </span>
          <br />
          <br />
          Currently, this page is accessible to all users with the{" "}
          <code className="whitespace-nowrap rounded-lg bg-purple-300 p-1 px-2">
            admin
          </code>{" "}
          role only.
          <br />
          <br />
          Note: some routes are{" "}
          <span className="font-semibold">moderator-only</span> (e.g. if it
          involves creating / editing / deleting content) or{" "}
          <span className="font-semibold">admin-only</span> (e.g. if it involves
          managing other users) so you may receive a{" "}
          <code className="whitespace-nowrap rounded-lg bg-purple-300 p-1 px-2">
            403 (Unauthorized)
          </code>{" "}
          response if you have insufficient permissions.
        </p>
      </div>
      <Swagger doc={doc} />
    </main>
  );
}
