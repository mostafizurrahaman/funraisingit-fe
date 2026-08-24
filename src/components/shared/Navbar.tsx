"use client";

import logo from "../../assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import userPlaceholder from "@/assets/user.png";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const navigation = [
  { label: "Campaign", href: "/campaign" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Pricing", href: "/pricing" },
  { label: "Login", href: "/login" },
] as const;

const Navbar = () => {
  const token = useSelector(userCurrentToken);
  const { data: profileResponse } = useGetMeQuery(undefined, { skip: !token });
  const profileData = profileResponse?.data;

  const filteredNavigation = token
    ? navigation.filter((item) => item.label !== "Login")
    : navigation;

  return (
    <header className="w-full bg-background">
      <nav
        aria-label="Main navigation"
        className="container mx-auto flex h-20 items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-10"
      >
        <Link href="/" aria-label="FunRaisingIt home" className="">
          <Image
            height={200}
            width={400}
            src={logo}
            alt="FunRaisingIt"
            priority
            // className="h-auto w-70"
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex xl:gap-9">
          {filteredNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-semibold text-foreground transition-colors duration-300 hover:text-secondary"
            >
              {item.label}
            </Link>
          ))}
          {token && (
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-full border border-border bg-white p-1 sm:py-1 sm:pl-1 sm:pr-3 hover:border-secondary transition-colors duration-300"
            >
              <Image
                src={profileData?.profileImage || userPlaceholder}
                alt={`${profileData?.name} profile`}
                width={50}
                height={50}
                className="size-9 rounded-full object-cover shrink-0"
              />
              <span className="hidden text-sm font-semibold sm:block">
                {profileData?.name || "User"}
              </span>
            </Link>
          )}
          <Link
            href="/campaign_1"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary/90 sm:px-5 sm:py-3 sm:text-base"
          >
            Start My Campaign
          </Link>
        </div>

        <Drawer direction="right" shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="sr-only">Navigation menu</DrawerTitle>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="absolute right-4 top-4 rounded-lg p-2 transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary"
              >
                <X className="size-5" />
              </button>
            </DrawerClose>
            <Image
              src={logo}
              alt="FunRaisingIt"
              className="mb-10 h-auto w-[155px]"
            />
            <div className="flex flex-col gap-2">
              {filteredNavigation.map((item) => (
                <DrawerClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="rounded-lg px-3 py-3 font-semibold transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary"
                  >
                    {item.label}
                  </Link>
                </DrawerClose>
              ))}
              {token && (
                <DrawerClose asChild>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 rounded-lg px-3 py-1 font-semibold transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary"
                  >
                    <Image
                      src={profileData?.profileImage || userPlaceholder}
                      alt="profile"
                      width={24}
                      height={24}
                      className="rounded-full object-cover size-6"
                    />
                    {profileData?.name || "Profile"}
                  </Link>
                </DrawerClose>
              )}
              <DrawerClose asChild>
                <Link
                  href="/campaign_1"
                  className="rounded-lg bg-primary px-3 py-3 text-center font-semibold text-white transition-colors duration-300 hover:bg-primary/90"
                >
                  Start My Campaign
                </Link>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </nav>
    </header>
  );
};

export default Navbar;
