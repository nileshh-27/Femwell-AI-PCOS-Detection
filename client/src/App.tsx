import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Pages
import Home from "@/pages/Home";
import Assessment from "@/pages/Assessment";
import Results from "@/pages/Results";
import Guidance from "@/pages/Guidance";
import About from "@/pages/About";
import AuthPage from "@/pages/AuthPage";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("femwell_auth") === "true";
    setIsAuthenticated(auth);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth">
        {isAuthenticated ? <Redirect to="/" /> : <AuthPage />}
      </Route>
      
      {!isAuthenticated ? (
        <Route path="/:rest*">
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
            <Route component={NotFound} />
          </Switch>
        </Layout>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
