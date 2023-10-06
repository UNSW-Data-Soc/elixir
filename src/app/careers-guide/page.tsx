import { CAREERS_GUIDE } from "../utils";

export default function CareersGuide() {
  return (
    <main className="bg-white">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Careers Guide</h1>
        <p>
        Data Science can be difficult to navigate career-wise. With so many options, it&apos;s easy to get swept away in a tide of information.
        </p>
        <p>
        That&apos;s why DataSoc&apos;s collated everything you need to get off the ground in our trusty Careers Guide! We&apos;ve got useful rundowns of the data industry landscape, practical tips on job searching, as well as insider info from sponsors and students alike.
        </p>
        <p>
        If you&apos;re looking for a place to start, some extra information, and some guidance from experienced professionals, have a check out of our Careers Guide! 
        </p>
      </header>
      <div className="flex items-center justify-center align-baseline p-6">
        <iframe className="w-2/3 h-screen" src={CAREERS_GUIDE}/>
      </div>
    </main>
  );
}