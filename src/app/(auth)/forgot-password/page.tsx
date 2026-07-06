"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(() => router.push("/verify-otp"));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-10 shadow-xl">
        <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
        <div className="mt-6 text-center"><h1 className="text-2xl font-semibold tracking-tight">Email Confirmation</h1><p className="mt-0.5 text-sm">Enter Your email for verification.</p></div>
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-6">
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="h-14 w-full rounded-lg border border-slate-500 bg-white px-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></div>
          <Button type="submit" disabled={isPending} className="h-12 w-full rounded-lg text-sm">{isPending ? "Please wait..." : "Register"}</Button>
        </form>
      </section>
    </main>
  );
}
