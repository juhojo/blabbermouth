import { Outlet, redirect } from "react-router";
import { useFetcher } from "react-router-dom";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import { LogOut } from "../../tokens";
import { isTokenValid } from "../../../stores/auth-store";

export const LoggedInLayoutLoader = async () => {
  if (!(await isTokenValid())) {
    throw redirect("/auth");
  }
  return null;
};

export const LoggedInLayout = () => {
  const fetcher = useFetcher();

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col mx-auto h-screen max-w-2xl px-6">
        <h1 className="my-16 text-center text-2xl md:text-6xl text-gray-950">
          blabbermouth
        </h1>
        <div className="flex justify-end">
          <fetcher.Form method="delete" action="/logout">
            <Button type="submit" variant="text">
              <div className="flex gap-1">
                <LogOut />
                <Typography>log out</Typography>
              </div>
            </Button>
          </fetcher.Form>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
