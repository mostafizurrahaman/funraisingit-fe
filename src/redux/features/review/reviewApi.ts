import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewStatus: builder.query({
      query: () => ({
        url: "/review/status",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    skipReview: builder.mutation({
      query: () => ({
        url: "/review/skip",
        method: "POST",
      }),
      invalidatesTags: ["Review"],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: "/review",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review"],
    }),
    getAllReviews: builder.query({
      query: (params) => ({
        url: "/review/all",
        method: "GET",
        params,
      }),
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useGetReviewStatusQuery,
  useSkipReviewMutation,
  useCreateReviewMutation,
  useGetAllReviewsQuery,
} = reviewApi;
export default reviewApi;
