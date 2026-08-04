import { baseApi } from "@/redux/api/baseApi";

const DashboardAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: (campaignId) => ({
        url: `/analytics?campaignId=${campaignId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = DashboardAnalyticsApi;
