import ResourceAddCard from "./resourceAddCard";
import ResourcesList from "./resourcesList";

export default function Resources() {
  return (
    <main className="bg-white ">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Resources</h1>
        <p>
          Missed out on one of our workshops? Want to brush up on some new
          skills? Well, browse through all of our learning resources from
          previous events here!
        </p>
      </header>
      <ResourcesContainer />
    </main>
  );
}

async function ResourcesContainer() {
  return (
    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
      <ResourceAddCard />
      <ResourcesList />
    </div>
  );
}
