// import { redirect } from "next/navigation";

// import { getServerAuthSession } from "@/server/auth";

// import { isModerator } from "@/app/utils";

// import TagReferencesRoot from "./tagReferencesRoot";

// export default async function Tags() {
//   const session = await getServerAuthSession();

//   if (!isModerator(session)) {
//     redirect("/auth/login");
//   }

//   return (
//     <div className="flex-grow container m-auto flex gap-5 p-10 flex-wrap justify-center">
//       <TagReferencesRoot />
//     </div>
//   );
// }

export default async function Tags() {
  return (
    <div className="container m-auto flex flex-grow flex-wrap justify-center gap-5 p-10">
      Tags page coming soon!
    </div>
  );
}
