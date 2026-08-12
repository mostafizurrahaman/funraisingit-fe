import { baseApi } from "@/redux/api/baseApi";

const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayoutHistory: builder.query({
      query: ({ campaignId, page = 1, limit = 10 }) => ({
        url: `/payout/${campaignId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Campaign"],
    }),
    getPayoutOverview: builder.query({
      query: (campaignId) => ({
        url: `/payout/${campaignId}/overview`,
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),
  }),
});

export const {
  useGetPayoutHistoryQuery,
  useGetPayoutOverviewQuery,
} = payoutApi;
