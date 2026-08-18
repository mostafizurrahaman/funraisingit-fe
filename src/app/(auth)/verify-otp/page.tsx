/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardEvent, FormEvent, KeyboardEvent, useRef, useState, useEffect, Suspense } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  useVerifySignUpOtpMutation,
  useResendSignUpOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const flow = searchParams.get("flow") || "signup";

  const [email, setEmail] = useState("");
  
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("otpEmail") || "");
    }
  }, [emailParam]);

  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");

  const [verifySignUpOtp, { isLoading: isVerifyingSignUp }] = useVerifySignUpOtpMutation();
  const [resendSignUpOtp, { isLoading: isResendingSignUp }] = useResendSignUpOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingReset }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResendingReset }] = useResendOtpMutation();

  const isPending = isVerifyingSignUp || isVerifyingReset;

  const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit) {
      if (index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }
    } else {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      }
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (!digits.length) return;
    setOtp([...digits, ...Array(OTP_LENGTH - digits.length).fill("")]);
    inputs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
  }

  async function handleResend() {
    if (!email) {
      toast.error("Email address not found.");
      return;
    }
    try {
      if (flow === "signup") {
        const res = await resendSignUpOtp({ email }).unwrap();
        toast.success(res?.message || "OTP resent successfully!");
      } else {
        const res = await resendOtp({ email }).unwrap();
        toast.success(res?.message || "OTP resent successfully!");
      }
      setTimeLeft(60);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    const fullOtp = otp.join("");
    try {
      if (flow === "signup") {
        const res = await verifySignUpOtp({ email, otp: fullOtp }).unwrap();
        toast.success(res?.message || "Email verified successfully!");
        router.push("/login");
      } else {
        const res = await verifyOtp({ email, otp: fullOtp }).unwrap();
        toast.success(res?.message || "OTP verified successfully!");
        const token = res?.resetToken || res?.token || res?.data?.resetToken;
        if (token) {
          router.push(`/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
        } else {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (err: any) {
      // setError(err?.data?.message || "Verification failed. Please check your OTP.");
      toast.error(err?.data?.message || "Verification failed.");
    }
  }

  return (
    <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-10 shadow-xl">
      <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
      <div className="mt-7 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">OTP Verification</h1>
        <p className="mx-auto mt-1 max-w-md text-sm leading-7">
          Enter the 6 digits code that you received on your email {email ? `(${email})` : ""}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div onPaste={handlePaste} className="flex justify-center gap-1.5 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`OTP digit ${index + 1}`}
              className="size-10 rounded border sm:size-14 border-transparent bg-slate-50 text-center text-sm font-semibold text-primary outline-none transition-all duration-300 focus:border-primary focus:bg-orange-50 focus:ring-2 focus:ring-primary/20"
            />
          ))}
        </div>
        {error ? (
          <p role="alert" className="mt-2 text-center text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {timeLeft > 0 ? (
            <p>
              Resend Code in: <span className="text-foreground font-semibold">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResendingSignUp || isResendingReset}
              className="text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none disabled:opacity-50"
            >
              {isResendingSignUp || isResendingReset ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="mt-6 h-12 w-full rounded-lg text-sm font-medium">
          {isPending ? "Verifying..." : "Continue"}
        </Button>
      </form>
    </section>
  );
}

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Suspense fallback={<div className="text-center text-sm font-semibold">Loading...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </main>
  );
}
