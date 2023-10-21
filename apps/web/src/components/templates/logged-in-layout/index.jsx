import { Outlet } from "react-router";

function LoggedInLayout() {
  return (
    <div>
      Howdy! Hei?
      <Outlet />
    </div>
  )
}

export default LoggedInLayout