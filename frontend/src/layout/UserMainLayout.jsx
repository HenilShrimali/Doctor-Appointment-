import UserNavbar from "../components/UserNavbar";

function UserMainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />

      <main className="flex-1 p-4 text-black overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}

export default UserMainLayout;
