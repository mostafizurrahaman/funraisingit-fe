import { baseApi } from "@/redux/api/baseApi";

const DashboardAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => ({
        url: "/dashboard/analytics",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = DashboardAnalyticsApi;
