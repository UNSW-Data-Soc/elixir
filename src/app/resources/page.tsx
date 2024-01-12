import ResourceAddCard from "./resourceAddCard";
import ResourcesList from "./resourcesList";

export default function Resources() {
  return (
    <main className="relative flex-grow bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Resources</h1>
        <p>
          Missed out on one of our workshops? Want to brush up on some new
          skills? Well, browse through all of our learning resources from
          previous events here!
        </p>
      </header>
      <ResourcesContainer />
      <div className="absolute bottom-5 right-5">
        <ResourceAddCard />
      </div>
    </main>
  );
}

function ResourcesContainer() {
  return (
    <div className="container m-auto flex flex-wrap justify-center gap-5 p-10">
      <ResourcesList />
    </div>
  );
}
