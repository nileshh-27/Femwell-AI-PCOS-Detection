import { motion } from "framer-motion";
import { Utensils, Dumbbell, Moon, Coffee } from "lucide-react";

export default function Guidance() {
  const sections = [
    {
      title: "Dietary Adjustments",
      icon: <Utensils className="w-6 h-6" />,
      color: "bg-green-100 text-green-700",
      content: [
        "Focus on low glycemic index (GI) foods to manage insulin levels.",
        "Increase fiber intake with leafy greens, legumes, and whole grains.",
        "Include anti-inflammatory foods like berries, fatty fish, and turmeric.",
        "Avoid processed sugars and refined carbohydrates."
      ]
    },
    {
      title: "Exercise Routine",
      icon: <Dumbbell className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-700",
      content: [
        "Aim for 150 minutes of moderate activity per week.",
        "Include strength training 2-3 times a week to improve metabolism.",
        "Yoga and Pilates can help reduce cortisol (stress hormone) levels.",
        "Consistency is more important than intensity."
      ]
    },
    {
      title: "Sleep & Stress",
      icon: <Moon className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-700",
      content: [
        "Prioritize 7-9 hours of quality sleep nightly.",
        "Establish a calming bedtime routine, avoiding screens 1 hour before bed.",
        "Practice mindfulness or meditation to manage stress triggers.",
        "Keep your bedroom cool and dark for optimal rest."
      ]
    },
    {
      title: "Supplements to Discuss",
      icon: <Coffee className="w-6 h-6" />,
      color: "bg-amber-100 text-amber-700",
      content: [
        "Inositol: May help improve insulin sensitivity and ovulation.",
        "Vitamin D: Essential for hormone regulation.",
        "Omega-3 Fatty Acids: Helps reduce inflammation.",
        "Magnesium: Can support sleep and reduce anxiety."
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Holistic Management</h1>
        <p className="text-xl text-muted-foreground">
          Managing PCOS is a journey that often requires lifestyle adjustments. 
          Here are evidence-based pillars to support your well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-3xl hover:border-primary/20 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center mb-6`}>
              {section.icon}
            </div>
            
            <h3 className="text-2xl font-display font-bold mb-4">{section.title}</h3>
            
            <ul className="space-y-4">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
