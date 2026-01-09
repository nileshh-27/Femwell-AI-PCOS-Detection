import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Home from "@/pages/Home";
import Assessment from "@/pages/Assessment";
import Results from "@/pages/Results";
import Guidance from "@/pages/Guidance";
import About from "@/pages/About";
import AuthPage from "@/pages/AuthPage";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import SignOut from "@/pages/SignOut";
import ReportScanner from "@/pages/ReportScanner";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      
      {!isAuthenticated ? (
        <Route>
          <Redirect to="/auth" />
        </Route>
      ) : (
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/assessment" component={Assessment} />
            <Route path="/results" component={Results} />
            <Route path="/guidance" component={Guidance} />
            <Route path="/about" component={About} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/scanner" component={ReportScanner} />
            <Route path="/signout" component={SignOut} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
