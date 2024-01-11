"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { DispatchWithoutAction, useReducer, useState } from "react";

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

import {
  DATASOC_CONSTITUION_LINK,
  DATASOC_SPARC_LINK,
  isAdmin,
  isModerator,
  logout,
} from "./utils";
import { getUserProfilePicRoute } from "./utils/s3";

type SettingsItem = {
  key: string;
  label: string;
  startContent: JSX.Element;
  link: string;
};

const adminSettingsItems: SettingsItem[] = [
  {
    key: "users",
    label: "Users",
    startContent: <UsersIcon className="h-6 w-6" />,
    link: "/users",
  },
];
const moderatorSettingsItems: SettingsItem[] = [
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
];
const userSettingsItems: SettingsItem[] = [
  {
    key: "profile",
    label: "Profile",
    startContent: <UserIcon className="h-6 w-6" />,
    link: `/profile`,
  },
  {
    key: "logout",
    label: "Logout",
    startContent: <ArrowLeftOnRectangleIcon className="h-6 w-6" />,
    link: "/",
  },
];

// navbar menu items + subitems
type MenuSubItem = {
  name: string;
  link: string;
  target?: string;
  className?: string;
};
type MenuItem = {
  name: string;
  link: string;
  subItems?: MenuSubItem[];
};
const menuItems: MenuItem[] = [
  { name: "Home", link: "/" },
  {
    name: "About Us",
    link: "/about",
    subItems: [
      { name: "Our Team", link: "/about/team" },
      {
        name: "Our Constitution",
        link: DATASOC_CONSTITUION_LINK,
        target: "_blank",
        className: "text-sm text-black",
      },
      {
        name: "SpArc",
        link: DATASOC_SPARC_LINK,
        target: "_blank",
        className: "text-sm text-black",
      },
    ],
  },
  { name: "Sponsors", link: "/sponsorships" },
  { name: "Events", link: "/events" },
  { name: "Jobs Board", link: "/jobs" },
  { name: "Blogs", link: "/blogs" },
  { name: "Resources", link: "/resources" },
  {
    name: "Publications",
    link: "/publications",
    subItems: [
      { name: "First Year Guide", link: "/first-year-guide" },
      { name: "Careers Guide", link: "/careers-guide" },
    ],
  },
  { name: "Contact Us", link: "/contact" },
];
const shortMenuItems: MenuItem[] = [
  { name: "Home", link: "/" },
  {
    name: "About",
    link: "/about",
    subItems: [
      { name: "Our Team", link: "/about/team" },
      {
        name: "Our Constitution",
        link: DATASOC_CONSTITUION_LINK,
        target: "_blank",
        className: "text-sm text-black",
      },
      {
        name: "SpArc",
        link: DATASOC_SPARC_LINK,
        target: "_blank",
        className: "text-sm text-black",
      },
    ],
  },
  { name: "Events", link: "/events" },
  {
    name: "Sponsors",
    link: "/sponsorships",
    subItems: [{ name: "Jobs Board", link: "/jobs" }],
  },
  {
    name: "Publications",
    link: "/publications",
    subItems: [
      { name: "Blogs", link: "/blogs" },
      { name: "Resources", link: "/resources" },
      { name: "First Year Guide", link: "/first-year-guide" },
      { name: "Careers Guide", link: "/careers-guide" },
    ],
  },
  { name: "Contact", link: "/contact" },
];

function hasSubItems(item: MenuItem): item is Required<MenuItem> {
  return !!item.subItems;
}

export default function Navbar() {
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
      {/* displays on mobile devices */}
      <MobileNavbar toggleOpen={toggleOpen} />
      <TabletNavbar />
      {/* displays on large devices */}
      <DesktopNavbar />
    </NextUINavbar>
  );
}

function MobileNavbar({ toggleOpen }: { toggleOpen: DispatchWithoutAction }) {
  const path = usePathname();

  const session = useSession();

  return (
    <>
      <NavbarContent className="z-50 flex md:hidden" justify="start">
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
      <NavbarMenu className="z-50 py-5">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={item.link === path ? "primary" : "foreground"}
              className="w-full px-3 py-2 text-base sm:text-lg"
              href={item.link}
              size="lg"
              onClick={toggleOpen}
            >
              {item.name}
            </Link>
            {hasSubItems(item) && (
              <div className="flex flex-col gap-1">
                {item.subItems.map((subItem, index) => (
                  <Link
                    key={`${subItem}-${index}`}
                    color={subItem.link === path ? "primary" : "foreground"}
                    className="w-full px-3 py-2 text-sm"
                    href={subItem.link}
                    size="lg"
                    onClick={toggleOpen}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </NavbarMenuItem>
        ))}
        {session.status === "authenticated" && (
          <MobileAdminLinks toggleOpen={toggleOpen} />
        )}
      </NavbarMenu>

      {/* hamburger button for mobile navbar */}
      <NavbarContent className="z-50 flex md:hidden" justify="center">
        <NavbarMenuToggle onClick={toggleOpen} />
      </NavbarContent>
    </>
  );
}

function MobileAdminLinks({
  toggleOpen,
}: {
  toggleOpen: DispatchWithoutAction;
}) {
  const session = useSession();
  const path = usePathname();
  const router = useRouter();

  const items: SettingsItem[] = [
    ...(isAdmin(session.data) ? adminSettingsItems : []),
    ...(isModerator(session.data) ? moderatorSettingsItems : []),
    ...userSettingsItems,
  ];

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, index) =>
        item.key === "logout" ? (
          <Link
            key={`${item}-${index}`}
            color={"danger"}
            className="flex w-full flex-row gap-2 p-3"
            onClick={() => logout(router)}
            size="lg"
          >
            {item.startContent}
            Logout
          </Link>
        ) : (
          <Link
            key={`${item}-${index}`}
            color={item.link === path ? "primary" : "foreground"}
            className="flex w-full flex-row gap-2 px-3 py-2 text-sm"
            href={item.link}
            size="lg"
            onClick={toggleOpen}
          >
            {item.startContent}
            {item.label}
          </Link>
        ),
      )}
    </div>
  );
}

function TabletNavbar() {
  const session = useSession();

  return (
    <NavbarContent
      className="z-50 hidden gap-5 md:flex lg:hidden"
      justify="end"
    >
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
      {shortMenuItems.map((item) =>
        hasSubItems(item) ? (
          <DesktopNavbarDropdown key={item.name} item={item} />
        ) : (
          <DesktopNavbarLink key={item.name} item={item} />
        ),
      )}
      {session.status === "authenticated" && (
        <NavbarItem className="ml-3 flex items-center justify-center align-baseline">
          <SettingsDropdown />
        </NavbarItem>
      )}
    </NavbarContent>
  );
}

function DesktopNavbar() {
  const session = useSession();

  return (
    <NavbarContent className="z-50 hidden gap-5 lg:flex" justify="end">
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
      {menuItems.map((item) =>
        hasSubItems(item) ? (
          <DesktopNavbarDropdown key={item.name} item={item} />
        ) : (
          <DesktopNavbarLink key={item.name} item={item} />
        ),
      )}
      {session.status === "authenticated" && (
        <NavbarItem className="ml-3 flex items-center justify-center align-baseline">
          <SettingsDropdown />
        </NavbarItem>
      )}
    </NavbarContent>
  );
}

function DesktopNavbarDropdown({ item }: { item: Required<MenuItem> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Dropdown isOpen={isOpen}>
        <DropdownTrigger>
          <Link
            href={item.link}
            className="flex h-full flex-row gap-1 text-[#333]"
          >
            <span>{item.name}</span>{" "}
            <ChevronDownIcon height={15} width={15} color="#333" />
          </Link>
        </DropdownTrigger>
        <DropdownMenu
          items={[{ name: item.name, link: item.link }, ...item.subItems]}
        >
          {(subItem) => (
            <DropdownItem
              key={subItem.name}
              href={subItem.link}
              target={subItem.target ?? "_self"}
            >
              {subItem.name}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

function DesktopNavbarLink({ item }: { item: MenuItem }) {
  const path = usePathname();

  return (
    <Link
      color={item.link === path ? "primary" : "foreground"}
      className={`${
        item.name === "Home" ? "flex lg:hidden xl:flex" : ""
      } h-full text-[#333]`}
      href={item.link}
      size="lg"
      key={item.name}
    >
      <NavbarItem>{item.name}</NavbarItem>
    </Link>
  );
}

function SettingsDropdown() {
  const router = useRouter();
  const session = useSession();

  const items: SettingsItem[] = [
    ...(isAdmin(session.data) ? adminSettingsItems : []),
    ...(isModerator(session.data) ? moderatorSettingsItems : []),
    ...userSettingsItems,
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as="button"
          src={
            session.data?.user.image
              ? getUserProfilePicRoute(
                  session.data.user.id,
                  session.data.user.image,
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
