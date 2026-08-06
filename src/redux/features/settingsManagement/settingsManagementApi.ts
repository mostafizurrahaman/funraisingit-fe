import { baseApi } from "@/redux/api/baseApi";

const settingsManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Settings
    getSettings: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // Get Single Setting
    getSingleSetting: builder.query({
      query: (id) => ({
        url: `/settings/${id}`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // Create Setting
    createSetting: builder.mutation({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    // Update Setting
    updateSetting: builder.mutation({
      query: ({ id, data }) => ({
        url: `/settings/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    // Delete Setting
    deleteSetting: builder.mutation({
      query: (id) => ({
        url: `/settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // Get Site Info
    getSiteInfo: builder.query({
      query: () => ({
        url: "/site-info",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSingleSettingQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useDeleteSettingMutation,
  useGetSiteInfoQuery,
} = settingsManagementApi;