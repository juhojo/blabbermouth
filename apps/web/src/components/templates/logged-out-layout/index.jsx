import { Outlet, redirect } from "react-router";
import { auth, isTokenValid } from "../../../stores/auth-store";

export const LoggedOutLayoutLoader = async () => {
  if (!(await isTokenValid())) {
    return null;
  }
  throw redirect("/configs");
};

export const LoggedOutLayoutAction = async ({ request }) => {
  switch (request.method) {
    case "POST":
      const { email } = Object.fromEntries(await request.formData());
      const { error } = await auth({ email });

      if (!error) {
        throw redirect(`/auth/login?email=${encodeURIComponent(email)}`);
      }

      return { error };
    default:
      return null;
  }
};

export const LoggedOutLayout = () => {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col mx-auto h-screen max-w-2xl px-6 justify-center">
        <Outlet />
      </div>
    </div>
  );
};
