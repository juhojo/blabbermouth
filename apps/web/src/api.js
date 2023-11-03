import axios from "axios";
import { getToken, getUser } from "./stores/auth-store";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Wraps axios requests and handles errors
 *
 * @param {Function} fn
 * @returns
 */
const axiosRequestWrapper = async (fn) => {
  try {
    const {
      data,
      config: { method, url },
    } = await fn();
    return { data, error: null, request: { method, url } };
  } catch (e) {
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
  isNotFound(error) {
    return error && error.status === 404;
  },

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

  async getConfigs() {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.get(`/users/${user.id}/configs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },

  async getConfig(configId) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.get(`/users/${user.id}/configs/${configId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },

  async createConfig(name) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.post(
        `/users/${user.id}/configs`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  },

  async updateConfig(configId, name) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.patch(
        `/users/${user.id}/configs/${configId}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  },

  async deleteConfig(configId) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.delete(`/users/${user.id}/configs/${configId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },

  async createField(configId, key, value) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.post(
        `/users/${user.id}/configs/${configId}/fields`,
        {
          key,
          value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  },

  async updateField(configId, fieldId, key, value) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.patch(
        `/users/${user.id}/configs/${configId}/fields/${fieldId}`,
        {
          key,
          value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
  },

  async deleteField(configId, fieldId) {
    const user = getUser();
    const token = getToken();
    return axiosRequestWrapper(() =>
      axios.delete(`/users/${user.id}/configs/${configId}/fields/${fieldId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },
};

export default api;
