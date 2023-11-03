import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import "./index.css";
import LoggedOutLayout from "./components/templates/logged-out-layout/index.jsx";
import Auth from "./components/pages/auth/index.jsx";
import Login from "./components/pages/auth/login/index.jsx";
import LoggedInLayout from "./components/templates/logged-in-layout/index.jsx";
import Configs from "./components/pages/configs/index.jsx";
import Config from "./components/pages/configs/config/index.jsx";
import { auth, isTokenValid, logIn, logOut } from "./stores/auth-store";
import api from "./api";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/auth"
        loader={async () => {
          if (!(await isTokenValid())) {
            return null;
          }
          throw redirect("/configs");
        }}
        action={async ({ request }) => {
          const { email } = Object.fromEntries(await request.formData());
          const { error } = await auth(email);
          if (!error) {
            throw redirect(`/auth/login?email=${encodeURIComponent(email)}`);
          }
          return { error };
        }}
        element={<LoggedOutLayout />}
      >
        <Route index element={<Auth />} />
        <Route
          path="login"
          action={async ({ request }) => {
            const { email, passcode } = Object.fromEntries(
              await request.formData(),
            );
            return await logIn(email, Number(passcode));
          }}
          element={<Login />}
        />
      </Route>
      <Route
        path="logout"
        action={() => {
          logOut();
          throw redirect("/auth");
        }}
      />
      <Route
        path="/configs"
        loader={async () => {
          if (!(await isTokenValid())) {
            throw redirect("/auth");
          }
          return null;
        }}
        element={<LoggedInLayout />}
      >
        <Route
          index
          loader={async () => {
            if (!(await isTokenValid())) {
              throw redirect("/auth");
            }
            const { data, error } = await api.getConfigs();
            return { data, error };
          }}
          action={async ({ request }) => {
            switch (request.method) {
              case "POST":
                const { name } = Object.fromEntries(await request.formData());
                return await api.createConfig(name);
              default:
                return null;
            }
          }}
          element={<Configs />}
        />
        <Route
          path=":cid"
          loader={async ({ params }) => {
            const { data, error } = await api.getConfig(params.cid);
            if (api.isNotFound(error)) {
              throw redirect("/configs");
            }
            return { data, error };
          }}
          action={async ({ request, params }) => {
            switch (request.method) {
              case "DELETE":
                return await api.deleteConfig(params.cid);
              case "PATCH":
                const { name } = Object.fromEntries(await request.formData());
                return await api.updateConfig(params.cid, name);
              default:
                return null;
            }
          }}
          element={<Config />}
        />
        <Route
          path=":cid/fields"
          action={async ({ request, params }) => {
            switch (request.method) {
              case "POST":
                const { key, value } = Object.fromEntries(
                  await request.formData(),
                );
                return await api.createField(params.cid, key, value);
              default:
                return null;
            }
          }}
        />
        <Route
          path=":cid/fields/:fid"
          action={async ({ request, params }) => {
            switch (request.method) {
              case "DELETE":
                return await api.deleteField(params.cid, params.fid);
              case "PATCH":
                const { key, value } = Object.fromEntries(
                  await request.formData(),
                );
                return await api.updateField(
                  params.cid,
                  params.fid,
                  key,
                  value,
                );
              default:
                return null;
            }
          }}
        />
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
