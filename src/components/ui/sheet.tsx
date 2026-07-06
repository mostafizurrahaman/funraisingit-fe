"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
      <SheetPrimitive.Content
        className={cn("fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm border-l border-border bg-background p-6 shadow-xl transition duration-300 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0", className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-md p-2 text-foreground transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
          <X className="size-5" />
          <span className="sr-only">Close menu</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

const SheetTitle = SheetPrimitive.Title;

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger };
