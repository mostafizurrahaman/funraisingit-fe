"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

const inputStyles = "h-14 w-full rounded-lg border border-slate-500 bg-white px-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-secondary focus:ring-2 focus:ring-secondary/20";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please request a new password reset.");
      toast.error("Reset token is missing.");
      return;
    }

    setError("");

    try {
      const response = await resetPassword({ resetToken: token, newPassword: password }).unwrap();
      toast.success(response?.message || "Password reset successful!");
      router.push("/login");
    } catch (err: any) {
      const errMsg = err?.data?.message || "Failed to reset password. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  }

  return (
    <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-10 shadow-xl">
      <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
      <div className="mt-7 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mx-auto mt-1 max-w-lg text-sm leading-7">
          Create a new password for your account and make sure to choose a strong and unique password.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">New Password</label>
          <input id="password" name="password" type="password" placeholder="***********" autoComplete="new-password" minLength={8} required className={inputStyles} />
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium">Confirm Password</label>
          <input id="confirm-password" name="confirmPassword" type="password" placeholder="***********" autoComplete="new-password" minLength={8} required aria-invalid={Boolean(error)} aria-describedby={error ? "password-error" : undefined} className={`${inputStyles} ${error ? "border-red-500" : ""}`} />
          {error ? <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">{error}</p> : null}
        </div>
        <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-lg text-sm font-medium">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Suspense fallback={<div className="text-center text-sm font-semibold">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
