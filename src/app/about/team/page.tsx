import UsersList from "./usersList";

export default async function Users() {
  return (
    <main className="flex-grow bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Our Team</h1>
        <p>
          Meet the DataSoc team working to create new opportunities for students
          to connect, grow and feel supported.
        </p>
      </header>
      <div className="m-auto flex max-w-7xl flex-wrap justify-center gap-5 p-5 md:p-10">
        <UsersList />
      </div>
    </main>
  );
}
