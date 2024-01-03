import Image from "next/image";

import NewPasswordForm from "./newPassword";

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  return (
    <main className="fixed flex h-full w-full items-center justify-center bg-white p-5">
      <div className="flex w-10/12 max-w-4xl flex-col overflow-hidden rounded-2xl text-[#333] shadow-2xl sm:w-8/12 md:w-10/12 md:flex-row lg:w-8/12 xl:w-7/12">
        <div className="bg-light-rainbow flex select-none flex-col items-center justify-center py-10 md:w-6/12 md:p-0">
          <Image
            src="/logo_greyscale.jpeg"
            width={100}
            height={100}
            alt="logo"
            className="mb-3 mix-blend-multiply"
            quality={100}
            priority
          />
        </div>
        <div className="p-12 md:w-6/12">
          <h1 className="mb-3 text-2xl font-bold">Reset password</h1>
          <NewPasswordForm token={params.token} />
        </div>
      </div>
    </main>
  );
}
