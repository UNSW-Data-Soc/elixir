import Link from "next/link";

export default function notFound() {
  return (
    <main className="flex w-full flex-grow flex-col items-center justify-center gap-3 bg-white text-lg">
      <h2 className="text-3xl font-bold">404 moment...</h2>
      <p className="">This blog doesn&apos;t seem to exist :(</p>
      <p className="italic">(Are you connected to the internet?)</p>
      <p>
        See all blogs{" "}
        <Link className="text-blue-400 underline" href="/blogs">
          here
        </Link>
        .
      </p>
    </main>
  );
}
