import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { HeartPulse, Menu, X, Activity, BookOpen, Info, LayoutDashboard, LogOut, Settings, User, Scan } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/assessment", label: "Check Risk", icon: Activity },
    { href: "/scanner", label: "Report Scanner", icon: Scan },
    { href: "/guidance", label: "Guidance", icon: BookOpen },
    { href: "/about", label: "Resources", icon: Info },
  ];

  const accountItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/signout", label: "Sign out", icon: LogOut, tone: "destructive" as const },
  ];

  return (
    <div className="min-h-screen flex bg-background/50 selection:bg-primary/20 selection:text-primary">
      {/* Side Navigation - New Design */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-white/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              FemWell<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Main Menu</p>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl group",
                location === item.href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", location === item.href ? "text-white" : "group-hover:text-primary")} />
              {item.label}
            </Link>
          ))}
          
          <div className="px-4 pt-8 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Account</p>
          </div>
          {accountItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl group",
                item.tone === "destructive"
                  ? "text-destructive hover:bg-destructive/5"
                  : undefined,
                location === item.href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  location === item.href
                    ? "text-white"
                    : item.tone === "destructive"
                      ? "text-destructive"
                      : "group-hover:text-primary"
                )}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border/40">
          <div className="bg-primary/5 rounded-3xl p-4 mb-6">
            <p className="text-xs font-semibold text-primary uppercase mb-2">Upgrade Pro</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">Get personalized consultation with specialists.</p>
            <Button size="sm" className="w-full rounded-xl text-xs h-8">Learn More</Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-border/40 px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">FemWellAI</span>
          </Link>
          <button
            className="p-2 rounded-xl bg-primary/5 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="lg:hidden fixed inset-0 z-[60] bg-white p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-2xl text-foreground">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X className="w-8 h-8" /></button>
              </div>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 text-xl font-medium p-4 rounded-2xl",
                      location === item.href ? "bg-primary text-white" : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                ))}

                <div className="pt-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-4 mb-3">
                    Account
                  </p>
                  <div className="space-y-3">
                    {accountItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 text-xl font-medium p-4 rounded-2xl",
                          item.tone === "destructive"
                            ? "text-destructive"
                            : location === item.href
                              ? "bg-primary text-white"
                              : "text-muted-foreground"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-6 h-6" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-grow p-4 lg:p-10 relative">
          {/* Background decorative blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl opacity-50" />
            <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-3xl opacity-50" />
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}
