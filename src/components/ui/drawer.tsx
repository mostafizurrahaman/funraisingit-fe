"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = DrawerPrimitive.Root;
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;
const DrawerTitle = DrawerPrimitive.Title;

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/45 transition-opacity duration-300" />
      <DrawerPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-[101] flex h-dvh w-[85%] max-w-sm flex-col border-l border-border bg-white p-6 text-foreground shadow-2xl outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

export { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger };
