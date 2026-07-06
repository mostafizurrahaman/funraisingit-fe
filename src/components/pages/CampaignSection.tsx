import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import cardImage from "../../assets/user.png";

interface Campaign {
  id: number;
  title: string;
  description: string;
  supporterCount: number;
  image: StaticImageData;
}

const campaigns: Campaign[] = [
  {
    id: 1,
    title: "Jenny’s Famous Banana Pudding",
    description: "Help me launch my homemade banana pudding business!",
    supporterCount: 42,
    image: cardImage,
  },
  {
    id: 2,
    title: "Jenny’s Famous Banana Pudding",
    description: "Help me launch my homemade banana pudding business!",
    supporterCount: 42,
    image: cardImage,
  },
  {
    id: 3,
    title: "Jenny’s Famous Banana Pudding",
    description: "Help me launch my homemade banana pudding business!",
    supporterCount: 42,
    image: cardImage,
  },
];

const CampaignSection = () => {
  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10">
        <h2 className="text-center text-5xl font-semibold text-foreground">
          Campaign
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="overflow-hidden rounded-lg bg-white shadow-[0_8px_24px_rgba(7,18,47,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,18,47,0.16)]"
            >
              <div className="relative aspect-[1.55/1] w-full overflow-hidden">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-top object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                    <Image
                      src={campaign.image}
                      alt="Campaign owner"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3 className="text-base leading-6 font-semibold text-foreground sm:text-lg">
                      {campaign.title}
                    </h3>
                    <p className="mt-1 text-xs leading-4 text-muted-foreground sm:text-sm">
                      {campaign.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-secondary bg-white px-3 text-xs font-semibold text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:text-white"
                  >
                    <Heart className="size-4" />
                    Donate
                  </button>
                  <Link
                    href="/order-summary"
                    className="flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                  >
                    Buy Now
                  </Link>
                </div>

                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((supporter) => (
                      <div
                        key={supporter}
                        className="relative size-6 overflow-hidden rounded-full border-2 border-white"
                      >
                        <Image
                          src={campaign.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-foreground">
                    Join {campaign.supporterCount} supporters
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/campaign"
            className="text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary"
          >
            See All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
