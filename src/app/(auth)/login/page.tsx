/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

const inputStyles =
  "h-14 w-full rounded-lg border border-slate-500 bg-white px-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-secondary focus:ring-2 focus:ring-secondary/20";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const response = await login({ email, password }).unwrap();
      const token =
        response?.token ||
        response?.data?.token ||
        response?.accessToken ||
        response?.data?.accessToken ||
        response?.data?.data?.token;
      const user = response?.user || response?.data?.user || { email };

      if (token) {
        dispatch(setUser({ user, token }));
        // toast.success("Signed in successfully! Please complete your profile and onboard your account.");
        router.push("/");
      } else {
        console.error("Login response:", response);
        toast.error("Server did not return authentication token.");
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || "Sign in failed. Please try again.";
      // toast.error(errMsg);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-9 shadow-xl">
        <Image
          src={logo}
          alt="FunRaisingIt"
          className="mx-auto h-auto w-[207px]"
          priority
        />
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-0.5 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className={inputStyles}
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-3 text-sm sm:flex-row sm:items-center">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                name="remember"
                className="size-5 accent-primary"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-primary transition-colors duration-300 hover:text-primary-hover hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg text-sm"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground transition-colors duration-300 hover:text-primary"
          >
            Register
          </Link>
        </p>

        <p>
          <Link
            href="/"
            className="font-medium text-foreground transition-colors duration-300 hover:text-primary text-sm flex items-center gap-2 justify-center mt-4 underline"
          >
            Go Back Home
          </Link>
        </p>
      </section>
    </main>
  );
}
