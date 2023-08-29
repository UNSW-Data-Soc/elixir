import Image from "next/image";
// import { Image} from "@nextui-org/react";
import { endpoints } from "./api/backend/endpoints";
import { COVER_PHOTO_X_PXL, COVER_PHOTO_Y_PXL } from "./utils";
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-light-rainbow gap-10 left-0 top-0 w-full z-0 select-none pb-48">
            <div style={{
                backgroundImage: `url(${endpoints.file.getCoverPhoto()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
                height: "100vh",
                width: "100vw",
            }}
            className="fade-in-image mix-blend-multiply"
            >
                <div className="pl-48 pt-48 flex flex-col items-start justify-center align-baseline gap-3 text-white">
                    <div className="text-3xl font-bold">
                        Welcome to the
                    </div>
                    <div className="text-7xl font-bold">
                        Data Science Society
                    </div>
                    <div className="text-3xl font-bold">
                        University of New South Wales
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center align-baseline text-white text-2xl">
            </div>
        </main>
    );
}
