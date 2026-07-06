"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ClipboardEvent, FormEvent, KeyboardEvent, useRef, useState, useTransition } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (!digits.length) return;
    setOtp([...digits, ...Array(OTP_LENGTH - digits.length).fill("")]);
    inputs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    startTransition(() => router.push("/reset-password"));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-[560px] rounded-lg bg-white px-5 py-10 shadow-xl">
        <Image src={logo} alt="FunRaisingIt" className="mx-auto h-auto w-[207px]" priority />
        <div className="mt-7 text-center"><h1 className="text-2xl font-semibold tracking-tight">OTP Verification</h1><p className="mx-auto mt-1 max-w-md text-sm leading-7">Enter the 6 digits code that you received on your email</p></div>
        <form onSubmit={handleSubmit} className="mt-4" noValidate>
          <div onPaste={handlePaste} className="flex justify-center gap-1.5 sm:gap-3">
            {otp.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element; }} value={digit} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} aria-label={`OTP digit ${index + 1}`} className="size-10 rounded border sm:size-14 border-transparent bg-slate-50 text-center text-sm font-semibold text-primary outline-none transition-all duration-300 focus:border-primary focus:bg-orange-50 focus:ring-2 focus:ring-primary/20" />)}
          </div>
          {error ? <p role="alert" className="mt-2 text-center text-sm text-red-600">{error}</p> : null}
          <p className="mt-6 text-center text-sm text-muted-foreground">Resend Code: <span className="text-foreground">00:54</span></p>
          <Button type="submit" disabled={isPending} className="mt-6 h-12 w-full rounded-lg text-sm">{isPending ? "Verifying..." : "Continue"}</Button>
        </form>
      </section>
    </main>
  );
}
