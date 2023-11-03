import { Outlet } from "react-router";

function LoggedOutLayout() {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col mx-auto h-screen max-w-2xl px-6 justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default LoggedOutLayout;
