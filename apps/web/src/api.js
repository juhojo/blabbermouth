import axios from "axios";

// TODO: load as a vite env variable
// see: https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes
axios.defaults.baseURL = "http://localhost:3000/api/v1";

/**
 * Wraps axios requests and handles errors
 *
 * @param {Function} fn
 * @returns
 */
const axiosRequestWrapper = async (fn) => {
  try {
    const { data } = await fn();
    return { data, error: null };
  } catch (e) {
    console.log(e);
    if (axios.isAxiosError(e)) {
      return {
        data: null,
        error: {
          status: e.response.status,
          message: e.response.statusText,
        },
      };
    }

    return {
      data: null,
      error: {
        status: 500,
        message: "Unexpected error",
      },
    };
  }
};

const api = {
  async isTokenValid(token) {
    return axiosRequestWrapper(() =>
      axios.get("/auth/validate", {
        params: {
          token,
        },
      }),
    );
  },
  /**
   * Send a passcode email.
   *
   * @param {string} email
   * @returns data is an empty object
   */
  async auth(email) {
    return axiosRequestWrapper(() =>
      axios.post("/auth", {
        email,
      }),
    );
  },
  /**
   * Sign in using email and passcode
   *
   * @param {string} email
   * @param {number} passcode
   * @returns data is an object containing keys `user`, `token`, `exp`
   */
  async logIn(email, passcode) {
    return axiosRequestWrapper(() =>
      axios.post("/auth/login", {
        email,
        passcode,
      }),
    );
  },
};

export default api;
