import { useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function SignOut() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    apiRequest("POST", "/api/auth/logout")
      .catch(() => {
        // ignore
      })
      .finally(() => {
        setLocation("/auth?signedOut=1");
      });
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50">
      <div className="text-muted-foreground">Signing you out…</div>
    </div>
  );
}
