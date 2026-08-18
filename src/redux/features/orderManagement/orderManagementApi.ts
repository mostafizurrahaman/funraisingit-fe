import { baseApi } from "@/redux/api/baseApi";

const orderManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Order
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    previewOrder: builder.mutation({
      query: (data) => ({
        url: "/order/preview",
        method: "POST",
        body: data,
      }),
    }),

    // Get All Orders
    getAllOrders: builder.query({
      query: (params) => ({
        url: `/order/all`,
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // Get Single Order
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // Update Order
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    // Delete Order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderOverview: builder.query({
      query: (params) => ({
        url: "/order/overview",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  usePreviewOrderMutation,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderOverviewQuery,
} = orderManagementApi;
