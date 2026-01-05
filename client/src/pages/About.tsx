import { Info } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="bg-primary/5 p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 text-primary">
            <Info className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">About PCOS</h1>
          <p className="text-xl text-muted-foreground">Polycystic Ovary Syndrome</p>
        </div>

        <div className="p-8 sm:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold font-display mb-4 text-foreground">What is PCOS?</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Polycystic Ovary Syndrome (PCOS) is a common hormonal condition that affects women of reproductive age. 
              It usually starts during adolescence, but symptoms may fluctuate over time.
            </p>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold font-display mb-4 text-foreground">Common Symptoms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Irregular periods or no periods at all",
                "Difficulty getting pregnant (irregular ovulation)",
                "Excessive hair growth (hirsutism) on face/body",
                "Weight gain",
                "Thinning hair and hair loss from the head",
                "Oily skin or acne"
              ].map((symptom, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-bold font-display mb-4 text-foreground">Why Early Detection Matters</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Early diagnosis and treatment are crucial. Managing PCOS early can help prevent long-term complications 
              such as type 2 diabetes and heart disease. Lifestyle changes are often the first line of treatment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
