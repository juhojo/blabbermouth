import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import {
  LoggedOutLayout,
  LoggedOutLayoutAction,
  LoggedOutLayoutLoader,
} from "./components/templates/logged-out-layout/index.jsx";
import { Auth } from "./components/pages/auth/index.jsx";
import { Login, LoginAction } from "./components/pages/auth/login/index.jsx";
import {
  LoggedInLayout,
  LoggedInLayoutLoader,
} from "./components/templates/logged-in-layout/index.jsx";
import {
  Configs,
  ConfigsAction,
  ConfigsLoader,
} from "./components/pages/configs/index.jsx";
import {
  Config,
  ConfigAction,
  ConfigLoader,
} from "./components/pages/configs/config/index.jsx";
import { LogoutAction } from "./components/pages/logout";
import { FieldsAction } from "./components/pages/configs/config/fields";
import { FieldAction } from "./components/pages/configs/config/fields/field";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/auth"
        loader={LoggedOutLayoutLoader}
        action={LoggedOutLayoutAction}
        element={<LoggedOutLayout />}
      >
        <Route index element={<Auth />} />
        <Route path="login" action={LoginAction} element={<Login />} />
      </Route>
      <Route path="logout" action={LogoutAction} />
      <Route
        path="/configs"
        loader={LoggedInLayoutLoader}
        element={<LoggedInLayout />}
      >
        <Route
          index
          loader={ConfigsLoader}
          action={ConfigsAction}
          element={<Configs />}
        />
        <Route
          path=":cid"
          loader={ConfigLoader}
          action={ConfigAction}
          element={<Config />}
        />
        <Route path=":cid/fields" action={FieldsAction} />
        <Route path=":cid/fields/:fid" action={FieldAction} />
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
