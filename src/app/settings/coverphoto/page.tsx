import CoverPhotoRoot from "./coverPhotoRoot";

export default function Company() {
    return (
        <main className="bg-white ">
          <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
          </header>
          <div className="flex flex-col gap-3 h-screen justify-center items-center">
            <h1 className="py-5 text-2xl font-semibold"> Upload Cover Photo</h1>
            <p className="italic">This will replace the image on the home page</p>
            <CoverPhotoRoot/>
        </div>
      </main>
    );
}
