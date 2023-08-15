"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { logout } from "./api/auth/auth";

import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon,
  ChatBubbleBottomCenterIcon,
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  FaceSmileIcon
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const router = useRouter();
  const session = useSession();

  const logoutClick = async () => {
    if (!session) {
      router.push("/");
      return;
    }
    const success = await logout();
    if (success) {
      router.push("/");
    }
  };

  return (
    <nav className="w-full z-50 text-black relative shadow-xl transition-all bg-white flex flex-row justify-between">
      <div className="flex">
        <Link href="/" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            <HomeIcon className="h-6 w-6" />
            <span>Home</span>
          </button>
        </Link>
        <Link href="/about/team" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            <FaceSmileIcon className="h-6 w-6" />
            <span>Our Team</span>
          </button>
        </Link>
        <Link href="/sponsorships" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            {/* TOOD: Change to appropriate icons */}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            <span>Sponsors</span>
          </button>
        </Link>
        <Link href="/events" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            {/* TOOD: Change to appropriate icons */}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            <span>Events</span>
          </button>
        </Link>
        <Link href="/jobs" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            {/* TOOD: Change to appropriate icons */}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            <span>Jobs</span>
          </button>
        </Link>
        <Link href="/blogs" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            {/* TOOD: Change to appropriate icons */}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            <span>Blogs</span>
          </button>
        </Link>
        <Link href="/resources" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
            {/* TOOD: Change to appropriate icons */}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
            <span>Resources</span>
          </button>
        </Link>
      </div>
      <div className="flex flex-row">
        {session.status === "unauthenticated" && (
          <>
            <Link href="/auth/login" className="">
              <button className="hover:bg-[#ddd] p-5 transition-all flex flex-row gap-3">
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                <span>Login</span>
              </button>
            </Link>
            <Link href="/auth/register" className="">
              <button className="hover:bg-[#ddd] p-5 transition-all border-l border-l-black flex flex-row gap-3">
                <BoltIcon className="h-6 w-6" />
                <span>Register</span>
              </button>
            </Link>
          </>
        )}
        {session.status === "authenticated" && (
          <>
            {session.data.user.admin && 
            <Link href="/users" className="">
              <button className="hover:bg-[#ddd] p-5 transition-all flex gap-3 flex-row">
                <UsersIcon className="h-6 w-6" />
                <span>User Management</span>
              </button>
            </Link>
            }
            <Link href={`/profile/${session.data.user.id}`} className="">
              <p className="p-5 flex flex-row gap-3">
                <UserCircleIcon className="h-6 w-6" />
                <span>
                  <span>Logged in as </span>
                  <span className="text-[#555] italic">{session.data?.user?.email}</span>
                </span>
              </p>
            </Link>
            <button
              className="hover:bg-[#ddd] p-5 transition-all flex flex-row gap-3 border-l-black border-l"
              onClick={logoutClick}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
