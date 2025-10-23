import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";
import garden1 from "@/assets/garden-1.jpg";
import garden2 from "@/assets/garden-2.jpg";
import garden3 from "@/assets/garden-3.jpg";

const gardens = [
  {
    name: "Jardin des Lilas",
    image: garden1,
    members: 24,
    location: "Paris 20ème"
  },
  {
    name: "Potager du Toit",
    image: garden2,
    members: 18,
    location: "Lyon 3ème"
  },
  {
    name: "Balcon Partagé",
    image: garden3,
    members: 12,
    location: "Marseille 6ème"
  }
];

const GardensGrid = () => {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Jardins Populaires
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Rejoignez les jardins partagés les plus actifs de votre région
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gardens.map((garden, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={garden.image} 
                alt={garden.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <CardHeader>
              <CardTitle>{garden.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{garden.members} membres</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{garden.location}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Rejoindre</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default GardensGrid;
