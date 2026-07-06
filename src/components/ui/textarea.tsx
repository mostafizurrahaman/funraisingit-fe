import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full resize-y rounded-md border border-slate-400 bg-transparent px-4 py-3 text-lg outline-none transition-all duration-300 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
