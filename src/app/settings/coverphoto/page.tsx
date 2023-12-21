import CoverPhotoRoot from "./coverPhotoRoot";

export default function Company() {
  return (
    <main className="bg-white flex flex-col">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-2xl font-semibold"> Upload Cover Photo</h1>
        <p className="">This will replace the image on the home page.</p>
      </header>
      <div className="flex flex-col gap-3 py-10 flex-grow justify-center items-center">
        <CoverPhotoRoot />
      </div>
    </main>
  );
}
