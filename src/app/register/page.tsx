import RegisterForm from "./registerForm";
import Image from "next/image";

const Register = () => {
  return (
    <main className="fixed w-full h-full flex items-center justify-center bg-white">
      <div className="shadow-2xl w-5/12 text-[#333] rounded-2xl flex overflow-hidden">
        {/* <Image
          src="https://ichef.bbci.co.uk/news/976/cpsprodpb/D2D2/production/_118707935_untitled-1.jpg"
          alt="pic"
          height={100}
          width={400}
          priority
          style={{ width: "auto" }}
        /> */}
        <div
          className="w-6/12 flex justify-center items-center flex-col"
          style={{
            background:
              "linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(235deg,var(--yellow) 20%,var(--orange),var(--red),var(--purple) 60%,var(--blue)) 80%",
          }}
        >
          <Image
            src="/logo_greyscale.jpeg"
            width={100}
            height={100}
            alt="logo"
            className="mix-blend-multiply mb-3"
          />
          <p className="text-[#4a4a4a]">Welcome to</p>
          <p className="text-[#4a4a4a] text-3xl font-semibold text-center">
            {" "}
            UNSW DataSoc
          </p>
        </div>
        <div className="p-12">
          <h1 className="text-2xl font-bold">Register</h1>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default Register;
