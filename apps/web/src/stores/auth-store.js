import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import api, { validatedApiCall } from "../api";

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

export const auth = async (data) => {
  const { error } = await validatedApiCall(
    api.auth,
    z.object({
      email: z.string().email(),
    }),
  )(data);

  return { error };
};

export const logIn = async ({ email, passcode }) => {
  const { data, error } = await validatedApiCall(
    api.logIn,
    z.object({
      email: z.string().email(),
      passcode: z.string().transform((value, ctx) => {
        const parsed = parseInt(value, 10);

        if (isNaN(parsed) || parsed <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Not an ID",
          });

          return z.NEVER;
        }

        return parsed;
      }),
    }),
  )({ email, passcode });

  if (error) {
    return { error };
  }

  useAuthStore.setState(data);

  return { error: null };
};

export const logOut = () => useAuthStore.setState(initialState);
