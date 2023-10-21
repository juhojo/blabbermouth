import React from "react";
import ReactDOM from "react-dom/client";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect } from "react-router-dom"
import "./index.css";
import api from "./api";
import LoggedOutLayout from "./components/templates/logged-out-layout/index.jsx";
import Auth from "./components/pages/auth/index.jsx";
import Login from "./components/pages/auth/login/index.jsx";
import LoggedInLayout from "./components/templates/logged-in-layout/index.jsx";
import Configs from "./components/pages/configs/index.jsx";
import Config from "./components/pages/configs/config/index.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/auth"
        loader={async () => {
          const token = JSON.parse(localStorage.getItem('auth-store'))?.state?.token
          const { error } = await api.isTokenValid(token)
          if (!error) {
            throw redirect('/')
          }
          return null
        }}
        element={<LoggedOutLayout />}>
        <Route index element={<Auth />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route
        path="/"
        loader={async () => {
          const token = JSON.parse(localStorage.getItem('auth-store'))?.state?.token
          const { error } = await api.isTokenValid(token)
          if (error) {
            throw redirect('/auth')
          }
          return null
        }}
        element={<LoggedInLayout />}>
        <Route index element={<Configs />} />
        <Route path="/:cid" element={<Config />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
