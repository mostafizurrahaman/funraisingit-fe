"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Eye, Upload, Loader2, LogOut } from "lucide-react";
import userPlaceholder from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePasswordMutation, useGetMeQuery } from "@/redux/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logout, userCurrentToken } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const passwordFields = [
  { id: "current-password", label: "Current Password", autoComplete: "current-password" },
  { id: "new-password", label: "New Password", autoComplete: "new-password" },
  { id: "confirm-new-password", label: "Confirm New Password", autoComplete: "new-password" },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(userCurrentToken);
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetMeQuery(undefined, { skip: !token });
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});

  const profile = profileResponse?.data;

  const toggleShowField = (id: string) => {
    setShowFields((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

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

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await changePassword({ oldPassword, newPassword }).unwrap();
      toast.success(response?.message || "Password updated successfully!");
      event.currentTarget.reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password. Please try again.");
    }
  }

  if (isLoadingProfile) {
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
          <p className="mt-2 text-sm text-muted-foreground">Manage your profile, security, and notification preferences.</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:self-start gap-2 cursor-pointer"
        >
          <LogOut className="size-4" />
          Log Out
        </Button>
      </header>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Profile Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">Update your public organizer profile.</p>
        </div>

        <form className="space-y-5 px-5 py-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative size-16 shrink-0">
              <Image
                src={profile?.profileImage || userPlaceholder}
                alt={profile?.name || "User profile"}
                width={64}
                height={64}
                className="size-16 rounded-lg object-cover"
              />
              <span className="absolute -bottom-1 -right-1 inline-flex size-6 items-center justify-center rounded-full bg-secondary text-white ring-2 ring-white">
                <Camera className="size-3.5" />
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Profile Photo</h4>
              <label htmlFor="profile-photo" className="mt-1 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary">
                <Upload className="size-4" />
                Upload photo
              </label>
              <input id="profile-photo" name="profilePhoto" type="file" accept="image/*" className="sr-only" />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <Input id="name" name="name" defaultValue={profile?.name || ""} autoComplete="name" className="h-11 rounded-2xl border-border text-sm" />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <Input id="email" name="email" type="email" defaultValue={profile?.email || ""} autoComplete="email" className="h-11 rounded-2xl border-border text-sm" disabled />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <Input id="phone" name="phone" type="tel" defaultValue={profile?.phoneNumber || ""} autoComplete="tel" className="h-11 rounded-2xl border-border text-sm" />
          </div>

          <div className="flex justify-end pt-3">
            <Button type="button" className="bg-secondary px-6 text-xs hover:bg-secondary/90">
              Save Changes
            </Button>
          </div>
        </form>
      </DashboardCard>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Change Password</h3>
          <p className="mt-1 text-sm text-muted-foreground">Keep your account secure with a strong password.</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5 px-5 py-6">
          {passwordFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="mb-2 block text-sm font-medium">
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
            <Button type="submit" disabled={isChangingPassword} className="bg-secondary px-6 text-xs hover:bg-secondary/90">
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DashboardCard>
    </div>
  );
}
