import { redirect } from "react-router";
import { logOut } from "../../../stores/auth-store";

export const LogoutAction = ({ request }) => {
  switch (request.method) {
    case "DELETE":
      logOut();
      throw redirect("/auth");
    default:
      return null;
  }
};
