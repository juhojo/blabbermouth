import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";

const initialState = {
  token: undefined,
  exp: undefined,
  user: null,
};

export const useAuthStore = create()(
  persist(
    () => ({
      ...initialState,
    }),
    {
      name: "auth-store",
    },
  ),
);

export const logIn = async (email, passcode) => {
  const { data, error } = await api.logIn(email, passcode);
  if (error) return;
  useAuthStore.setState(data);
};

export const logOut = () => useAuthStore.setState(initialState);
