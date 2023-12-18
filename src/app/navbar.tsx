"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

import { useState } from "react";

import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";

import { endpoints } from "@/app/api/backend/endpoints";

import {
  ArrowLeftOnRectangleIcon,
  BuildingLibraryIcon,
  PhotoIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { DATASOC_CONSTITUION_LINK, DATASOC_SPARC_LINK } from "./utils";

type ItemDropdown = {
  key: string;
  label: string;
  startContent: JSX.Element;
  link: string;
};

const menuItems = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about" },
  { name: "Sponsors", link: "/sponsorships" },
  { name: "Events", link: "/events" },
  // { name: "Jobs Board", link: "/jobs" }, // TODO: uncomment when jobs board is ready
  { name: "Blogs", link: "/blogs" },
  { name: "Resources", link: "/resources" },
  { name: "Publications", link: "/publications" },
  { name: "Contact Us", link: "/contact" },
];

const logout = async (router: AppRouterInstance) => {
  await signOut();
  router.push("/");
};

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const session = useSession();

  return (
    <NextUINavbar
      isBordered
      shouldHideOnScroll={false}
      className="gap-6 bg-[#fffb] flex items-center justify-center"
    >
      {/* mobile navbar */}
      <NavbarContent className="flex lg:hidden" justify="start">
        <NavbarBrand>
          <Link href="/" className="text-[#333]">
            <Image src="/logo.png" width={100} height={50} alt="society logo" />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="flex lg:hidden" justify="center">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={item.link === path ? "primary" : "foreground"}
              className="w-full p-3"
              href={item.link}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {session.status === "authenticated" && (
          <Link
            color={"danger"}
            className="w-full p-3"
            onClick={() => logout(router)}
            size="lg"
          >
            Logout
          </Link>
        )}
      </NavbarMenu>

      {/* desktop navbar */}
      <NavbarContent className="hidden gap-6 lg:flex" justify="center">
        <NavbarBrand>
          <Link href="/" className="text-[#333]">
            <Image src="/logo.png" width={100} height={50} alt="society logo" />
          </Link>
        </NavbarBrand>
        {menuItems.map((item) => {
          if (item.name === "About Us") {
            return <AboutUsDropdown key={item.name} />;
          } else if (item.name === "Publications") {
            return <PublicationsDropdown key={item.name} />;
          }
          return (
            <Link
              color={item.link === path ? "primary" : "foreground"}
              className="h-full text-[#333]"
              href={item.link}
              size="lg"
              key={item.name}
            >
              <NavbarItem>{item.name}</NavbarItem>
            </Link>
          );
        })}
      </NavbarContent>

      {session.status === "authenticated" && (
        <NavbarContent className="hidden gap-6 lg:flex" justify="start">
          <NavbarItem className="ml-3 flex items-center justify-center align-baseline">
            <SettingsDropdown
              isAdmin={session.data.user.role === "admin"}
              isModerator={session.data.user.role === "moderator"}
              userId={session.data.user.id}
            />
          </NavbarItem>
        </NavbarContent>
      )}
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
          <Link href="/about" className="h-full text-[#333]">
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
          <DropdownItem key="constitution-link">
            <Link
              href={DATASOC_CONSTITUION_LINK}
              className="text-sm text-black"
            >
              Our Constitution
            </Link>
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
          <Link href="/publications" className="text-[#333]">
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

function SettingsDropdown(props: {
  isAdmin: boolean;
  isModerator: boolean;
  userId: string;
}) {
  const router = useRouter();

  const items: ItemDropdown[] = [];

  if (props.isAdmin) {
    items.push({
      key: "users",
      label: "Users",
      startContent: <UsersIcon className="h-6 w-6" />,
      link: "/users",
    });
  }

  if (props.isModerator || props.isAdmin) {
    items.push(
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
    );
  }

  items.push(
    {
      key: "profile",
      label: "Profile",
      startContent: <UserIcon className="h-6 w-6" />,
      link: `/profile/${props.userId}`,
    },
    {
      key: "logout",
      label: "Logout",
      startContent: <ArrowLeftOnRectangleIcon className="h-6 w-6" />,
      link: "/",
    },
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as="button"
          src={endpoints.users.getUserProfilePicture(props.userId)}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => {
          return (
            <DropdownItem
              key={item.key}
              startContent={item.startContent}
              onClick={() => {
                if (item.key === "logout") {
                  logout(router);
                  return;
                }
                router.push(item.link);
              }}
            >
              {item.label}
            </DropdownItem>
          );
        }}
      </DropdownMenu>
    </Dropdown>
  );
}

export default Navbar;
