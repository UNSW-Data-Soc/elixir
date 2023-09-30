import EventRoot from "./eventRoot";


export default function Events() {
  return (
    <main className='bg-white '>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Events</h1>
        <p> From social events to workshops to networking opportunities, stay updated to make sure you don&apos;t miss out!</p>
      </header>
      <EventRoot/>
    </main>
  );
}
