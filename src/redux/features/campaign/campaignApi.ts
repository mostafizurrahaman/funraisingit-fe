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
  }),
});

export const { useCreateCampaignMutation } = campaignApi;
export default campaignApi;
