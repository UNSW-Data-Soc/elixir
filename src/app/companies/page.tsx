import CompanyRoot from "./companyRoot";

export default function Company() {
    return (
        <main className="bg-white ">
          <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
              <h1 className="text-3xl font-semibold">Companies</h1>
              <p>
                  To create sponsorships or job offerings, first a company needs to be created.
              </p>
          </header>
          <CompanyRoot/>
      </main>
    );
}
