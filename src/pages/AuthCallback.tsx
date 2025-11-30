import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({ title: "Signed in successfully" });
      navigate("/dashboard", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass rounded-xl px-6 py-8 border border-border/60 flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
        <p className="text-sm text-muted-foreground">
          Finishing your sign-in...
        </p>
      </div>
    </div>
  );
}
