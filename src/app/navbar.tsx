"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { logout } from "./api/auth/auth";
import Image from "next/image";

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
  TagIcon,
  PhotoIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  Avatar,
} from "@nextui-org/react";
import { useState } from "react";
import { endpoints } from "./api/backend/endpoints";
import { DATASOC_CONSTITUION_LINK, DATASOC_SPARC_LINK } from "./utils";

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
    <NextUINavbar isBordered>
      <NavbarBrand>
        <Link href="/" className="">
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="Picture of the author"
          />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="start">
        <NavbarItem>
          <Link href="/" className="">
            <span>Home</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <AboutUsDropdown />
        </NavbarItem>
        <NavbarItem>
          <Link href="/sponsorships" className="">
            <span>Sponsors</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/events" className="">
            <span>Events</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/jobs" className="">
            <span>Jobs Board</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/blogs" className="">
            <span>Blogs</span>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/resources" className="">
            <span>Resources</span>
          </Link>
        </NavbarItem>

        <NavbarItem>
          <PublicationsDropdown />
        </NavbarItem>

        <NavbarItem>
          <Link href="/contact" className="">
            <span>Contact Us</span>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="end">
        {session.status === "unauthenticated" && (
          <>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={() => {
                  router.push("/auth/login");
                }}
              >
                Login
              </Button>
            </NavbarItem>
          </>
        )}

        {session.status === "authenticated" && (
          <>
            {
              <NavbarItem className="flex items-center justify-center align-baseline">
                <SettingsDropdown
                  is_admin={session.data.user.admin}
                  user_id={session.data.user.id}
                />
              </NavbarItem>
            }
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={logoutClick}
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                <span>Logout</span>
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

function AboutUsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen}>
        <DropdownTrigger>
          <Link href="/about" className="">
            <span>About Us</span>
          </Link>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="about-us" onClick={() => router.push("/about")}>
            About Us
          </DropdownItem>
          <DropdownItem
            key="our-team"
            onClick={() => router.push("/about/team")}
          >
            Our Team
          </DropdownItem>
          <DropdownItem
            key="careers-guide"
            onClick={() => router.push(DATASOC_CONSTITUION_LINK)}
          >
            Our Constitution
          </DropdownItem>
          <DropdownItem
            key="careers-guide"
            onClick={() => router.push(DATASOC_SPARC_LINK)}
          >
            SpArc
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

function PublicationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen}>
        <DropdownTrigger>
          <Link href="/publications" className="">
            <span>Publications</span>
          </Link>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="publications"
            onClick={() => router.push("/publications")}
          >
            Publications
          </DropdownItem>
          <DropdownItem
            key="first-year-guide"
            onClick={() => router.push("/first-year-guide")}
          >
            First Year Guide
          </DropdownItem>
          <DropdownItem
            key="careers-guide"
            onClick={() => router.push("/careers-guide")}
          >
            Careers Guide
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

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
      {
        key: "companies",
        label: "Companies",
        startContent: <BuildingLibraryIcon className="h-6 w-6" />,
        link: "/companies",
      },
      {
        key: "coverphoto",
        label: "Cover Photo",
        startContent: <PhotoIcon className="h-6 w-6" />,
        link: "/settings/coverphoto",
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
  );
}

export default Navbar;
