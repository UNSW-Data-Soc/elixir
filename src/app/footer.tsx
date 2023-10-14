"use client";

import Link from "next/link";
import {
    DATASOC_FACEBOOK_LINK,
    DATASOC_GITHUB_LINK,
    DATASOC_INSTAGRAM_LINK,
    DATASOC_LINKEDIN_LINK,
    DATASOC_YOUTUBE_LINK,
} from "./utils";
import Image from "next/image";
import { FacebookIcon, GitHubIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "./socialIcons";

const SOCIAL_HEIGHT = 25;
const SOCIAL_WIDTH = 25;

export default function Footer() {
    return (
        <>
            <div className="mt-12 pl-3 md:pl-24 pr-3 md:pr-24 pt-12 pb-12 flex items-start justify-between align-baseline gap-6 flex-wrap bg-[#f1f1f1]">
                <div className="text-[#b4b6b7] text-sm italic flex flex-col items-start justify-start align-start gap-6 sm:w-2/5">
                    <Image
                        src="/logo.png"
                        width={100}
                        height={100}
                        alt="Picture of the author"
                    />
                    <p>Made with ❤️ by UNSW Data Science Society</p>
                    <p>Proudly supported by Arc UNSW</p>
                    <p>
                        UNSW DataSoc acknowledges the Aboriginal and Torres
                        Strait Islander peoples as the first inhabitants of this
                        nation and the Bedegal people as the Traditional
                        Custodians of the Land where the UNSW Kensington campus
                        is situated. We pay our respects to all Elders past,
                        present and future.
                    </p>
                </div>
                <div className="text-[#b4b6b7] flex flex-col items-start justify-start align-baseline gap-1">
                    <p className="text-[#444e5f] font-bold">DATASOC</p>
                    <Link href="/">Home</Link>
                    <Link href="/about">About Us</Link>
                    <Link href="/sponsorships">Our Sponsors</Link>
                    <Link href="/events">Our Events</Link>
                    <Link href="/jobs">Jobs Board</Link>
                    <Link href="/blogs">Blog</Link>
                    <Link href="/resources">Resources</Link>
                    <Link href="/publications">Publications</Link>
                    <Link href="/contact">Contact Us</Link>
                </div>
                <div className="text-[#b4b6b7] flex flex-col items-start justify-start align-baseline gap-1">
                    <p className="text-[#444e5f] font-bold">GET IN TOUCH</p>
                    <Link href={DATASOC_FACEBOOK_LINK} className="flex gap-1">
                        <FacebookIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT}/>
                        Facebook
                    </Link>
                    <Link href={DATASOC_INSTAGRAM_LINK} className="flex gap-1">
                        <InstagramIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT}/>
                        Instagram
                    </Link>
                    <Link href={DATASOC_LINKEDIN_LINK} className="flex gap-1">
                        <LinkedInIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT}/>
                        LinkedIn
                    </Link>
                    <Link href={DATASOC_GITHUB_LINK} className="flex gap-1">
                        <GitHubIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT}/>
                        GitHub
                    </Link>
                    <Link href={DATASOC_YOUTUBE_LINK} className="flex gap-1">
                        <YouTubeIcon width={SOCIAL_WIDTH} height={SOCIAL_HEIGHT}/>
                        YouTube
                    </Link>
                </div>
            </div>
        </>
    );
}
