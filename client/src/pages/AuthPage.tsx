import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { HeartPulse, ArrowRight, Loader2, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("signedOut") === "1") {
      toast({
        title: "Signed out",
        description: "You can sign in again anytime.",
      });
      params.delete("signedOut");
      const next = params.toString();
      window.history.replaceState({}, "", next ? `/auth?${next}` : "/auth");
    }

    return;
  }, [toast]);

  const handleSignOut = () => {
    setIsLoading(true);
    apiRequest("POST", "/api/auth/logout")
      .catch(() => {
        // ignore
      })
      .finally(() => {
        setIsLoading(false);
        window.location.href = "/auth?signedOut=1";
      });
  };

  const signInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const pwd = password;

      if (!normalizedEmail || !pwd) {
        toast({
          title: "Missing details",
          description: "Enter your email and password.",
          variant: "destructive",
        });
        return;
      }

      await apiRequest("POST", "/api/auth/login", {
        email: normalizedEmail,
        password: pwd,
      });

      toast({
        title: "Signed in",
        description: "Welcome! Redirecting…",
      });
      window.location.href = "/";
    } catch (err: any) {
      toast({
        title: "Sign-in failed",
        description: err?.message ?? "Sign-in failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const pwd = password;
      const confirm = confirmPassword;

      if (!normalizedEmail || !pwd) {
        toast({
          title: "Missing details",
          description: "Enter your email and password.",
          variant: "destructive",
        });
        return;
      }

      if (pwd.length < 8) {
        toast({
          title: "Password too short",
          description: "Use at least 8 characters.",
          variant: "destructive",
        });
        return;
      }

      if (pwd !== confirm) {
        toast({
          title: "Passwords do not match",
          description: "Please confirm your password.",
          variant: "destructive",
        });
        return;
      }

      await apiRequest("POST", "/api/auth/register", {
        email: normalizedEmail,
        password: pwd,
      });

      toast({
        title: "Account created",
        description: "Welcome! Redirecting…",
      });
      window.location.href = "/";
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.message ?? "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password auth only.

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 px-4 selection:bg-primary/20 selection:text-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="h-7 w-7 text-white" />
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-foreground">
              FemWell<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <Card className="glass-card rounded-3xl border border-border/40 shadow-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isAuthenticated ? "You’re signed in" : isRegister ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isAuthenticated
                ? "Continue to your dashboard, or sign out to switch accounts."
                : isRegister
                  ? "Register with email + password."
                  : "Sign in with email + password."}
            </CardDescription>
          </CardHeader>

          {isAuthLoading ? (
            <CardContent className="space-y-3">
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </CardContent>
          ) : isAuthenticated ? (
            <>
              <CardContent className="space-y-3">
                <div className="rounded-2xl bg-background/60 border border-border/50 p-4 text-sm text-muted-foreground">
                  Tip: Your session is stored as a secure httpOnly cookie.
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                >
                  Continue to dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Button variant="outline" className="w-full rounded-xl" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <form onSubmit={isRegister ? signUpWithPassword : signInWithPassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete={isRegister ? "new-password" : "current-password"}
                      placeholder={isRegister ? "Create a password" : "Enter your password"}
                      className="h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {isRegister && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        className="h-11"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button type="submit" className="w-full h-11 text-base font-semibold rounded-xl" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {isRegister ? "Create account" : "Sign in"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>


                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                      {isRegister ? "Already have an account?" : "New here?"}
                    </span>{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setPassword("");
                        setConfirmPassword("");
                      }}
                      className="text-primary font-semibold hover:underline"
                    >
                      {isRegister ? "Sign in" : "Register"}
                    </button>
                  </div>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
