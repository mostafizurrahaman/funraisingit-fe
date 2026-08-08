import { baseApi } from "@/redux/api/baseApi";

const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Donations
    getAllDonation: builder.query({
      query: (params) => ({
        url: "/donation/all",
        method: "GET",
        params,
      }),
      providesTags: ["Donation"],
    }),

    // Get Donation Overview
    getDonationOverview: builder.query({
      query: (params) => ({
        url: "/donation/overview",
        method: "GET",
        params,
      }),
      providesTags: ["Donation"],
    }),

    // Get Single Donation
    getSingleDonation: builder.query({
      query: (id) => ({
        url: `/donation/${id}`,
        method: "GET",
      }),
      providesTags: ["Donation"],
    }),

    // Create Donation
    createDonation: builder.mutation({
      query: (data) => ({
        url: "/donation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Donation"],
    }),

    // Update Donation
    updateDonation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/donation/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Donation"],
    }),

    // Delete Donation
    deleteDonation: builder.mutation({
      query: (id) => ({
        url: `/donation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donation"],
    }),
  }),
});

export const {
  useGetAllDonationQuery,
  useGetDonationOverviewQuery,
  useGetSingleDonationQuery,
  useCreateDonationMutation,
  useUpdateDonationMutation,
  useDeleteDonationMutation,
} = donationApi;