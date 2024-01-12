import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import ProfileManager from "./profileManager";

export default async function Users({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/");
  }

  return (
    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
      <ProfileManager userId={params.id} />
    </div>
  );
}
