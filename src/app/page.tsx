import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-center p-24 bg-light-rainbow gap-5 fixed left-0 top-0 w-full z-0">
      <Link href="/login">
        <button className="text-black shadow-xl hover:bg-[#ddd] transition-all p-5 rounded-xl bg-white">
          Login
        </button>
      </Link>
      <Link href="/register">
        <button className="text-black shadow-xl hover:bg-[#ddd] transition-all p-5 rounded-xl bg-white">
          Register
        </button>
      </Link>
    </main>
  );
}
