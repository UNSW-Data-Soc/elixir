import CoverPhotoRoot from "./coverPhotoRoot";

export default function Company() {
  return (
    <main className="flex flex-grow flex-col bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-2xl font-semibold"> Upload Cover Photo</h1>
        <p className="">This will replace the image on the home page.</p>
      </header>
      <div className="flex flex-grow flex-col items-center justify-center gap-3 py-10">
        <CoverPhotoRoot />
      </div>
    </main>
  );
}
