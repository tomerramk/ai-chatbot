import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-teal-50 text-gray-800">
      <header className="flex h-16 items-center justify-between px-6 bg-teal-600 text-white shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">AI Chatroom</h1>
        </div>
      </header>
      <main className="flex h-full min-h-0 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
