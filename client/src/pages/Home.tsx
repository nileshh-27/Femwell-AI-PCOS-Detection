import { Link } from "wouter";
import { ArrowRight, Activity, Brain, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Health Insights
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-display font-bold text-foreground leading-tight tracking-tight">
            Early PCOS Detection. <br />
            <span className="gradient-text">Smarter Decisions.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Understand your body better with our advanced risk assessment tool designed to help you take control of your hormonal health.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-primary/25">
              Check Your Risk
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-foreground border border-border hover:bg-muted/50 transition-all duration-200">
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="glass-card p-8 rounded-3xl hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-primary to-secondary p-12 sm:p-20 text-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-5xl font-display font-bold">Ready to take the first step?</h2>
            <p className="text-lg sm:text-xl text-white/90">
              Our assessment takes less than 2 minutes and provides instant, personalized insights based on your unique profile.
            </p>
            <Link href="/assessment" className="inline-block bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-xl">
              Start Assessment Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "AI Risk Prediction",
    description: "Our advanced algorithm analyzes your symptoms and history to provide an accurate risk assessment profile.",
    icon: <Brain className="w-6 h-6" />,
  },
  {
    title: "Symptom Tracking",
    description: "Monitor key indicators like cycle regularity, dermatological signs, and lifestyle factors in one place.",
    icon: <Activity className="w-6 h-6" />,
  },
  {
    title: "Lifestyle Insights",
    description: "Get personalized recommendations for diet, exercise, and sleep habits to manage your hormonal health.",
    icon: <Users className="w-6 h-6" />,
  },
];
