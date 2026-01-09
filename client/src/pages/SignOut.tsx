import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function SignOut() {
  useEffect(() => {
    apiRequest("POST", "/api/auth/logout")
      .catch(() => {
        // ignore
      })
      .finally(() => {
        window.location.href = "/auth?signedOut=1";
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50">
      <div className="text-muted-foreground">Signing you out…</div>
    </div>
  );
}
