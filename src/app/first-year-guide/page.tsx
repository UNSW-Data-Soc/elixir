const FYG_2021_LINK = "https://drive.google.com/file/d/1Fdf56Csia7Ea3HNPSttzRIb5Cfg6z7H5/preview";
const FYG_2022_LINK = "https://drive.google.com/file/d/1tfqWGa1CUkUhNagho0dYeYMGXQscnke0/preview";
const FYG_2023_LINK = "https://drive.google.com/file/d/1Fdf56Csia7Ea3HNPSttzRIb5Cfg6z7H5/preview";

export default function FirstYearGuide() {
  return (
    <main className="bg-white">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">First Year Guide</h1>
        <p>
            This <b>DataSoc First Year Guide</b> will allow you to familiarise yourself with UNSW, as the transition to university can feel super daunting and confusing. In particular, if you are a data science student, you will also benefit from our overview of this flourishing degree, equipping you with the knowledge you need to get started!
        </p>
        <p>
        Look inside for our top tips for wandering the campus, maximising your social skills, raising your WAM and padding your resumé! 
        </p>
        <p>
            If you are interested, you can also view our
              <a href={FYG_2021_LINK}> <u>2021</u> </a>
              and
              <a href={FYG_2022_LINK}> <u>2022</u> </a>
              First Year Guides.
        </p>
      </header>
      <div className="flex items-center justify-center align-baseline p-6">
        <iframe className="w-2/3 w-full h-screen" src={FYG_2023_LINK}/>
      </div>
    </main>
  );
}