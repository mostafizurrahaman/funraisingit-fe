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
    }),
    getCampaignPreview: build.query({
      query: ({ campaignId, body }) => ({
        url: `/campaign/${campaignId}/preview`,
        method: "GET",
        body: body || {},
      }),
    }),
    launchCampaign: build.mutation({
      query: ({ campaignId, body }) => ({
        url: `/campaign/${campaignId}/launch`,
        method: "POST",
        body: body || {},
      }),
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useAddProductMutation,
  useGetCampaignPreviewQuery,
  useLaunchCampaignMutation,
} = campaignApi;
export default campaignApi;
