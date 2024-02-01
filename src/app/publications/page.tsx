import LinkButton from "../components/LinkButton";
import { NEWSLETTER_ARCHIVE_LINK } from "../utils";

export default function Publications() {
  return (
    <main className="flex-grow bg-white pb-5">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Publications</h1>
        <p>
          You can find all of our publications here, including our newsletters
          and guides!
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-center gap-5 p-6 align-baseline sm:py-10 lg:gap-12">
        <LinkButton
          to="/contact"
          text="Newsletter Signup"
          className="text-1xl w-64 bg-orange-400 p-3 py-6 font-bold text-white shadow-sm"
        />
        <LinkButton
          to={NEWSLETTER_ARCHIVE_LINK}
          text="Newsletter Archive"
          className="text-1xl w-64 bg-orange-400 p-3 py-6 font-bold text-white shadow-sm"
        />
        <LinkButton
          to="/blogs"
          text="Blog"
          className="text-1xl w-64 bg-orange-400 p-3 py-6 font-bold text-white shadow-sm"
        />
      </div>
      <div className="flex flex-wrap items-stretch justify-center gap-12 px-5 py-3 align-baseline lg:gap-24">
        <div className="flex w-96 flex-col justify-between rounded-lg p-4 text-center outline outline-1 sm:p-7">
          <p className="text-3xl font-bold">2024 First Year Guide</p>
          <br></br>
          <p>
            UNSW has a whole host of different experiences and opportunities, so
            much so that it can feel super daunting and confusing.
          </p>
          <br />
          <p>
            If this is how you feel (and even if it&apos;s not) - this First
            Year Guide is for you!
          </p>
          <br />
          <LinkButton
            to="/first-year-guide"
            text="View First Year Guide"
            className="w-full p-3"
          />
        </div>
        <div className="w-96 flex-col justify-between rounded-lg p-4 text-center outline outline-1 sm:p-7">
          <p className="text-3xl font-bold">2021 Careers Guide</p>
          <br></br>
          <p>Data Science can be difficult to navigate career-wise.</p>
          <br />
          <p>
            If you&apos;re looking for a place to start, some extra information,
            and some guidance from experienced professionals, check out our
            Careers Guide!
          </p>
          <br />
          <LinkButton
            to="/careers-guide"
            text="View Careers Guide"
            className="w-full p-3"
          />
        </div>
      </div>
    </main>
  );
}
