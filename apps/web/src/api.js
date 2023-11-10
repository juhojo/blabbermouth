import axios from "axios";
import { z } from "zod";
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

/**
 * Validated API call
 *
 * @param {Function} apiFn API function
 * @param {z.ZodSchema} schema validation schema
 * @returns
 */
export const validatedApiCall =
  (apiFn, schema) =>
  /**
   * @param {*} data payload to validate
   * @returns
   */
  async (data) => {
    try {
      const validatedData = await schema.parseAsync(data);

      return await apiFn(validatedData);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const issues = e.issues.reduce((acc, issue) => {
          issue.path.forEach((path) => {
            if (!acc[path]) {
              acc[path] = "";
            }
            acc[path] = acc[path].concat(" ", issue.message, ".");
            acc[path] = acc[path].trimStart();
          });

          return acc;
        }, {});

        return {
          error: {
            status: 400,
            issues,
          },
        };
      }
      return null;
    }
  };

const api = {
  isNotFound(error) {
    return error && error.status === 404;
  },

  isUnauthorized(error) {
    return error && error.status === 401;
  },

  isForbidden(error) {
    return error && error.status === 403;
  },

  isServerError(error) {
    return error && error.status >= 500;
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
   *
   * @param {{ email: string }} data
   * @returns data is an empty object
   */
  async auth({ email }) {
    return axiosRequestWrapper(() =>
      axios.post("/auth", {
        email,
      }),
    );
  },
  /**
   * Sign in using email and passcode
   *
   * @param {{
   *  email: string
   *  passcode: number
   * }} data
   * @returns data is an object containing keys `user`, `token`, `exp`
   */
  async logIn({ email, passcode }) {
    return axiosRequestWrapper(() =>
      axios.post("/auth/login", {
        email,
        passcode: Number(passcode),
      }),
    );
  },
  /**
   * Get configs
   *
   * @returns
   */
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
  /**
   * Get a config
   *
   * @param {number} configId
   * @returns
   */
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
  /**
   * Create a config
   *
   * @param {{
   *  name: string
   * }} data
   * @returns
   */
  async createConfig({ name }) {
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
  /**
   * Update a config
   *
   * @param {number} configId
   * @param {{
   *  name: string
   * }} data
   * @returns
   */
  async updateConfig(configId, { name }) {
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
  /**
   * Delete a config
   *
   * @param {number} configId
   * @returns
   */
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
  /**
   * Create a field
   *
   * @param {number} configId
   * @param {{ key: string, value: string }} data
   * @returns
   */
  async createField(configId, { key, value }) {
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
  /**
   * Update a field
   *
   * @param {number} configId
   * @param {number} fieldId
   * @param {{
   *  key: string,
   *  value: string
   * }} data
   * @returns
   */
  async updateField(configId, fieldId, { key, value }) {
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
  /**
   * Delete a field
   *
   * @param {number} configId
   * @param {number} fieldId
   * @returns
   */
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
