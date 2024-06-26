import { getServerSession } from "next-auth";
import RegisterForm from "./registerForm";
import Image from "next/image";
import { redirect } from "next/navigation";

const Register = async () => {
  const session = await getServerSession();
  if (session) return redirect("/");

  return (
    // <main className="fixed w-full h-full flex items-center justify-center bg-kentosoc-repeat p-5">
    <main className="fixed w-full h-full flex items-center justify-center bg-white p-5">
      <div className="shadow-2xl xl:w-7/12 lg:w-8/12 md:w-10/12 sm:w-8/12 w-10/12 md:flex-row flex-col text-[#333] rounded-2xl flex overflow-hidden bg-white">
        {/* <div className="md:w-6/12 flex justify-center items-center flex-col py-10 md:p-0 bg-kentosoc select-none"> */}
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
          <p className="text-[#4a4a4a]">Welcome to</p>
          <p className="text-[#4a4a4a] text-3xl font-semibold text-center">
            UNSW DataSoc
          </p>
        </div>
        <div className="p-12 md:w-6/12">
          <h1 className="text-2xl font-bold mb-3">Register</h1>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default Register;
