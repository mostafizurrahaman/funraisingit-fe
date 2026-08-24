/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Eye, Upload, Loader2, LogOut, Star, X } from "lucide-react";
import userPlaceholder from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useConnectAccountMutation,
  useGetAccountQuery,
} from "@/redux/features/auth/authApi";
import {
  useGetReviewStatusQuery,
  useSkipReviewMutation,
  useCreateReviewMutation,
} from "@/redux/features/review/reviewApi";
import { useDispatch, useSelector } from "react-redux";
import { logout, userCurrentToken } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { baseApi } from "@/redux/api/baseApi";

const passwordFields = [
  {
    id: "current-password",
    label: "Current Password",
    autoComplete: "current-password",
  },
  { id: "new-password", label: "New Password", autoComplete: "new-password" },
  {
    id: "confirm-new-password",
    label: "Confirm New Password",
    autoComplete: "new-password",
  },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(userCurrentToken);

  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetMeQuery(undefined, { skip: !token });
  const { data: accountResponse, isLoading: isLoadingAccount } =
    useGetAccountQuery(undefined, { skip: !token });
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [connectAccount, { isLoading: isConnectingAccount }] =
    useConnectAccountMutation();

  const { data: reviewStatusRes } = useGetReviewStatusQuery(undefined, { skip: !token });
  const isEligible = reviewStatusRes?.data?.isEligibleForReview;

  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [skipReview, { isLoading: isSkippingReview }] = useSkipReviewMutation();

  const [reviewMessage, setReviewMessage] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(5);
  const [showReviewModal, setShowReviewModal] = React.useState(false);

  React.useEffect(() => {
    if (isEligible) {
      setShowReviewModal(true);
    }
  }, [isEligible]);

  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const profile = profileResponse?.data;
  const accountInfo = accountResponse?.data;

  async function handleConnectAccount() {
    try {
      const response = await connectAccount(undefined).unwrap();
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else if (response?.url) {
        window.location.href = response.url;
      } else {
        toast.error("Could not retrieve onboarding account URL.");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          "Failed to connect onboarding account. Please try again.",
      );
    }
  }

  const toggleShowField = (id: string) => {
    setShowFields((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
        toast.error("Choose a JPG, PNG, or WEBP image under 5 MB.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const phone = data.get("phone") as string;

    if (!name?.trim()) {
      toast.error("Full Name is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phoneNumber", phone || "");
      if (avatarFile) {
        formData.append("profileImage", avatarFile);
      }

      const response = await updateProfile(formData).unwrap();
      toast.success(response?.message || "Profile updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to update profile. Please try again.",
      );
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const oldPassword = data.get("current-password") as string;
    const newPassword = data.get("new-password") as string;
    const confirmNewPassword = data.get("confirm-new-password") as string;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();
      toast.success(response?.message || "Password updated successfully!");
      // event.currentTarget.reset();
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  }

  if (isLoadingProfile || isLoadingAccount) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="max-w-[760px] space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your profile and security preferences.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:self-start">
          <Button
            onClick={() => setShowReviewModal(true)}
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/5 cursor-pointer"
          >
            Leave a Review
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 cursor-pointer"
          >
            <LogOut className="size-4" />
            Log Out
          </Button>
        </div>
      </header>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Profile Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your public organizer profile.
          </p>
        </div>

        <form className="space-y-5 px-5 py-6" onSubmit={handleProfileSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative size-16 shrink-0">
              <Image
                src={avatarPreview || profile?.profileImage || userPlaceholder}
                alt={profile?.name || "User profile"}
                width={200}
                height={200}
                className="size-16 rounded-lg object-cover"
                unoptimized={!!avatarPreview}
              />
              <span className="absolute -bottom-1 -right-1 inline-flex size-6 items-center justify-center rounded-full bg-secondary text-white ring-2 ring-white">
                <Camera className="size-3.5" />
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Profile Photo</h4>
              <label
                htmlFor="profile-photo"
                className="mt-1 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary"
              >
                <Upload className="size-4" />
                Upload photo
              </label>
              <input
                id="profile-photo"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={profile?.name || ""}
              autoComplete="name"
              className="h-11 rounded-2xl border-border text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email || ""}
              autoComplete="email"
              className="h-11 rounded-2xl border-border text-sm"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phoneNumber || ""}
              autoComplete="tel"
              className="h-11 rounded-2xl border-border text-sm"
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-secondary px-6 text-xs hover:bg-secondary/90"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DashboardCard>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Change Password</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your account secure with a strong password.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5 px-5 py-6">
          {/* Hidden username field for mobile password manager compatibility */}
          <input
            type="text"
            name="username"
            value={profile?.email || ""}
            readOnly
            autoComplete="username"
            className="hidden"
            aria-hidden="true"
          />
          {passwordFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-2 block text-sm font-medium"
              >
                {field.label}
              </label>
              <div className="relative">
                <Input
                  id={field.id}
                  name={field.id}
                  type={showFields[field.id] ? "text" : "password"}
                  autoComplete={field.autoComplete}
                  className="h-11 rounded-2xl border-border pr-12 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowField(field.id)}
                  aria-label={`Toggle ${field.label.toLowerCase()} visibility`}
                  className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground transition-colors duration-300 hover:text-secondary cursor-pointer"
                >
                  <Eye className="size-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-secondary px-6 text-xs hover:bg-secondary/90"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DashboardCard>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Onboarding Account</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up your payout account to receive funds directly.
          </p>
        </div>

        <div className="px-5 py-6 space-y-4">
          {accountInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 p-4 bg-slate-50/50 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Stripe Account
                  </p>
                  <p className="mt-1 font-mono font-semibold text-slate-800">
                    {accountInfo.account
                      ? `**** **** **** ${accountInfo.account.slice(-4)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {accountInfo.status || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Country / Currency
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {accountInfo.country || "N/A"} /{" "}
                    {(accountInfo.currency || "usd").toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Payouts & Charges
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {accountInfo.payoutsEnabled ? "Enabled" : "Disabled"} /{" "}
                    {accountInfo.chargesEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <div className="flex pt-2 gap-3">
                <Button
                  type="button"
                  disabled={isConnectingAccount}
                  onClick={handleConnectAccount}
                  variant="outline"
                  className="px-6 text-xs flex items-center gap-2 cursor-pointer transition-all duration-300"
                >
                  {isConnectingAccount && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  {isConnectingAccount
                    ? "Connecting..."
                    : "Reconnect Account Link"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground leading-6">
                To accept donations and orders from your campaigns, you must
                link your payout account. We use Stripe to ensure safe, secure,
                and direct payouts to your bank account.
              </p>
              <div className="flex pt-2">
                <Button
                  type="button"
                  disabled={isConnectingAccount}
                  onClick={handleConnectAccount}
                  className="bg-secondary px-6 text-xs hover:bg-secondary/90 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                >
                  {isConnectingAccount && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  {isConnectingAccount
                    ? "Connecting..."
                    : "Connect Payout Account"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DashboardCard>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-2 pr-8">Share Your Experience</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Your feedback helps us improve FunRaisingIt for organizers everywhere.
            </p>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-amber-400 hover:scale-110 transition-transform duration-200 cursor-pointer"
                    >
                      <Star
                        className={`size-6 ${
                          star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Your Review
                </label>
                <textarea
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Tell us how your fundraiser went..."
                  rows={4}
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition-all duration-300 focus:border-secondary resize-none"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await skipReview(undefined).unwrap();
                    toast.success("Review skipped.");
                    setShowReviewModal(false);
                  } catch (err: any) {
                    toast.error(err?.data?.message || "Failed to skip review.");
                  }
                }}
                disabled={isSkippingReview || isSubmittingReview}
                className="h-10 border-slate-200 text-slate-700 cursor-pointer"
              >
                Skip
              </Button>
              <Button
                onClick={async () => {
                  if (!reviewMessage.trim()) {
                    toast.error("Please enter a review message.");
                    return;
                  }
                  try {
                    await createReview({
                      message: reviewMessage,
                      rating: reviewRating,
                    }).unwrap();
                    toast.success("Thank you for your review!");
                    setShowReviewModal(false);
                  } catch (err: any) {
                    // toast.error(err?.data?.message || "Failed to submit review.");
                  }
                }}
                disabled={isSubmittingReview || isSkippingReview}
                className="h-10 px-5 text-white bg-secondary hover:bg-secondary/90 cursor-pointer"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
