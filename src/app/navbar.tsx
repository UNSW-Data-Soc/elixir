"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
    TagIcon,
    PhotoIcon,
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
} from "@nextui-org/react";
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
        <NextUINavbar isBordered>
            <NavbarBrand>
                <p className="font-bold text-inherit">DataSoc</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="start">
                {/*
                TODO: navbarmenu item for smaller screens
                https://nextui.org/docs/components/navbar
                */}
                <NavbarItem>
                    <Link href="/" className="">
                        <span>Home</span>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/about/team" className="">
                        <span>Our Team</span>
                    </Link>
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
                        <span>Jobs</span>
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
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="end">
                {session.status === "unauthenticated" && (
                    <>
                        <NavbarItem>
                                <Button
                                    as={Link}
                                    color="primary"
                                    href="#"
                                    variant="flat"
                                    onClick={() => {router.push("/auth/login")}}
                                >
                                    Login
                                </Button>
                        </NavbarItem>
                        <NavbarItem>
                                <Button
                                    as={Link}
                                    color="primary"
                                    href="#"
                                    variant="flat"
                                    onClick={() => {router.push("/auth/register")}}
                                >
                                    Register
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
