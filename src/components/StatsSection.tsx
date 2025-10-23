import { useState, useEffect } from 'react';

const stats = [
  {
    number: "2,547",
    label: "Jardins connectés"
  },
  {
    number: "12,389",
    label: "Utilisateurs actifs"
  },
  {
    number: "45,678",
    label: "Légumes cultivés"
  },
  {
    number: "127 T",
    label: "CO₂ économisé"
  }
];

const StatsSection = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState<Array<number>>([0, 0, 0, 0]);

  useEffect(() => {
    const targets = stats.map(stat => {
      const numStr = stat.number.replace(/,/g, '').replace(' t', '');
      return parseInt(numStr, 10);
    });

    const duration = 2000; // 2 seconds
    const steps = 40; // Update every 50ms
    const increment = targets.map(target => target / steps);

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedNumbers(prev =>
        prev.map((num, index) => {
          const newNum = Math.min(num + increment[index], targets[index]);
          return Math.floor(newNum);
        })
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedNumbers(targets); // Ensure exact final values
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number, label: string): string => {
    if (label === "CO₂ économisé") {
      return `${num.toLocaleString()} t`;
    }
    return num.toLocaleString();
  };

  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Notre impact & Statistiques sur les jardins urbains
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Des milliers de jardiniers urbains nous font confiance
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300"
          >
            <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {formatNumber(animatedNumbers[index], stat.label)}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
