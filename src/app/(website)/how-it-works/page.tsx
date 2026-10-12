import HowItWorks from "@/components/pages/HowItWorks";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "How It Works | Funraising-It",
  description: "Learn how Funraising-It works in 4 easy steps. Watch our video walkthrough and start your campaign today.",
};

const HowItWorksPage = () => {
  return (
    <div>
      <HowItWorks showVideo={true} />
    </div>
  );
};

export default HowItWorksPage;
