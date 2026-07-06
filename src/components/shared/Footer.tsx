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
                placeholder="you@example.com"
                className="h-12 min-w-0 flex-1 rounded-lg border border-muted-foreground bg-white px-4 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              <button
                type="button"
                className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Subscribe
              </button>
            </div>
          </div>
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
