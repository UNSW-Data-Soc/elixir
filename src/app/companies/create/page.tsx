import CreateCompanyRoot from "./createCompanyRoot";

export default function Create() {
  return (
    <main className="py-10">
      <div className="container m-auto flex flex-row flex-wrap justify-between">
        <div>
          <h1 className="py-3 text-5xl font-semibold">New Company</h1>
        </div>
      </div>
      <CreateCompanyRoot />
    </main>
  );
}
