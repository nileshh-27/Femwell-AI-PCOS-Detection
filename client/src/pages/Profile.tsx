import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Save, Sparkles, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<{ riskScore?: string; confidence?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (isAuthLoading) return;
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setAuthEmail(user?.email ?? null);

      try {
        const profileRes = await apiRequest("GET", "/api/profile");
        const profileJson = (await profileRes.json()) as any;
        const p = profileJson?.profile;
        if (p) {
          setFullName(p.fullName ?? "");
          setEmail(p.email ?? user?.email ?? "");
        } else {
          setEmail(user?.email ?? "");
        }
      } catch {
        setEmail(user?.email ?? "");
      }

      try {
        const latestRes = await apiRequest("GET", "/api/assessments/latest");
        const latest = (await latestRes.json()) as any;
        setLatestAssessment({
          riskScore: latest?.riskScore,
          confidence: latest?.confidence,
        });
      } catch {
        setLatestAssessment(null);
      }

      setIsLoading(false);
    };

    void load();
  }, [isAuthenticated, isAuthLoading, user?.email]);

  const initials = useMemo(() => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase());
    return letters.join("") || "U";
  }, [fullName]);

  const onSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You must be signed in to save your profile.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      await apiRequest("PUT", "/api/profile", {
        fullName: fullName.trim() || null,
        email: email.trim() || authEmail || null,
      });
      toast({
        title: "Profile saved",
        description: "Your profile details were saved to your account.",
      });
    } catch (err: any) {
      toast({
        title: "Couldn’t save profile",
        description: err?.message ?? "Failed to save",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          Account
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold">Your Profile</h1>
        <p className="text-xl text-muted-foreground">
          Manage your details stored in your account.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile summary */}
        <div className="glass-card rounded-3xl p-8 border border-border/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-primary/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-xl truncate">
                {fullName.trim() || "Your name"}
              </p>
              <p className="text-muted-foreground truncate">
                {email.trim() || authEmail || "Signed in"}
              </p>
            </div>
          </div>

          {authEmail && (
            <div className="mt-6 rounded-2xl bg-background/60 border border-border/50 p-4 text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{authEmail}</span>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-background/60 border border-border/50 p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Saved Assessment
              </p>
              {latestAssessment?.riskScore ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      Risk: <span className="text-primary">{String(latestAssessment.riskScore).toUpperCase()}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {typeof latestAssessment.confidence === "number" ? latestAssessment.confidence : "—"}%
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No saved assessment yet.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/assessment"
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
              >
                Check Risk
              </Link>
              <Link
                href="/results"
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-border text-foreground font-semibold hover:bg-muted transition-all"
              >
                View Results
              </Link>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="bg-primary/5 p-8 sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary mb-5">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">Profile details</h2>
            <p className="text-muted-foreground mt-2">
              These details are saved to your account.
            </p>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Ayesha Khan"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9"
                    inputMode="email"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <Button onClick={onSave} disabled={isSaving} className="rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
