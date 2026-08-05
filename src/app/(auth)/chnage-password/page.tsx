"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChnagePassword() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/settings");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="size-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
    </div>
  );
}
