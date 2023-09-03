import Image from "next/image";
import ResetForm from "./resetForm";

export default function ResetPassword() {
    return (
        <main className="fixed w-full h-full flex items-center justify-center bg-white p-5">
          <div className="shadow-2xl xl:w-7/12 lg:w-8/12 md:w-10/12 sm:w-8/12 w-10/12 md:flex-row flex-col max-w-4xl text-[#333] rounded-2xl flex overflow-hidden">
            <div className="md:w-6/12 flex justify-center items-center flex-col py-10 md:p-0 bg-light-rainbow select-none">
              <Image
                src="/logo_greyscale.jpeg"
                width={100}
                height={100}
                alt="logo"
                className="mix-blend-multiply mb-3"
                quality={100}
                priority
              />
            </div>
            <div className="p-12 md:w-6/12">
              <h1 className="text-2xl font-bold mb-3">Reset password</h1>
              <ResetForm/>
            </div>
          </div>
        </main>
      );
}