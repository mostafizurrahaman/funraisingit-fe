import { baseApi } from "@/redux/api/baseApi";

const AUthAPi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signUp: build.mutation({
      query: (userData) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: userData,
      }),
    }),
    verifySignUpOtp: build.mutation({
      query: (otpData) => ({
        url: "/auth/verify-signup-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    resendSignUpOtp: build.mutation({
      query: (emailData) => ({
        url: "/auth/resend-signup-otp",
        method: "POST",
        body: emailData,
      }),
    }),
    forgotPassword: build.mutation({
      query: (emailData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: emailData,
      }),
    }),
    resendOtp: build.mutation({
      query: (emailData) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: emailData,
      }),
    }),
    verifyOtp: build.mutation({
      query: (otpData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    resetPassword: build.mutation({
      query: ({ resetToken, newPassword }) => ({
        url: `/auth/reset-password?resetToken=${resetToken}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
    changePassword: build.mutation({
      query: (passwordData) => ({
        url: "/auth/changed-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    updateProfile: build.mutation({
      query: (formData) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: formData,
      }),
    }),
    getMe: build.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    connectAccount: build.mutation({
      query: () => ({
        url: "/account/connect",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useVerifySignUpOtpMutation,
  useResendSignUpOtpMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useGetMeQuery,
  useConnectAccountMutation,
} = AUthAPi;
