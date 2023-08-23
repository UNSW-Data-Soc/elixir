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
  UserIcon,
  FaceSmileIcon,
  Cog6ToothIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { endpoints } from "./api/backend/endpoints";

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
      <div className="flex flex-row gap-3">
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
            {
              <SettingsDropdown is_admin={session.data.user.admin} user_id={session.data.user.id}/>
            }
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

function SettingsDropdown(props: { is_admin: boolean; user_id: string }) {
    const router = useRouter();
    interface ItemDropdown {
        key: string;
        label: string;
        startContent: JSX.Element;
        link: string;
    }

    let items: ItemDropdown[] = [];

    if (props.is_admin) {
        items = [
            {
                key: "users",
                label: "Users",
                startContent: <UsersIcon className="h-6 w-6" />,
                link: "/users",
            },
            {
                key: "tags",
                label: "Tags",
                startContent: <TagIcon className="h-6 w-6" />,
                link: "/tags/references",
            },
        ];
    }

    items.push({
        key: "profile",
        label: "Profile",
        startContent: <UserIcon className="h-6 w-6" />,
        link: `/profile/${props.user_id}`,
    });

    return (
        <div className="flex items-center justify-center align-baseline">
            <Dropdown backdrop="blur">
                <DropdownTrigger>
                    <Avatar
                      isBordered
                      showFallback
                      as="button"
                      src={endpoints.users.getUserProfilePicture(props.user_id)}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions" items={items}>
                    {(item) => {
                        let i = item as ItemDropdown;
                        return (
                            <DropdownItem
                                key={i.key}
                                startContent={i.startContent}
                                onClick={() => {
                                    router.push(i.link);
                                }}
                            >
                                {i.label}
                            </DropdownItem>
                        );
                    }}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

export default Navbar;
