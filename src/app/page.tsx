import Image from "next/image";
// import { Image} from "@nextui-org/react";
import { endpoints } from "./api/backend/endpoints";
import {
    COVER_PHOTO_X_PXL,
    COVER_PHOTO_Y_PXL,
} from "./settings/coverphoto/page";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-light-rainbow gap-10 left-0 top-0 w-full z-0 select-none">
            {/* <Image
              src="/logo_greyscale.jpeg"
              width={300}
              height={300}
              className="mix-blend-multiply"
              alt="logo"
              priority
            /> */}
            <Image
                src={endpoints.file.getCoverPhoto()}
                width={COVER_PHOTO_X_PXL}
                height={COVER_PHOTO_Y_PXL}
                className="mix-blend-multiply"
                alt="logo"
                priority
            />
            {/* <h1 className="text-6xl font-extrabold text-[#865A5E]">UNSW DataSoc</h1> */}
        </main>
    );
}
