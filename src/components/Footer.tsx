import { Github, Twitter, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 mt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg" />
              <span className="text-xl font-bold gradient-text">Mint2Story</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Turn Instagram content into licensed IP assets powered by Story Protocol.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Marketplace</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Dashboard</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Chrome Extension</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Support</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Mint2Story. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-card/80 transition-smooth">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-card/80 transition-smooth">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-card/80 transition-smooth">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
