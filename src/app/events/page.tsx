import EventAddCard from "./eventAddCard";
import EventList from "./eventList";

export default function Events() {
  return (
    <main className="relative flex-grow bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Events</h1>
        <p>
          From social events to workshops to networking opportunities, stay
          updated to make sure you don&apos;t miss out!
        </p>
      </header>
      <div className="flex w-full flex-wrap justify-center gap-5 p-10">
        <div className="absolute bottom-5 right-5 z-50">
          <EventAddCard />
        </div>
        <EventList />
      </div>
    </main>
  );
}
