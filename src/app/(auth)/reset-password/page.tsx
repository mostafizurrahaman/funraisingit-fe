"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const inputStyles = "h-14 w-full rounded-lg border border-slate-500 bg-white px-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-secondary focus:ring-2 focus:ring-secondary/20";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    startTransition(() => router.push("/login"));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-10 shadow-xl">
        <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
        <div className="mt-7 text-center"><h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1><p className="mx-auto mt-1 max-w-lg text-sm leading-7">Create a new password for your account and make to choose a strong and unique password.</p></div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium">New Password</label><input id="password" name="password" type="password" placeholder="***********" autoComplete="new-password" minLength={8} required className={inputStyles} /></div>
          <div><label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium">Confirm Password</label><input id="confirm-password" name="confirmPassword" type="password" placeholder="***********" autoComplete="new-password" minLength={8} required aria-invalid={Boolean(error)} aria-describedby={error ? "password-error" : undefined} className={`${inputStyles} ${error ? "border-red-500" : ""}`} />{error ? <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">{error}</p> : null}</div>
          <Button type="submit" disabled={isPending} className="h-12 w-full rounded-lg text-sm">{isPending ? "Saving..." : "Save"}</Button>
        </form>
      </section>
    </main>
  );
}
