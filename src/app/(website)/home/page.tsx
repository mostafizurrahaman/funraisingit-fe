import BringIdea from "@/components/pages/BringIdea";
import CampaignSection from "@/components/pages/CampaignSection";
import Hero from "@/components/pages/Hero";
import HowItWorks from "@/components/pages/HowItWorks";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <CampaignSection />
      <HowItWorks />
      <BringIdea />
    </div>
  );
};

export default Home;
