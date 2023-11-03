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

export const getUser = () => useAuthStore.getState().user;

export const getToken = () => useAuthStore.getState().token;

export const isTokenValid = async () => {
  const { token } = useAuthStore.getState();

  if (!token) {
    return false;
  }
  const { error, data } = await api.isTokenValid(token);

  if (error || !data.valid) {
    return false;
  }
  return true;
};

export const auth = async (email) => {
  const { error } = await api.auth(email);
  return { error };
};

export const logIn = async (email, passcode) => {
  const { data, error } = await api.logIn(email, passcode);
  if (error) {
    return { error };
  }
  useAuthStore.setState(data);
  return { error: null };
};

export const logOut = () => useAuthStore.setState(initialState);
