export default function Resources() {
  return (
    <main className="bg-white ">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Resources</h1>
        <p>
          TODO: Get the description from the old website!
        </p>
      </header>
      <button style={{ backgroundColor: "red" }}>
        Add Resource (TODO: change this button to a clickable "+" card, only visible to mods/admins)
        {/* 
          HINT: To only show the button when user is a mod/admin:
            const session = await getServerSession();
            if (session) return redirect("/");
        */}
      </button>
      <p>TODO: Dialog for <b>tags</b> go here!</p>
    </main>
  );
}