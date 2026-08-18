"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "@/utils/baseUrl";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import logo from "../../assets/logo.png";

const footerLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Pricing", href: "/pricing" },
  { label: "Login", href: "/login" },
] as const;

const policyLinks = [
  { label: "Acceptable Use Policy", href: "/content/acceptable_use_policy" },
  { label: "Refund Policy", href: "/content/refund_policy" },
  { label: "Seller Agreement", href: "/content/seller_agreement" },
  { label: "Website Disclaimer", href: "/content/website_disclaimer" },
  { label: "Cookie Policy", href: "/content/cookie_policy" },
  { label: "Privacy Policy", href: "/content/privacy_policy" },
  { label: "Buyer Terms & Conditions", href: "/content/buyer_terms_and_condition" },
  { label: "Charge Back & Dispute Policy", href: "/content/charge_back_and_dispute_resolution_policy" },
  { label: "Terms & Conditions", href: "/content/terms_and_conditions" },
] as const;

interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
}

const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com", icon: FaFacebookF },
  { label: "Twitter", href: "https://twitter.com", icon: FaTwitter },
  { label: "YouTube", href: "https://www.youtube.com", icon: FaYoutube },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: FaLinkedinIn },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSubscribed(localStorage.getItem("newsletterSubscribed") === "true");
    }
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data?.success !== false) {
        toast.success(data?.message || "Successfully subscribed to our newsletter!");
        setEmail("");
        localStorage.setItem("newsletterSubscribed", "true");
        setIsSubscribed(true);
      } else {
        toast.error(data?.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1.15fr] lg:gap-14">
          <div className="flex flex-col items-center lg:items-start">
            <Link
              href="/"
              aria-label="FunRaisingIt home"
              className="transition-opacity duration-300 hover:opacity-80"
            >
              <Image src={logo} alt="FunRaisingIt" className="h-auto w-44" />
            </Link>

            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full bg-secondary text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-md"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:flex-nowrap">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium transition-colors duration-300 hover:text-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <label htmlFor="footer-email" className="mb-2 block text-base font-medium">
              Email
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={isSubscribed ? "Thank you for subscribing!" : "you@example.com"}
                value={isSubscribed ? "" : email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubscribed) {
                    handleSubscribe();
                  }
                }}
                disabled={isLoading || isSubscribed}
                className="h-12 min-w-0 flex-1 rounded-lg border border-muted-foreground bg-white px-4 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isLoading || isSubscribed}
                className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Subscribing..." : isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Tabs Section */}
      <div className="border-t border-secondary/20">
        <div className="container mx-auto px-5 py-6 sm:px-8 lg:px-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs font-semibold text-muted-foreground">
          {policyLinks.map((policy) => (
            <Link
              key={policy.href}
              href={policy.href}
              className="hover:text-secondary transition-colors duration-300"
            >
              {policy.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-secondary">
        <p className="container mx-auto px-5 py-5 text-center text-xs text-muted-foreground sm:px-8 sm:text-sm lg:px-10">
          © 2026 FunRaisingIt. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
