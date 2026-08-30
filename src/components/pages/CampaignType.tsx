import React from "react";
import Link from "next/link";
import {
  Rocket,
  GraduationCap,
  Church,
  Trophy,
  Utensils,
  Ticket,
  Tablet,
  Heart,
} from "lucide-react";

const campaignTypes = [
  {
    title: "Launch a Business",
    id: "business",
    description: "Validate your idea and collect pre-orders before you invest.",
    icon: Rocket,
    bgColor: "bg-[#eaf4fe]",
    iconColor: "text-[#005fb8]",
    textColor: "text-[#005fb8]",
    shadowColor: "hover:shadow-[#005fb8]/10",
    borderColor: "hover:border-[#005fb8]/30",
  },
  {
    title: "School Fundraiser",
    id: "school_fundraiser",
    description: "Raise money for your students, clubs, and classrooms.",
    icon: GraduationCap,
    bgColor: "bg-[#f5eeff]",
    iconColor: "text-[#6b21a8]",
    textColor: "text-[#6b21a8]",
    shadowColor: "hover:shadow-[#6b21a8]/10",
    borderColor: "hover:border-[#6b21a8]/30",
  },
  {
    title: "Church Campaign",
    id: "church_campaign",
    description: "Support missions, ministries, and community outreach.",
    icon: Church,
    bgColor: "bg-[#edf7ed]",
    iconColor: "text-[#1b5e20]",
    textColor: "text-[#1b5e20]",
    shadowColor: "hover:shadow-[#1b5e20]/10",
    borderColor: "hover:border-[#1b5e20]/30",
  },
  {
    title: "Sports Teams",
    id: "sports_team",
    description: "Fund uniforms, travel, tournaments, and equipment.",
    icon: Trophy,
    bgColor: "bg-[#fff5eb]",
    iconColor: "text-[#e65100]",
    textColor: "text-[#e65100]",
    shadowColor: "hover:shadow-[#e65100]/10",
    borderColor: "hover:border-[#e65100]/30",
  },
  {
    title: "Products & Pre-Orders",
    id: "products_pre_orders",
    description: "Sell food, merchandise, baked goods, apparel, gifts & more.",
    icon: Utensils,
    bgColor: "bg-[#ffebee]",
    iconColor: "text-[#c62828]",
    textColor: "text-[#c62828]",
    shadowColor: "hover:shadow-[#c62828]/10",
    borderColor: "hover:border-[#c62828]/30",
  },
  {
    title: "Events & Tickets",
    id: "events_tickets",
    description:
      "Pre-sell tickets for concerts, conferences, parties, classes & more.",
    icon: Ticket,
    bgColor: "bg-[#eef2fa]",
    iconColor: "text-[#1565c0]",
    textColor: "text-[#1565c0]",
    shadowColor: "hover:shadow-[#1565c0]/10",
    borderColor: "hover:border-[#1565c0]/30",
  },
  {
    title: "Digital Products",
    id: "digital_products",
    description:
      "Sell e-books, guides, templates, courses & downloadable products.",
    icon: Tablet,
    bgColor: "bg-[#ede7f6]",
    iconColor: "text-[#4527a0]",
    textColor: "text-[#4527a0]",
    shadowColor: "hover:shadow-[#4527a0]/10",
    borderColor: "hover:border-[#4527a0]/30",
  },
  {
    title: "Community & Nonprofits",
    id: "community_nonprofit",
    description: "Collect donations and rally support for your cause.",
    icon: Heart,
    bgColor: "bg-[#fce4ec]",
    iconColor: "text-[#c2185b]",
    textColor: "text-[#c2185b]",
    shadowColor: "hover:shadow-[#c2185b]/10",
    borderColor: "hover:border-[#c2185b]/30",
  },
];

const CampaignType = () => {
  return (
    <section id="campaign-type" className="py-16 px-4 container mx-auto">
      <div className="text-center mb-12 relative">
        {/* Accent lines decoration */}
        <div className="inline-block relative">
          <div className="absolute -left-12 -top-5 hidden sm:block">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00aaa6"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-80"
            >
              <line x1="4" y1="20" x2="8" y2="16" />
              <line x1="2" y1="12" x2="7" y2="12" />
              <line x1="4" y1="4" x2="8" y2="8" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#07122f] tracking-tight">
            Choose Your Campaign Type
          </h2>
        </div>
        <p className="mt-3 text-lg text-[#45506a]">
          Launch almost anything. We&apos;ve got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {campaignTypes.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={idx}
              href={`/campaign_1?campaignCategory=${item.id}`}
              className={`flex flex-col items-center text-center p-5 bg-white border border-[#e7e9ee] rounded-2xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:cursor-pointer ${item.shadowColor} ${item.borderColor}`}
            >
              {/* Icon Container */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${item.bgColor} ${item.iconColor} mb-5`}
              >
                <IconComponent className="w-8 h-8" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3
                className={`font-bold text-base ${item.textColor} mb-3 leading-snug`}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#45506a] leading-relaxed">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CampaignType;
