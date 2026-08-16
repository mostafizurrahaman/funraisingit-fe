"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;

    try {
      const response = await forgotPassword({ email }).unwrap();
      toast.success(response?.message || "OTP code sent to email!");
      if (typeof window !== "undefined") {
        localStorage.setItem("otpEmail", email);
      }
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&flow=forgot-password`);
    } catch (err: any) {
      // toast.error(err?.data?.message || "Failed to request password reset. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-10 shadow-xl">
        <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
        <div className="mt-6 text-center"><h1 className="text-2xl font-semibold tracking-tight">Email Confirmation</h1><p className="mt-0.5 text-sm">Enter Your email for verification.</p></div>
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-6">
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="h-14 w-full rounded-lg border border-slate-500 bg-white px-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></div>
          <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-lg text-sm">{isLoading ? "Sending..." : "Continue"}</Button>
        </form>
      </section>
    </main>
  );
}
