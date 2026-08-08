import { baseApi } from "@/redux/api/baseApi";

const SupportersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Supporter
    createSupporter: builder.mutation({
      query: (data) => ({
        url: "/supporters",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supporters"],
    }),

    // Get All Supporters
    getAllSupporters: builder.query({
      query: (params) => ({
        url: "/supporter/all",
        method: "GET",
        params,
      }),
      providesTags: ["Supporters"],
    }),

    // Get Supporters Overview
    getSupportersOverview: builder.query({
      query: (params) => ({
        url: "/supporter/overview",
        method: "GET",
        params,
      }),
      providesTags: ["Supporters"],
    }),

    // Get Single Supporter
    getSingleSupporter: builder.query({
      query: (id) => ({
        url: `/supporters/${id}`,
        method: "GET",
      }),
      providesTags: ["Supporters"],
    }),

    // Update Supporter
    updateSupporter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/supporters/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Supporters"],
    }),

    // Delete Supporter
    deleteSupporter: builder.mutation({
      query: (id) => ({
        url: `/supporters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supporters"],
    }),
  }),
});

export const {
  useCreateSupporterMutation,
  useGetAllSupportersQuery,
  useGetSupportersOverviewQuery,
  useGetSingleSupporterQuery,
  useUpdateSupporterMutation,
  useDeleteSupporterMutation,
} = SupportersApi;