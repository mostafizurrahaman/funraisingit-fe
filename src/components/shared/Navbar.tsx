"use client";

import logo from "../../assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
const navigation = [
  { label: "Campaign", href: "/campaign" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Pricing", href: "/pricing" },
  { label: "Login", href: "/login" },
] as const;

const Navbar = () => {
  return (
    <header className="w-full bg-background">
      <nav aria-label="Main navigation" className="container mx-auto flex h-20  items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-10">
        <Link href="/" aria-label="FunRaisingIt home" className="shrink-0 transition-opacity duration-300 hover:opacity-80">
          <Image src={logo} alt="FunRaisingIt" className="" priority />
        </Link>

        <div className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="font-semibold  text-foreground transition-colors duration-300 hover:text-secondary">
              {item.label}
            </Link>
          ))}
          <Link href="/campaign" className="bg-primary px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary/90 sm:px-5 sm:py-3 sm:text-base">
            Start My Campaign
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <Image src={logo} alt="FunRaisingIt" className="mb-10 h-auto w-[155px]" />
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <SheetClose key={item.href} asChild>
                  <Link href={item.href} className="rounded-lg px-3 py-3 font-semibold  transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary">
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/campaign" className="rounded-lg bg-primary px-3 py-3 text-center font-semibold text-white transition-colors duration-300 hover:bg-primary/90">
                  Start My Campaign
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
