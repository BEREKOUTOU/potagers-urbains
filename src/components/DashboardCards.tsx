import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Calendar, CloudRain } from "lucide-react";

const DashboardCards = () => {
  return (
    <section className="container py-16">
      <h1 className="text-2xl font-bold text-foreground flex items-center justify-center pb-0 mb-0">Tableau de bord rapide</h1>
      <p className="text-muted-foreground mb-6 flex items-center justify-center mt-0 pt-0">Surveillez vos jardins en temps réel</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Mes jardins actifs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-sm text-muted-foreground mt-1">Tous en bonne santé</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/10">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Prochaines tâches</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground font-medium">Arrosage - Aujourd'hui 18h</p>
            <p className="text-sm text-muted-foreground mt-1">Récolte tomates - Demain</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <CloudRain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Météo & Conseils</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground font-medium">25°C - Ensoleillé</p>
            <p className="text-sm text-muted-foreground mt-1">Idéal pour planter des salades</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DashboardCards;
