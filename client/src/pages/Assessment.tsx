import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, Activity } from "lucide-react";
import { insertAssessmentSchema } from "@shared/schema";
import { Steps } from "@/components/ui/Steps";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// We'll validate step-by-step, but the final submit uses the full schema
type FormData = z.infer<typeof insertAssessmentSchema>;

const STEPS = [
  { id: 1, title: "Personal Profile", fields: ["age", "height", "weight"] },
  { id: 2, title: "Cycle Health", fields: ["cycleRegularity"] },
  { id: 3, title: "Symptoms", fields: ["symptoms"] },
  { id: 4, title: "Lifestyle & History", fields: ["familyHistory", "exerciseFrequency", "sleepQuality"] },
];

export default function Assessment() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setLocation("/auth");
    }
  }, [isAuthLoading, isAuthenticated, setLocation]);

  const form = useForm<FormData>({
    resolver: zodResolver(insertAssessmentSchema),
    defaultValues: {
      age: undefined,
      height: undefined,
      weight: undefined,
      cycleRegularity: "regular",
      symptoms: [],
      familyHistory: false,
      exerciseFrequency: "moderate",
      sleepQuality: "good",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, watch, trigger, formState: { errors, isValid } } = form;
  const formData = watch();

  // Calculate BMI for display
  const bmi = (formData.weight && formData.height) 
    ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
    : null;

  const nextStep = async () => {
    const fields = STEPS[step - 1].fields;
    const isStepValid = await trigger(fields as any);
    if (isStepValid) setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You must be signed in to save your assessment.",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/assessments", data);
      const json = (await res.json()) as { id: number };
      setLocation(json?.id ? `/results?id=${encodeURIComponent(String(json.id))}` : "/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Health Assessment</h1>
        <p className="text-muted-foreground">Complete the steps below to receive your personalized risk profile.</p>
      </div>

      <Steps currentStep={step} totalSteps={STEPS.length} labels={STEPS.map(s => s.title)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="glass-card p-8 rounded-3xl min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6 w-full"
            >
              {/* STEP 1: Personal */}
              {step === 1 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold">Let's start with the basics</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Age</label>
                      <input
                        type="number"
                        {...register("age", { valueAsNumber: true })}
                        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        placeholder="e.g. 28"
                      />
                      {errors.age && <p className="text-destructive text-sm mt-1">{errors.age.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Height (cm)</label>
                        <input
                          type="number"
                          {...register("height", { valueAsNumber: true })}
                          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          placeholder="e.g. 165"
                        />
                        {errors.height && <p className="text-destructive text-sm mt-1">{errors.height.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          {...register("weight", { valueAsNumber: true })}
                          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          placeholder="e.g. 60"
                        />
                        {errors.weight && <p className="text-destructive text-sm mt-1">{errors.weight.message}</p>}
                      </div>
                    </div>

                    {bmi && (
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-sm text-primary font-medium">Estimated BMI: {bmi}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* STEP 2: Cycle */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold">Cycle Regularity</h2>
                  <p className="text-muted-foreground">How would you describe your menstrual cycle?</p>
                  
                  <div className="space-y-3">
                    {["regular", "irregular", "absent"].map((option) => (
                      <label 
                        key={option}
                        className={cn(
                          "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                          watch("cycleRegularity") === option 
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                            : "border-transparent bg-background hover:bg-muted"
                        )}
                      >
                        <input
                          type="radio"
                          value={option}
                          {...register("cycleRegularity")}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="ml-3 font-medium capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Symptoms */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold">Symptoms Check</h2>
                  <p className="text-muted-foreground">Select all that apply to you:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "acne", label: "Severe Acne" },
                      { id: "hair_growth", label: "Excess Hair Growth" },
                      { id: "hair_loss", label: "Hair Loss / Thinning" },
                      { id: "weight_gain", label: "Unexplained Weight Gain" },
                      { id: "fatigue", label: "Chronic Fatigue" },
                      { id: "mood_swings", label: "Mood Swings" }
                    ].map((symptom) => (
                      <label 
                        key={symptom.id}
                        className={cn(
                          "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                          watch("symptoms")?.includes(symptom.id)
                            ? "border-primary bg-primary/5 shadow-sm" 
                            : "border-transparent bg-background hover:bg-muted"
                        )}
                      >
                        <input
                          type="checkbox"
                          value={symptom.id}
                          {...register("symptoms")}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                        />
                        <span className="ml-3 font-medium">{symptom.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.symptoms && <p className="text-destructive text-sm">{errors.symptoms.message}</p>}
                </div>
              )}

              {/* STEP 4: Lifestyle */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold">History & Lifestyle</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Family History of PCOS?</label>
                      <div className="flex gap-4">
                        {[
                          { value: true, label: "Yes" },
                          { value: false, label: "No" }
                        ].map((opt) => (
                          <label 
                            key={String(opt.value)}
                            className={cn(
                              "flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                              watch("familyHistory") === opt.value
                                ? "border-primary bg-primary/5 font-bold text-primary" 
                                : "border-transparent bg-background hover:bg-muted"
                            )}
                          >
                            <input
                              type="radio"
                              value={String(opt.value)}
                              {...register("familyHistory", { 
                                setValueAs: v => v === "true" 
                              })}
                              className="sr-only"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3">Exercise Frequency</label>
                      <select 
                        {...register("exerciseFrequency")}
                        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-transparent focus:border-primary outline-none"
                      >
                        <option value="sedentary">Sedentary (Little to no exercise)</option>
                        <option value="moderate">Moderate (1-3 times/week)</option>
                        <option value="active">Active (4+ times/week)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3">Sleep Quality</label>
                      <select 
                        {...register("sleepQuality")}
                        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-transparent focus:border-primary outline-none"
                      >
                        <option value="good">Good (7-9 hours, restful)</option>
                        <option value="fair">Fair (Variable, sometimes tired)</option>
                        <option value="poor">Poor (Insomnia, frequent waking)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</span>
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get Results <Activity className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
