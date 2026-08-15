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
    getMyBrands: builder.query({
      query: (params) => ({
        url: "/brand/my",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetBrandBuilderQuery,
  useCreateBrandBuilderMutation,
  useGetMyBrandsQuery,
} = BrandBuilderApi;
export default BrandBuilderApi;
