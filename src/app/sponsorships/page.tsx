import SponsorshipAddCard from "./SponsorshipAddCard";
import SponsorshipsList from "./sponsorshipsList";

export default function Sponsorship() {
  return (
    <main className="bg-white flex flex-col flex-grow relative">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Our Sponsors</h1>
        <p>
          DataSoc wouldn&apos;t be DataSoc without the amazing companies
          we&apos;ve worked with throughout our journey as a society. With more
          and more data-oriented decisions and predictions made everyday, the
          demand for talented Data Science graduates is growing.
        </p>
        <p>
          It&apos;s our long term goal to help our members become as capable
          they can be, and it wouldn&apos;t be possible without the continued
          support from industry.
        </p>
        <p>
          <strong>
            Interested in sponsoring? Reach out to{" "}
            <a href="mailto:external@unswdata.com">external@unswdata.com</a>
          </strong>
        </p>
      </header>
      <SponsorshipsContainer />
      <div className="absolute right-5 bottom-5">
        <SponsorshipAddCard />
      </div>
    </main>
  );
}

function SponsorshipsContainer() {
  return (
    <div className="container m-auto flex flex-col gap-5 p-10 flex-wrap justify-center">
      <SponsorshipsList />
    </div>
  );
}
