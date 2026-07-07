"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const inputStyles = "h-14 w-full rounded-lg border border-slate-500 bg-white px-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-secondary focus:ring-2 focus:ring-secondary/20";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(() => router.push("/dashboard"));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-9 shadow-xl">
        <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-0.5 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-4">
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className={inputStyles} /></div>
          <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label><input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required className={inputStyles} /></div>
          <div className="flex flex-col items-start justify-between gap-3 text-sm sm:flex-row sm:items-center">
            <label className="flex cursor-pointer items-center gap-1.5"><input type="checkbox" name="remember" className="size-5 accent-primary" />Remember me</label>
            <Link href="/forgot-password" className="font-medium text-primary transition-colors duration-300 hover:text-primary-hover hover:underline">Forgot password</Link>
          </div>
          <Button type="submit" disabled={isPending} className="h-12 w-full rounded-lg text-sm">{isPending ? "Signing in..." : "Sign In"}</Button>
        </form>
        <div className="my-5 flex items-center gap-4 text-sm text-muted-foreground"><span className="h-px flex-1 bg-slate-400" /><span>or continue with</span><span className="h-px flex-1 bg-slate-400" /></div>
        <Button type="button" variant="outline" className="h-12 w-full rounded-md border-slate-200 text-sm text-foreground hover:border-secondary"><FcGoogle className="size-4" />Sign In with Google</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/sign-up" className="font-medium text-foreground transition-colors duration-300 hover:text-primary">Register</Link></p>
      </section>
    </main>
  );
}
