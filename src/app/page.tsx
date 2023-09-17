import Image from "next/image";
import { endpoints } from "./api/backend/endpoints";

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
            </div>
            <div className="flex items-center justify-center align-baseline text-white text-2xl"></div>
        </main>
    );
}
