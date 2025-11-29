import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import AssetDetail from "./pages/AssetDetail";
import Dashboard from "./pages/Dashboard";
import HowItWorksPage from "./pages/HowItWorksPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<AssetDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
