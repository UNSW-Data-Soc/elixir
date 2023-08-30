import UsersList from "./usersList";

export default async function Users() {
    return (
        <main className="bg-white ">
            <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
                <h1 className="text-3xl font-semibold">Our Team</h1>
                <p>
                    Meet the DataSoc team working to create new opportunities
                    for students to connect, grow and feel supported.
                </p>
            </header>
            <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
                <UsersList />
            </div>
        </main>
    );
}
