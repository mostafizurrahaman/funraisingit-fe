import { baseApi } from "@/redux/api/baseApi";

const campaignApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCampaign: build.mutation({
      query: (formData) => ({
        url: "/campaign",
        method: "POST",
        body: formData,
      }),
    }),
    addProduct: build.mutation({
      query: ({ campaignId, formData }) => ({
        url: `/product/${campaignId}/add-product`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Campaign"],
    }),
    getCampaignPreview: build.query({
      query: ({ campaignId }) => ({
        url: `/campaign/${campaignId}/preview`,
        method: "POST",
        body: {},
      }),
    }),
    launchCampaign: build.mutation({
      query: ({ campaignId, body }) => ({
        url: `/campaign/${campaignId}/launch`,
        method: "POST",
        body: body || {},
      }),
    }),
    cancelCampaign: build.mutation({
      query: ({ campaignId, cancelledReason }) => ({
        url: `/campaign/${campaignId}/cancel`,
        method: "PATCH",
        body: { cancelledReason },
      }),
      invalidatesTags: ["Campaign"],
    }),
    completeCampaign: build.mutation({
      query: (id) => ({
        url: `/campaign/${id}/early-complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Campaign"],
    }),
    getCampaignById: build.query({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),
    updateProduct: build.mutation({
      query: ({ productId, formData }) => ({
        url: `/product/${productId}/update-product`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Campaign"],
    }),
    deleteProduct: build.mutation({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),
    getAllCampaigns: build.query({
      query: (params) => ({
        url: "/campaign/all",
        method: "GET",
        params,
      }),
      providesTags: ["Campaign"],
    }),
    getCampaignsByCode: build.query({
      query: (code) => ({
        url: `/campaign/${code}/details`,
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),
    generateCampaignStory: build.mutation({
      query: (body) => ({
        url: "/campaign/story",
        method: "POST",
        body,
      }),
    }),
    updateCampaign: build.mutation({
      query: ({ campaignId, formData }) => ({
        url: `/campaign/${campaignId}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    getDraftCampaigns: build.query({
      query: () => ({
        url: "/campaign/draft",
        method: "GET",
      }),
      providesTags: ["Campaign"],
    }),
    getAllActiveCampaigns: build.query({
      query: (params) => ({
        url: "/campaign/all/active",
        method: "GET",
        params,
      }),
      providesTags: ["Campaign"],
    }),
    getAllMyCampaigns: build.query({
      query: (params) => ({
        url: "/campaign/my",
        method: "GET",
        params,
      }),
      providesTags: ["Campaign"],
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useAddProductMutation,
  useGetCampaignPreviewQuery,
  useLaunchCampaignMutation,
  useGetCampaignByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllCampaignsQuery,
  useGetCampaignsByCodeQuery,
  useGenerateCampaignStoryMutation,
  useUpdateCampaignMutation,
  useGetDraftCampaignsQuery,
  useGetAllActiveCampaignsQuery,
  useGetAllMyCampaignsQuery,
  useCancelCampaignMutation,
  useCompleteCampaignMutation
} = campaignApi;
export default campaignApi;
