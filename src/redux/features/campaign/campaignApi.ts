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
} = campaignApi;
export default campaignApi;
