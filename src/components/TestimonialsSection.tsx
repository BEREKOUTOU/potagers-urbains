import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Marie Laurent",
    role: "Jardinière urbaine",
    initials: "ML",
    comment: "Grâce à cette plateforme, j'ai transformé mon balcon en véritable potager productif. Les conseils de la communauté sont précieux !"
  },
  {
    name: "Thomas Dubois",
    role: "Membre actif",
    initials: "TD",
    comment: "Les capteurs IoT m'ont permis d'optimiser l'arrosage et j'ai doublé ma production de tomates cette année. Incroyable !"
  },
  {
    name: "Sophie Martin",
    role: "Coordinatrice jardin partagé",
    initials: "SM",
    comment: "Un outil indispensable pour gérer notre jardin partagé. La planification des cultures et le partage des tâches n'ont jamais été aussi simples."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="container py-20 bg-secondary/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ce que disent nos jardiniers
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Des milliers de jardiniers urbains nous font confiance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card 
            key={index}
            className="border-none shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 bg-primary/10">
                  <AvatarFallback className="text-primary font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{testimonial.comment}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
