import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, CalendarDays, Users, TrendingUp, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Wifi,
    title: "Monitoring IoT",
    description: "Capteurs intelligents pour surveiller l'humidité, la température et la luminosité de vos cultures en temps réel",
    color: "text-primary/80"
  },
  {
    icon: CalendarDays,
    title: "Planification des cultures",
    description: "Organisez vos semis, plantations et récoltes avec un calendrier intelligent adapté à votre région",
    color: "text-blue-500"
  },
  {
    icon: Users,
    title: "Communauté et partage",
    description: "Échangez conseils, graines et récoltes avec d'autres jardiniers urbains près de chez vous",
    color: "text-purple-500"
  },
  {
    icon: TrendingUp,
    title: "Analyses et statistiques",
    description: "Suivez vos rendements, optimisez vos cultures et mesurez votre impact environnemental",
    color: "text-orange-500"
  },
  {
    icon: Brain,
    title: "Conseils IA et Diagnostics",
    description: "Assistance intelligente pour diagnostiquer les problèmes de vos plantes et recevoir des conseils personnalisés basés sur des données simulées",
    hasButton: true,
    color: "text-primary/80"
  }
];

const FeaturesSection = () => {
  return (
    <section className="container py-20 bg-secondary/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Fonctionnalités Principales
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tous les outils dont vous avez besoin pour réussir votre jardin urbain
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-3">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                {feature.description}
              </CardDescription>
              {feature.hasButton && (
                <Link to="/ia-fonctionnalites">
                  <Button size="sm" className="w-full">
                    Découvrir l'IA
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
