import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function Steps({ currentStep, totalSteps, labels }: StepProps) {
  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between items-center">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "var(--primary)" : "var(--muted)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 border-4 border-white",
                  (isCompleted || isCurrent) ? "text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground bg-white"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </motion.div>
              {labels && (
                <span 
                  className={cn(
                    "absolute top-10 text-xs font-medium whitespace-nowrap hidden sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
