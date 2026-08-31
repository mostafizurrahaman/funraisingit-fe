import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { RootState } from "../store";
import { BASE_URL } from "@/utils/baseUrl";
import toast from "react-hot-toast";
import { logout, setTokens } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  // credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state?.auth?.token || localStorage.getItem("token");
    // console.log("token from baseAPI", token);

    if (token) {
      const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      headers.set("Authorization", authHeader);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const errorData = (result.error.data as { message?: string }) || {};
    const errorMessage = errorData.message || "Something went wrong";

    if (status === 500) {
      toast.error(errorMessage, { id: errorMessage });
    } else if (status === 404 && errorMessage !== "No Draft campaign exists." && errorMessage !== "User doesn't exists!" && errorMessage !== "Account not found" )   {
      toast.error(errorMessage, { id: errorMessage });
    } else if (status === 403) {
      toast.error(errorMessage, { id: errorMessage });
    } else if (status === 401) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (currentPath !== "/login") {
        const state = api.getState() as RootState;
        const refreshToken = state?.auth?.refreshToken || localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const refreshResult = await baseQuery(
              {
                url: "/auth/refresh-token",
                method: "POST",
                body: { refreshToken },
              },
              api,
              extraOptions
            );

            if (refreshResult.data) {
              const resData = refreshResult.data as any;
              const newToken =
                resData?.token ||
                resData?.data?.token ||
                resData?.accessToken ||
                resData?.data?.accessToken;
              const newRefreshToken =
                resData?.refreshToken ||
                resData?.data?.refreshToken;

              if (newToken) {
                api.dispatch(setTokens({ token: newToken, refreshToken: newRefreshToken }));
                // Retry the original query
                result = await baseQuery(args, api, extraOptions);
                return result;
              }
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr);
          }
        }

        // Session expired / invalid refresh token
        toast.error("Session expired. Please log in again.", { id: "session-expired" });
        api.dispatch(logout());
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "Donation",
    "Order",
    "Settings",
    "Supporters",
    "Campaign",
    "Review"
  ],
  endpoints: () => ({}),
});
