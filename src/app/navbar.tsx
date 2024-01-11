"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

import { useReducer, useState } from "react";

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

import {
  ArrowLeftOnRectangleIcon,
  BuildingLibraryIcon,
  ChevronDownIcon,
  PhotoIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { DATASOC_CONSTITUION_LINK, DATASOC_SPARC_LINK } from "./utils";
import { getUserProfilePicRoute } from "./utils/s3";

import { Session } from "next-auth";

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
  { name: "Jobs Board", link: "/jobs" }, // TODO: uncomment when jobs board is ready
  { name: "Blogs", link: "/blogs" },
  { name: "Resources", link: "/resources" },
  { name: "Publications", link: "/publications" },
  { name: "Contact Us", link: "/contact" },
];

// TODO: move to utils file
const logout = async (router: AppRouterInstance) => {
  await signOut();
  router.push("/");
};

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const session = useSession();

  const [isOpen, toggleOpen] = useReducer((isOpen) => !isOpen, false);

  return (
    <NextUINavbar
      isBordered
      shouldHideOnScroll={false}
      className="z-50 flex items-center justify-center gap-6 bg-[#fffb]"
      maxWidth="xl"
      isMenuOpen={isOpen}
      onMenuOpenChange={toggleOpen}
    >
      {/* mobile navbar */}
      <NavbarContent className="z-50 flex xl:hidden" justify="start">
        <NavbarBrand>
          <Link href="/" className="text-[#333]">
            <Image
              src="/logo.png"
              width={118}
              height={32}
              className="h-[1.8rem] w-auto"
              alt="society logo"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="z-50 flex xl:hidden" justify="center">
        <NavbarMenuToggle onClick={toggleOpen} />
      </NavbarContent>
      <NavbarMenu className="z-50">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={item.link === path ? "primary" : "foreground"}
              className="w-full p-3"
              href={item.link}
              size="lg"
              onClick={toggleOpen}
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
      <NavbarContent className="z-50 hidden gap-6 xl:flex" justify="end">
        <NavbarBrand>
          <Link href="/" className="text-[#333]">
            <Image
              src="/logo.png"
              width={118}
              height={32}
              className="h-[1.8rem] w-auto"
              alt="society logo"
            />
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
        {session.status === "authenticated" && (
          <NavbarItem className="ml-3 flex items-center justify-center align-baseline">
            <SettingsDropdown
              isAdmin={session.data.user.role === "admin"}
              isModerator={session.data.user.role === "moderator"}
              session={session.data}
            />
          </NavbarItem>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
}

function AboutUsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen}>
        <DropdownTrigger>
          <Link
            href="/about"
            className="flex h-full flex-row gap-1 text-[#333]"
          >
            <span>About Us</span>{" "}
            <ChevronDownIcon height={15} width={15} color="#333" />
          </Link>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="about-us" href="/about">
            About Us
          </DropdownItem>
          <DropdownItem key="our-team" href="/about/team">
            Our Team
          </DropdownItem>
          <DropdownItem
            key="constitution-link"
            href={DATASOC_CONSTITUION_LINK}
            target="_blank"
            className="text-sm text-black"
          >
            Our Constitution
          </DropdownItem>
          <DropdownItem
            key="careers-guide"
            href={DATASOC_SPARC_LINK}
            className="text-sm text-black"
            target="_blank"
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

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen}>
        <DropdownTrigger>
          <Link
            href="/publications"
            className="flex flex-row gap-1 text-[#333]"
          >
            <span>Publications</span>
            <ChevronDownIcon height={15} width={15} color="#333" />
          </Link>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="publications" href="/publications">
            Publications
          </DropdownItem>
          <DropdownItem key="first-year-guide" href="/first-year-guide">
            First Year Guide
          </DropdownItem>
          <DropdownItem key="careers-guide" href="/careers-guide">
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
  session: Session;
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
        link: "/tags",
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
      link: `/profile/${props.session.user.id}`,
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
          src={
            props.session.user.image
              ? getUserProfilePicRoute(
                  props.session.user.id,
                  props.session.user.image,
                )
              : undefined
          }
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
