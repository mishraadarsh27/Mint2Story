import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp } from "lucide-react";

const sampleAssets = [
  {
    id: 1,
    title: "Summer Sunset Collection",
    creator: "@creator_one",
    price: "0.05 ETH",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    licenses: 12,
  },
  {
    id: 2,
    title: "Urban Street Style",
    creator: "@fashionista",
    price: "0.08 ETH",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=600&fit=crop",
    licenses: 8,
  },
  {
    id: 3,
    title: "Food Photography Series",
    creator: "@foodie_creator",
    price: "0.03 ETH",
    category: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    licenses: 24,
  },
];

export const MarketplacePreview = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            <TrendingUp className="w-3 h-3 mr-1" />
            Marketplace
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="gradient-text">Licensed Content</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse and license premium creator content with transparent terms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sampleAssets.map((asset) => (
            <Card
              key={asset.id}
              className="glass card-3d border-border/50 overflow-hidden group hover:border-primary/50 transition-smooth"
            >
              <div className="aspect-square overflow-hidden tilt-soft">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{asset.title}</h3>
                    <p className="text-sm text-muted-foreground">{asset.creator}</p>
                  </div>
                  <Badge variant="secondary">{asset.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">License from</p>
                    <p className="text-lg font-bold text-brand-purple">{asset.price}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{asset.licenses} licenses sold</p>
                </div>

                <Link to={`/marketplace/${asset.id}`}>
                  <Button variant="outline" className="w-full group/btn">
                    View Details
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/marketplace">
            <Button variant="hero" size="lg">
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
