import { baseApi } from "@/redux/api/baseApi";

const BrandBuilderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrandBuilder: builder.query({
      query: () => `/brand-builder`,
    }),
    createBrandBuilder: builder.mutation({
      query: (formData) => ({
        url: "/brand",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useGetBrandBuilderQuery, useCreateBrandBuilderMutation } = BrandBuilderApi;
export default BrandBuilderApi;
