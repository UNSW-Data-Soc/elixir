import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-light-rainbow gap-10 fixed left-0 top-0 w-full z-0 select-none">
      <Image
        src="/logo_greyscale.jpeg"
        width={300}
        height={300}
        className="mix-blend-multiply"
        alt="logo"
        priority
      />
      <h1 className="text-6xl font-extrabold text-[#865A5E]">UNSW DataSoc</h1>
    </main>
  );
}
