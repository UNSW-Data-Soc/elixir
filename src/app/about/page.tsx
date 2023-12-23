import Image from "next/image";

import DataSocTimeline from "./timeline";
import arcLogo from "/public/arc.png";
import book from "/public/book.png";
import bulletinBoard from "/public/bulletin_board.png";
import coffee from "/public/coffee.png";
import graphicDesign from "/public/graphic_design.png";
import lightBulbIdea from "/public/lightbulb_idea.png";
import sunglasses from "/public/sunglasses.png";
import thumbsUp from "/public/thumbs_up.png";
import unswMathsLogo from "/public/unswmaths.png";
import zoom from "/public/zoom.png";

export default function About() {
  return (
    <main className="bg-white">
      <header className="text-white p-8 sm:p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">About Us</h1>
        <p>
          What we really do. Learn about the society that continually seeks the
          best for students.
        </p>
      </header>
      <section className="flex flex-col gap-8 py-8 sm:py-14 px-4 mx-4 lg:mx-72 xl:mx-200 2xl:mx-200">
        <p className="sm:text-xl font-light border-l-5 pl-4">
          Uniting mathematicians, econometricians and computer scientists, UNSW
          DataSoc seeks to empower our members with knowledge and skills of data
          science, machine learning and artificial intelligence.
        </p>
        <section className="flex flex-col gap-3 sm:gap-8">
          <h2 className="text-3xl sm:text-5xl font-semibold">
            Affiliated with
          </h2>
          <div className="flex flex-col gap-5  items-center md:flex-row md:justify-between w-full">
            <Image src={unswMathsLogo} height={100} alt="UNSW Maths Logo" />
            <Image src={arcLogo} height={100} alt="Arc Logo" />
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl sm:text-5xl font-semibold">Our Goals</h2>
          <ul className="flex flex-col space-y-4">
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image src={lightBulbIdea} width={100} alt="Light Bulb Idea" />
              </div>
              <p className="text-start sm:text-justify">
                DataSoc aims to become Australia&apos;s leading student run
                society platform in assisting students on achieving their data
                science career goals.
              </p>
            </li>
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image src={bulletinBoard} width={100} alt="Bulletin Board" />
              </div>
              <p className="text-start sm:text-justify">
                We strive to create the data science related opportunities for
                students in their studies and careers alike. We host information
                sessions, networking evenings, and many more career-focused
                events that could help open new pathways for students.
              </p>
            </li>
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image src={graphicDesign} width={100} alt="Graphic Design" />
              </div>
              <p className="text-start sm:text-justify">
                We aim to enrich students&apos; lives with a sense of community
                and diversity among UNSW data science students. We host a list
                of various social activities such as BBQs, competitions, etc.
                that welcome everyone to attend and meet like minded people.
              </p>
            </li>
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image src={zoom} width={100} alt="Zoom" />
              </div>
              <p className="text-start sm:text-justify">
                We want to support data science students in their studies with
                DataSoc’s help sessions, workshops and peer supporters.
              </p>
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-12">
          <p className="text-center font-semibold">
            With this, DataSoc aims to make your university experience even more
            fun and fulfilling, whilst maximizing your employment opportunity
            and career progression in data science.
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">
            &quot;Opportunities don&apos;t happen. You create them.&quot;
          </h2>
        </section>
        <section className="flex flex-col gap-3 sm:gap-8">
          <h1 className="text-3xl sm:text-5xl font-semibold">Our Values</h1>
          <p className="">
            Our successes to date could not have be achieved without our
            thriving subcommittee teams year after year. Here are our core
            values that persists amongst all portfolios:
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image src={book} width={100} alt="Book Icon" />
              </div>
              <div>
                <strong>Learn continuously and effectively</strong>
                <p className="text-start sm:text-justify">
                  We seek to provide innovative and meaningful experiences for
                  students, adapting to change and committing to ongoing
                  development. We highly encourage you to actively seek ways to
                  improve and find new ways to solve problems.
                </p>
              </div>
            </li>
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image src={coffee} width={100} alt="Coffee Icon" />
              </div>
              <div>
                <strong>Have a good time</strong>
                <p className="text-start sm:text-justify">
                  At DataSoc, it is important to us that every experience here
                  is a constructive and positive one. After every event and
                  every meeting, we want you all to be leaving with a smile and
                  a new friend!
                </p>
              </div>
            </li>
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image
                  src={thumbsUp}
                  className="object-contain"
                  width={100}
                  alt="Thumbs Up Icon"
                />
              </div>
              <div>
                <strong>Be the best at what you do</strong>
                <p className="text-start sm:text-justify">
                  What distinguishes DataSoc members from others, despite having
                  all different areas and expertise? It&apos;s the passion that
                  we bring to everything we do. We approach every task with
                  confidence, seize all opportunities and never settle for
                  &quot;acceptable&quot;.
                </p>
              </div>
            </li>
            <li className="flex flex-row-reverse sm:flex-row items-center gap-4">
              <div className="basis-12 sm:basis-16 flex-grow-0 flex-shrink-0 flex justify-center items-center">
                <Image
                  src={sunglasses}
                  className="object-contain"
                  width={100}
                  alt="Sunglasses Icon"
                />
              </div>
              <div>
                <strong>Take ownership and be transparent</strong>
                <p className="text-start sm:text-justify">
                  As the DataSoc team, we celebrate the individual work and
                  achievement of others, but must also be accountable for the
                  tasks to which we have committed and see through what we
                  started.
                </p>
              </div>
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-5">
          <h2 className="text-3xl sm:text-5xl font-semibold">Our History</h2>
          <DataSocTimeline />
        </section>
      </section>
    </main>
  );
}
