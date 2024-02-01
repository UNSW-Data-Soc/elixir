import {
  FYG_2021_LINK,
  FYG_2022_LINK,
  FYG_2023_LINK,
  FYG_2024_LINK,
} from "../utils";

export default function FirstYearGuide() {
  return (
    <main className="bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">First Year Guide</h1>
        <p>
          This <b>DataSoc First Year Guide</b> will allow you to familiarise
          yourself with UNSW, as the transition to university can feel super
          daunting and confusing. In particular, if you are a data science
          student, you will also benefit from our overview of this flourishing
          degree, equipping you with the knowledge you need to get started!
        </p>
        <p>
          Look inside for our top tips for wandering the campus, maximising your
          social skills, raising your WAM and padding your resumé!
        </p>
        <p>
          If you are interested, you can also view our
          <a href={FYG_2021_LINK}>
            {" "}
            <u>2021</u>{" "}
          </a>
          and
          <a href={FYG_2022_LINK}>
            {" "}
            <u>2022</u>{" "}
          </a>
          First Year Guides.
        </p>
      </header>
      <div className="flex items-center justify-center p-6 align-baseline">
        <iframe className="h-screen w-2/3" src={FYG_2024_LINK} />
      </div>
    </main>
  );
}
