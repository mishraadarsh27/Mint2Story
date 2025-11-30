import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap, BookOpen, Layers } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-depth">
      {/* Layered dark futuristic background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Mint2Story Hero Background"
          className="w-full h-full object-cover opacity-10 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="hero-orbit" />
        <div className="hero-grid" />
        <div className="particles" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Left: copy + CTAs */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm shadow-lg glow">
              <Sparkles className="w-4 h-4 text-brand-teal" />
              <span className="text-foreground/90 font-medium">Powered by Story Protocol</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Transform Your
              <span className="block mt-3 gradient-text">Instagram Stories</span>
              <span className="block mt-3">Into Licensed IP</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Mint your creative content as blockchain-verified IP assets. 
              Set licensing terms, automate royalties, and monetize your creativity 
              with immutable on-chain protection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-4">
              <Link to="/dashboard">
                <Button
                  variant="hero"
                  size="xl"
                  className="group shadow-xl glow hover:scale-105 transition-all duration-300"
                >
                  Start Minting Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button 
                  variant="glass" 
                  size="xl" 
                  className="backdrop-blur-xl border-brand-teal/30 hover:border-brand-teal/50"
                >
                  <Layers className="w-5 h-5" />
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-teal" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-indigo" />
                <span>Instant Royalties</span>
              </div>
            </div>
          </div>

          {/* Right: 3D floating centerpiece */}
          <div className="relative min-h-[400px] md:min-h-[500px]">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
              {/* Card 1 - Holographic Stories */}
              <div 
                className="glass card-3d rounded-3xl p-6 md:p-8 w-full max-w-sm float-3d"
                style={{ animationDelay: '0s' }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 bg-brand-teal/20 rounded-2xl flex items-center justify-center glow">
                    <BookOpen className="w-7 h-7 text-brand-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Holographic Stories</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your content becomes immutable, blockchain-verified intellectual property
                    </p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <div className="h-1.5 w-12 bg-brand-teal/60 rounded-full glow" />
                      <div className="h-1.5 w-8 bg-brand-indigo/40 rounded-full" />
                      <div className="h-1.5 w-6 bg-brand-teal/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Smart Licensing */}
              <div 
                className="glass card-3d rounded-3xl p-6 md:p-8 w-full max-w-sm float-3d"
                style={{ animationDelay: '2.6s' }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 bg-brand-indigo/20 rounded-2xl flex items-center justify-center glow-indigo">
                    <Shield className="w-7 h-7 text-brand-indigo" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Smart Licensing</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Set terms once, automate royalties forever with programmable contracts
                    </p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <div className="h-1.5 w-10 bg-brand-indigo/60 rounded-full glow-indigo" />
                      <div className="h-1.5 w-14 bg-brand-teal/40 rounded-full" />
                      <div className="h-1.5 w-6 bg-brand-indigo/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - Monetize Creativity */}
              <div 
                className="glass card-3d rounded-3xl p-6 md:p-8 w-full max-w-sm float-3d"
                style={{ animationDelay: '5.2s' }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 bg-brand-teal/20 rounded-2xl flex items-center justify-center glow">
                    <Zap className="w-7 h-7 text-brand-teal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Monetize Creativity</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Earn from every license, remix, and derivative work automatically
                    </p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <div className="h-1.5 w-8 bg-brand-teal/60 rounded-full glow" />
                      <div className="h-1.5 w-12 bg-brand-indigo/40 rounded-full" />
                      <div className="h-1.5 w-10 bg-brand-teal/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating glow orbs behind cards */}
            <div className="absolute top-1/2 -left-20 w-64 h-64 bg-brand-teal/20 rounded-full blur-[100px] glow -z-10" />
            <div className="absolute top-1/2 -right-20 w-64 h-64 bg-brand-indigo/15 rounded-full blur-[100px] glow-indigo -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
