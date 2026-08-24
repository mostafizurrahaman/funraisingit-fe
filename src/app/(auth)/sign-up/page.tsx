"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSignUpMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [signUp, { isLoading }] = useSignUpMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isReload =
        (window.performance &&
          window.performance.getEntriesByType("navigation")[0]?.type === "reload") ||
        (window.performance && window.performance.navigation?.type === 1);

      if (isReload) {
        sessionStorage.removeItem("signUpFormData");
      } else {
        const savedData = sessionStorage.getItem("signUpFormData");
        if (savedData) {
          try {
            setFormData(JSON.parse(savedData));
          } catch (e) {
            console.error("Error parsing saved signup form data", e);
          }
        }
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updated);
    sessionStorage.setItem("signUpFormData", JSON.stringify(updated));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    const termsChecked = data.get("terms");
    if (!termsChecked) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await signUp({ name, email, password }).unwrap();
      toast.success(response?.message || "OTP sent to your email!");

      if (typeof window !== "undefined") {
        localStorage.setItem("otpEmail", email);
        sessionStorage.removeItem("signUpFormData");
      }
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&flow=signup`);
    } catch (err: any) {
      const errMsg = err?.data?.message || "Sign up failed. Please try again.";
      // toast.error(errMsg);
      setError(errMsg);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-9 shadow-xl sm:px-8">
        <Image
          src={logo}
          alt="FunRaisingIt"
          className="mx-auto h-auto w-[207px]"
          priority
        />

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="full-name"
              className="mb-1.5 block text-sm font-medium"
            >
              Full Name
            </label>
            <Input
              id="full-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className="text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                className="text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={8}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "password-error" : undefined}
                className="text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {error ? (
              <p
                id="password-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {error}
              </p>
            ) : null}
          </div>

          <label className="flex cursor-pointer items-start gap-2 text-sm leading-6">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-1 size-4 shrink-0 accent-primary"
              required
            />
            <span>
              I agree to the{" "}
              <Link
                href="/content/terms_and_conditions"
                className="font-medium text-primary transition-colors duration-300 hover:text-primary-hover hover:underline"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/content/privacy_policy"
                className="font-medium text-primary transition-colors duration-300 hover:text-primary-hover hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg text-sm"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground transition-colors duration-300 hover:text-primary"
          >
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
