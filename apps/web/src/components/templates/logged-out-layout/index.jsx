import { Outlet } from "react-router";

function LoggedOutLayout() {
  return (
    <div>
      Hello!
      <Outlet />
    </div>
  )
}

export default LoggedOutLayout