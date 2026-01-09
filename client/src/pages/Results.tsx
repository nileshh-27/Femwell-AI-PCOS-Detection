import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, RefreshCw, BookOpen, Activity } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface ResultData {
  riskScore: "low" | "medium" | "high";
  confidence: number;
  contributingFactors: string[];
  recommendations: string[];
}

export default function Results() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (isLoading) return;
      if (!isAuthenticated) {
        setLocation("/auth");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      try {
        const res = id
          ? await apiRequest("GET", `/api/assessments/${encodeURIComponent(id)}`)
          : await apiRequest("GET", "/api/assessments/latest");

        const row = (await res.json()) as any;
        setResult({
          riskScore: row.riskScore,
          confidence: row.confidence,
          contributingFactors: row.contributingFactors ?? [],
          recommendations: row.recommendations ?? [],
        });
      } catch {
        setLocation("/assessment");
      }
    };

    void load();
  }, [setLocation, isAuthenticated, isLoading]);

  if (!result) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "var(--chart-1)"; // Teal
      case "medium": return "var(--chart-4)"; // Amber
      case "high": return "var(--destructive)"; // Red
      default: return "var(--muted)";
    }
  };

  const chartData = [
    { name: "Risk", value: result.confidence },
    { name: "Remaining", value: 100 - result.confidence },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
          <AlertCircle className="w-4 h-4 mr-2" />
          Not a medical diagnosis
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold">Your Risk Profile</h1>
        <p className="text-xl text-muted-foreground">Based on your provided symptoms and history</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Risk Score Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="w-64 h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={getRiskColor(result.riskScore)} />
                  <Cell fill="var(--muted)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
              <span className="text-5xl font-display font-bold" style={{ color: getRiskColor(result.riskScore) }}>
                {result.riskScore.toUpperCase()}
              </span>
              <span className="text-muted-foreground font-medium mt-1">Risk Level</span>
            </div>
          </div>
          
          <div className="mt-4 max-w-sm">
            <p className="text-muted-foreground">
              Our AI analysis indicates a <strong>{result.riskScore} probability</strong> of PCOS markers based on your inputs.
            </p>
          </div>
        </motion.div>

        {/* Contributing Factors */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-3xl space-y-6"
        >
          <h3 className="text-xl font-bold font-display flex items-center gap-2">
            <Activity className="text-primary w-5 h-5" />
            Contributing Factors
          </h3>
          <ul className="space-y-4">
            {result.contributingFactors.map((factor, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <div className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0" />
                <span className="text-foreground/90">{factor}</span>
              </li>
            ))}
            {result.contributingFactors.length === 0 && (
              <p className="text-muted-foreground italic">No specific high-risk factors identified.</p>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold font-display">Personalized Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-foreground font-medium leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Link href="/guidance" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <BookOpen className="w-5 h-5 mr-2" />
          View Detailed Guidance
        </Link>
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border border-border text-foreground font-bold hover:bg-muted transition-all"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retake Assessment
        </Link>
      </div>
    </div>
  );
}
