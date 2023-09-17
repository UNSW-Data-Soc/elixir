import JobAddCard from "./jobAddCard";
import JobList from "./jobList";

export default function Jobs() {
    return (
        <main className="bg-white ">
            <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
                <h1 className="text-3xl font-semibold">Jobs Board</h1>
                <p>
                    Are you interested in gaining real-world experience to apply
                    knowledge learnt in your degree and fast forward your
                    career? Keep an eye out for internship and graduate
                    opportunities that are constantly updated on this page!
                </p>
            </header>
            <JobsContainer />
        </main>
    );
}

function JobsContainer() {
    return (
        <div className="container m-auto flex flex-col gap-5 p-10 flex-wrap justify-center">
            <JobAddCard />
            <JobList />
        </div>
    );
}
