import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, LogOut, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export default function Settings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (isAuthLoading) return;
      if (!isAuthenticated) return;

      try {
        const profileRes = await apiRequest("GET", "/api/profile");
        const profileJson = (await profileRes.json()) as any;
        setHasProfile(!!profileJson?.profile);
      } catch {
        setHasProfile(false);
      }

      try {
        await apiRequest("GET", "/api/assessments/latest");
        setHasAssessment(true);
      } catch {
        setHasAssessment(false);
      }
    };

    void load();
  }, [isAuthenticated, isAuthLoading]);

  const clearAssessment = async () => {
    if (!isAuthenticated) return;
    setIsWorking(true);
    try {
      await apiRequest("DELETE", "/api/assessments");
      setHasAssessment(false);
      toast({ title: "Assessments cleared", description: "Saved assessments were removed from your account." });
    } catch (err: any) {
      toast({ title: "Couldn’t clear assessments", description: err?.message ?? "Failed", variant: "destructive" });
    } finally {
      setIsWorking(false);
    }
  };

  const clearProfile = async () => {
    if (!isAuthenticated) return;
    setIsWorking(true);
    try {
      await apiRequest("DELETE", "/api/profile");
      setHasProfile(false);
      toast({ title: "Profile cleared", description: "Saved profile details were removed from your account." });
    } catch (err: any) {
      toast({ title: "Couldn’t clear profile", description: err?.message ?? "Failed", variant: "destructive" });
    } finally {
      setIsWorking(false);
    }
  };

  const clearAllAccountData = async () => {
    if (!isAuthenticated) return;
    setIsWorking(true);
    try {
      await Promise.all([apiRequest("DELETE", "/api/assessments"), apiRequest("DELETE", "/api/profile")]);

      setHasAssessment(false);
      setHasProfile(false);
      toast({ title: "Data cleared", description: "Account data was removed." });
    } catch (err: any) {
      toast({ title: "Couldn’t clear data", description: err?.message ?? "Failed", variant: "destructive" });
    } finally {
      setIsWorking(false);
    }
  };

  const signOut = () => {
    logout();
    window.location.href = "/auth?signedOut=1";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <SettingsIcon className="w-4 h-4 mr-2" />
          Settings
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold">App Settings</h1>
        <p className="text-xl text-muted-foreground">
          Manage local data and account access on this device.
        </p>
      </motion.div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="bg-primary/5 p-8 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary mb-5">
            <Database className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Data & privacy</h2>
          <p className="text-muted-foreground mt-2">
              Manage your saved profile and assessment data stored in the app database.
          </p>
        </div>

        <div className="p-8 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-xl justify-start" disabled={!hasAssessment}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete saved assessments
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete saved assessments?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes your saved assessments from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAssessment} disabled={isWorking}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-xl justify-start" disabled={!hasProfile}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete profile details
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete profile details?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes your saved profile details from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearProfile} disabled={isWorking}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="rounded-2xl bg-background/60 border border-border/50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-display font-bold text-lg">Sign out</p>
              <p className="text-sm text-muted-foreground">
                You’ll need to authenticate again to access the dashboard.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="rounded-xl w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete all account data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete everything in your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes saved profile + assessments from the app database. It does not delete your auth user record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllAccountData} disabled={isWorking}>Delete all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
