'use client';

import Image from 'next/image';
import arcLogo from '/public/arc.png';
import unswMathsLogo from '/public/unswmaths.png';
import lightBulbIdea from '/public/lightbulb_idea.png';
import bulletinBoard from '/public/bulletin_board.png';
import graphicDesign from '/public/graphic_design.png';
import zoom from '/public/zoom.png';
import book from '/public/book.png';
import coffee from '/public/coffee.png';
import thumbsUp from '/public/thumbs_up.png';
import sunglasses from '/public/sunglasses.png';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function About() {
  return (
    <main className='bg-white'>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>About Us</h1>
        <p>
          What we really do. Learn about the society that continually seeks the
          best for students.
        </p>
      </header>
      <section className='flex flex-col my-14 mx-4 lg:mx-72 xl:mx-200 2xl:mx-200'>
        <h3 className='text-xl font-semibold'>
          Uniting mathematicians, econometricians and computer scientists, UNSW
          DataSoc seeks to empower our members with knowledge and skills of data
          science, machine learning and artificial intelligence.
        </h3>
        <h1 className='text-5xl font-semibold mt-20 mb-8'>Affiliated with</h1>
        <div className='flex flex-col md:flex-row justify-between w-full'>
          <Image src={unswMathsLogo} height={100} alt='UNSW Maths Logo' />
          <Image src={arcLogo} height={100} alt='Arc Logo' />
        </div>
        <h1 className='text-5xl font-semibold mt-20 mb-8'>Our Goals</h1>
        <ul className='flex flex-col space-y-4'>
          <li className='flex flex-row space-x-12'>
            <Image
              src={lightBulbIdea}
              className='object-contain'
              width={100}
              alt='Light Bulb Idea'
            />
            <p>
              DataSoc aims to become Australia’s leading student run society
              platform in assisting students on achieving their data science
              career goals.
            </p>
          </li>
          <li className='flex flex-row space-x-12'>
            <Image
              src={bulletinBoard}
              className='object-contain'
              width={100}
              alt='Bulletin Board'
            />
            <p>
              We strive to create the data science related opportunities for
              students in their studies and careers alike. We host information
              sessions, networking evenings, and many more career-focused events
              that could help open new pathways for students.
            </p>
          </li>
          <li className='flex flex-row space-x-12'>
            <Image
              src={graphicDesign}
              className='object-contain'
              width={100}
              alt='Graphic Design'
            />
            <p>
              We aim to enrich students&apos; lives with a sense of community and
              diversity among UNSW data science students. We host a list of
              various social activities such as BBQs, competitions, etc. that
              welcome everyone to attend and meet like minded people.
            </p>
          </li>
          <li className='flex flex-row space-x-12'>
            <Image
              src={zoom}
              className='object-contain'
              width={100}
              alt='Zoom'
            />
            <p>
              We want to support data science students in their studies with
              DataSoc’s help sessions, workshops and peer supporters.
            </p>
          </li>
        </ul>
        <p className='mt-10 font-semibold'>
          With this, DataSoc aims to make your university experience even more
          fun and fulfilling, whilst maximizing your employment opportunity and
          career progression in data science.
        </p>
        <h2 className='text-3xl font-semibold text-center mt-12'>
          &quot;Opportunities don&apos;t happen. You create them.&quot;
        </h2>
        <h1 className='text-5xl font-semibold mt-20 mb-8'>Our Values</h1>
        <p className='mb-10'>
          Our successes to date could not have be achieved without our thriving
          subcommittee teams year after year. Here are our core values that
          persists amongst all portfolios:
        </p>
        <ul className='flex flex-col space-y-4'>
          <li className='flex flex-row space-x-12'>
            <Image
              src={book}
              width={100}
              className='object-contain'
              alt='Book Icon'
            />
            <div>
              <strong>Learn continuously and effectively</strong>
              <p>
                We seek to provide innovative and meaningful experiences for
                students, adapting to change and committing to ongoing
                development. We highly encourage you to actively seek ways to
                improve and find new ways to solve problems.
              </p>
            </div>
          </li>
          <li className='flex flex-row space-x-12'>
            <Image
              src={coffee}
              className='object-contain'
              width={100}
              alt='Coffee Icon'
            />
            <div>
              <strong>Have a good time</strong>
              <p>
                At DataSoc, it is important to us that every experience here is
                a constructive and positive one. After every event and every
                meeting, we want you all to be leaving with a smile and a new
                friend!
              </p>
            </div>
          </li>
          <li className='flex flex-row space-x-12'>
            <Image
              src={thumbsUp}
              className='object-contain'
              width={100}
              alt='Thumbs Up Icon'
            />
            <div>
              <strong>Be the best at what you do</strong>
              <p>
                What distinguishes DataSoc members from others, despite having
                all different areas and expertise? It&apos;s the passion that we
                bring to everything we do. We approach every task with
                confidence, seize all opportunities and never settle for
                &quot;acceptable&quot;.
              </p>
            </div>
          </li>
          <li className='flex flex-row space-x-12'>
            <Image
              src={sunglasses}
              className='object-contain'
              width={100}
              alt='Sunglasses Icon'
            />
            <div>
              <strong>Take ownership and be transparent</strong>
              <p>
                As the DataSoc team, we celebrate the individual work and
                achievement of others, but must also be accountable for the
                tasks to which we have committed and see through what we
                started.
              </p>
            </div>
          </li>
        </ul>
        <h1 className='text-5xl font-semibold mt-20 mb-8'>Our History</h1>
        <VerticalTimeline animate={false} lineColor='#D3D3D3'>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            visible={true}
          >
            <h3 className='vertical-timeline-element-title text-2xl font-semibold'>
              April, 2017
            </h3>
            <p>
              DataSoc was founded along side its very first iteration of the
              official website!
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            visible={true}
          >
            <h3 className='vertical-timeline-element-title text-2xl font-semibold'>
              May, 2017
            </h3>
            <p>
              DataSoc announces and hosts its first ever event: Meet the
              representatives of Tableau Software, and get to know the power of
              Tableau in AI and modern data science.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            visible={true}
          >
            <h3 className='vertical-timeline-element-title text-2xl font-semibold'>
              June, 2017
            </h3>
            <p>
              DataSoc hosts its first ever networking night with Alibaba,
              Suncorp, Bupa, and many more.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            visible={true}
          >
            <h3 className='vertical-timeline-element-title text-2xl font-semibold'>
              March, 2018
            </h3>
            <p>
              DataSoc celebrates 1000 likes and 1000+ follows on Facebook! This
              month also marks the beginning of DataSoc&apos;s Weekly Data
              Discoveries tradition that continues to this day in our
              newsletters!
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            visible={true}
          >
            <h3 className='vertical-timeline-element-title text-2xl font-semibold'>
              September, 2019
            </h3>
            <p>
              As we celebrate 2000 likes on Facebook, we hosted our first ever
              international datathon in conjunction with Tsinghua University&apos;s
              Institute of Data Science!
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            visible={true}
          >
            <h3 className='vertical-timeline-element-title text-2xl font-semibold'>
              March, 2020
            </h3>
            <p>
              DataSoc&apos;s website undergoes a modern transformation as we double
              our subcommitee team.
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </section>
    </main>
  );
}
