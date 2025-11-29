import { Instagram, Coins, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Instagram,
    number: "01",
    title: "Browse Your Instagram",
    description: "View your posts, reels, and stories. Select content you want to monetize.",
  },
  {
    icon: Coins,
    number: "02",
    title: "Mint as IP Asset",
    description: "One-click minting to Story Protocol. Set licensing terms and royalty splits.",
  },
  {
    icon: DollarSign,
    number: "03",
    title: "Earn Royalties",
    description: "Automated micropayments when brands license your content. Track everything.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From Instagram to licensed IP asset in three simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-purple opacity-20" />

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="glass card-3d p-8 rounded-2xl hover:bg-card/80 transition-smooth group">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-blue rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-smooth tilt-soft">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth tilt-soft">
                    <step.icon className="w-8 h-8 text-brand-purple" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
