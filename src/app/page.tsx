import Image from "next/image";
import { endpoints } from "./api/backend/endpoints";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedInIcon, GitHubIcon, YouTubeIcon } from "./socialIcons";
import { DATASOC_FACEBOOK_LINK, DATASOC_INSTAGRAM_LINK, DATASOC_LINKEDIN_LINK, DATASOC_GITHUB_LINK, DATASOC_YOUTUBE_LINK } from "./utils";

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

export default function Home() {
    return (
        <main className="min-h-screen bg-light-rainbow gap-10 left-0 top-0 w-full z-0 select-none pb-48">
            <div className="fade-in-image mix-blend-multiply">
                <div>
                    <Image
                        src={endpoints.file.getCoverPhoto()}
                        alt="Cover Photo"
                        fill
                        sizes="100vw"
                        style={{
                            objectFit: "cover",
                        }}
                        priority
                        quality={100}
                    />
                </div>
            </div>
            <div className="brightness-200 pl-48 pt-48 flex flex-col items-start justify-center align-baseline gap-3 text-white">
                <div className="text-3xl font-bold">Welcome to the</div>
                <div className="text-7xl font-bold">Data Science Society</div>
                <div className="text-3xl font-bold">
                    University of New South Wales
                </div>
                <SocialIcons/>
            </div>
        </main>
    );
}

export function SocialIcons() {
    return (
        <>
            <div className="text-[#b4b6b7] flex items-start justify-start align-baseline gap-3">
                <Link href={DATASOC_FACEBOOK_LINK} className="flex gap-1">
                    <FacebookIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
                </Link>
                <Link href={DATASOC_INSTAGRAM_LINK} className="flex gap-1">
                    <InstagramIcon
                        width={SOCIAL_WIDTH}
                        height={SOCIAL_HEIGHT}
                    />
                </Link>
                <Link href={DATASOC_LINKEDIN_LINK} className="flex gap-1">
                    <LinkedInIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
                </Link>
                <Link href={DATASOC_GITHUB_LINK} className="flex gap-1">
                    <GitHubIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
                </Link>
                <Link href={DATASOC_YOUTUBE_LINK} className="flex gap-1">
                    <YouTubeIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT} />
                </Link>
            </div>
        </>
    );
}
