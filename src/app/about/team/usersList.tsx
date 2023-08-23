"use client";

import { endpoints } from "../../api/backend/endpoints";
import { UserPublic } from "../../api/backend/users";
import { CSSProperties, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner, ZERO_WIDTH_SPACE } from "../../utils";
import { AttachmentInfo } from "@/app/api/backend/tags";
import { Image, Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, User as UserAvatar} from "@nextui-org/react";

const EMPTY_ABOUT_MESSAGE = "This profile remains a mystery...";

export default function UsersList() {
    const [users, setUsers] = useState<UserPublic[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>();
    const [portfolioTags, setPortfolioTags] = useState<AttachmentInfo[]>([]);
    const [displayUserAbout, setDisplayUserAbout] = useState(false);
    const [currUserDisplay, setCurrUserDisplay] = useState<UserPublic>();

    useEffect(() => {
        const getData = async () => {
            let yearsData = await endpoints.users.getYears();
            yearsData = yearsData.sort().reverse();
            let usersData = await endpoints.users.getUsersByYears(yearsData[0]);
            setYears(yearsData);
            if(yearsData.length > 0) {
                setSelectedYear(yearsData[0]);
            }
            setUsers(usersData);
            setLoading(false);

            let tags = await endpoints.tags.attachments('portfolio');
            setPortfolioTags(tags);
        };

        getData();
    }, []);

    if (!users) {
        toast.error("Failed to get users.");
        return <></>;
    }

    // TODO: sort by portfolio
    function sortUsers(a: UserPublic, b: UserPublic): number {
        return a.name.localeCompare(b.name);
    }

    function getUserCardStyle(user: UserPublic): CSSProperties {
        return {
            backgroundImage: user.photo ? "" : "url(/logo_greyscale.jpeg)",
            backgroundOrigin: "content-box",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        };
    }

    async function handleYearChange(year: Number) {
        if (!years.includes(year)) return toast.error("Invalid year!");

        setLoading(true);
        let usersData = await endpoints.users.getUsersByYears(year);
        setSelectedYear(year as number);
        setUsers(usersData);
        setLoading(false);
    }

    async function handleProfilePress(user: UserPublic) {
        setDisplayUserAbout(true);
        setCurrUserDisplay(user);
    }
    
    async function handleProfileClose() {
        setDisplayUserAbout(false);
        setCurrUserDisplay(undefined);
    }

    function getUserPortfolio(user: UserPublic) {
        return portfolioTags.find(a => a.bearer_id === user.id)?.name;
    }

    let tabs = [
        {
          id: "photos",
          label: "Photos",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
          id: "music",
          label: "Music",
          content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
          id: "videos",
          label: "Videos",
          content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
      ];

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="container">
                    <div className="flex gap-5 justify-center">
                        <Tabs
                            aria-label="Dynamic tabs"
                            items={years.map(y => {return {label: y.toString(), val: y}})}
                            selectedKey={selectedYear?.toString()}
                            onSelectionChange={(y) => handleYearChange(Number(y.valueOf()))}
                        >
                            {(item) => (<Tab key={item.label} title={item.label}/>)}
                        </Tabs>
                    </div>
                    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
                        {users.sort(sortUsers).map((user) => (
                            <>
                                <Card isBlurred isPressable radius="lg" className="border-none" onPress={() =>{handleProfilePress(user)}}>
                                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                        <small className="text-default-500">{getUserPortfolio(user) || ZERO_WIDTH_SPACE}</small>
                                        <h4 className="font-bold text-large">{user.name}</h4>
                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            // fill
                                            src={endpoints.users.getUserProfilePicture(
                                                user.id
                                            )}
                                            alt="Profile picture"
                                            className="object-cover rounded-xl"
                                            // height={240}
                                            height={300}
                                            width={300}
                                            // sizes="100vw"
                                        />
                                    </CardBody>
                                </Card>
                            </>
                        ))}
                    </div>
                    {currUserDisplay && <DisplayModal user={currUserDisplay} isOpen={displayUserAbout} portfolio={getUserPortfolio(currUserDisplay)} onOpenChange={handleProfileClose}/>}
                </div>
            )}
        </>
    );
}


function DisplayModal(props: {user: UserPublic, isOpen: boolean, onOpenChange: () => void, portfolio: string | undefined}) {
    return (
        <>
            <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                    <UserAvatar
                        name={props.user.name}
                        description={props.portfolio || ZERO_WIDTH_SPACE}
                        avatarProps={{
                            isBordered: true,
                            src: endpoints.users.getUserProfilePicture(props.user.id),
                            size: "lg",
                            color: "success",
                            showFallback: true,
                        }}
                    />
                    <ModalBody>
                        {
                            props.user.about || EMPTY_ABOUT_MESSAGE
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" variant="light" onPress={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    );
}