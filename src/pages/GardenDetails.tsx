import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BackToTop from "@/components/BackToTop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Calendar,
  Clock,
  Camera,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Sprout,
  Droplets,
  Sun,
  Wind,
  Heart,
  Share2,
  Download
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gardens } from "@/data/gardens";

const GardenDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const garden = gardens.find(g => g.id === parseInt(id || "0"));

  if (!garden) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Jardin non trouvé</h1>
          <Button onClick={() => navigate("/decouvrir-jardins")}>
            Retour aux jardins
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock data for additional garden details
  const gardenImages = [
    garden.image,
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
    "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800"
  ];

  const gardenMembers = [
    { id: 1, name: "Marie Dupont", role: "Coordinatrice", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150", specialty: "Légumes bio" },
    { id: 2, name: "Pierre Martin", role: "Membre actif", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", specialty: "Herbes aromatiques" },
    { id: 3, name: "Sophie Bernard", role: "Membre actif", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", specialty: "Fleurs comestibles" },
    { id: 4, name: "Jean Leroy", role: "Membre actif", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", specialty: "Permaculture" },
    { id: 5, name: "Anne Moreau", role: "Membre actif", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", specialty: "Compostage" },
    { id: 6, name: "Luc Dubois", role: "Membre actif", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", specialty: "Arrosage économe" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Atelier compostage", date: "2024-01-15", time: "14h-16h", description: "Apprenez à faire votre compost maison" },
    { id: 2, title: "Réunion mensuelle", date: "2024-01-20", time: "18h-20h", description: "Point sur les activités du mois" },
    { id: 3, title: "Semis de printemps", date: "2024-02-01", time: "10h-12h", description: "Préparation des semis pour la saison" },
    { id: 4, title: "Journée portes ouvertes", date: "2024-02-10", time: "14h-18h", description: "Venez découvrir notre jardin" }
  ];

  const cultivationMethods = [
    {
      title: "Permaculture",
      description: "Nous appliquons les principes de la permaculture pour créer un écosystème durable et productif.",
      icon: Sprout
    },
    {
      title: "Agriculture biologique",
      description: "Tous nos légumes sont cultivés sans pesticides ni engrais chimiques.",
      icon: Heart
    },
    {
      title: "Arrosage économe",
      description: "Système de récupération d'eau de pluie et arrosage au pied pour économiser l'eau.",
      icon: Droplets
    },
    {
      title: "Culture en lasagne",
      description: "Méthode de culture sur buttes pour améliorer la structure du sol.",
      icon: Sun
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Claire Martin",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      role: "Membre depuis 2 ans",
      content: "Le Potager de Belleville m'a permis de découvrir le plaisir du jardinage urbain. J'ai appris tant de choses sur la permaculture et j'adore notre communauté solidaire.",
      rating: 5
    },
    {
      id: 2,
      name: "Thomas Dubois",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Membre depuis 1 an",
      content: "Un endroit merveilleux pour se reconnecter avec la nature en plein Paris. Les ateliers sont excellents et l'ambiance est toujours conviviale.",
      rating: 5
    },
    {
      id: 3,
      name: "Sophie Leroy",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "Membre depuis 6 mois",
      content: "J'ai trouvé ici non seulement un jardin, mais une vraie communauté. Les compétences acquises en compostage et jardinage bio sont inestimables.",
      rating: 4
    }
  ];

  const practicalInfo = {
    address: "45 rue de Belleville, 75019 Paris",
    transport: ["Métro : Belleville (ligne 11)", "Bus : Lignes 20, 71", "Vélib' : Station n°19001"],
    openingHours: {
      weekdays: "9h - 19h",
      weekends: "10h - 18h",
      closed: "Fermé les jours fériés"
    },
    coordinator: {
      name: "Marie Dupont",
      email: "marie.dupont@potager-belleville.fr",
      phone: "06 12 34 56 78"
    },
    materials: ["Gants de jardinage", "Outils personnels si souhaité", "Arrosoir", "Seau"],
    integration: "Visite d'accueil obligatoire • Formation de 2h • Participation aux tâches collectives"
  };

  const gardenRules = `
Règlement intérieur du jardin ${garden.name}

1. Respect des horaires d'ouverture et de fermeture
2. Participation aux tâches collectives selon le planning établi
3. Utilisation responsable des outils et équipements
4. Respect de l'environnement et des autres membres
5. Interdiction de consommer les produits sans autorisation
6. Signalement des problèmes ou incidents immédiatement
7. Participation aux réunions mensuelles
8. Respect des règles d'hygiène et de sécurité

En cas de non-respect répété, l'accès au jardin pourra être suspendu.
  `.trim();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gardenImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gardenImages.length) % gardenImages.length);
  };

  const similarGardens = gardens.filter(g => g.id !== garden.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 mb-6"
              onClick={() => navigate("/decouvrir-jardins")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux jardins
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{garden.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xl">{garden.location}</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{garden.members}/{garden.maxMembers} membres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(garden.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span>{garden.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {garden.crops.map((crop) => (
                    <Badge key={crop} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {crop}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {garden.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="border-white text-white">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <p className="text-lg opacity-90 mb-6">{garden.description}</p>
                <div className="flex gap-4">
                  <Button size="lg" onClick={() => navigate(`/rejoindre-jardin/${garden.id}`)}>
                    Rejoindre ce jardin
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-800">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
              <div className="lg:pl-8">
                <div className="relative">
                  <img
                    src={gardenImages[currentImageIndex]}
                    alt={garden.name}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {gardenImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="members">Membres</TabsTrigger>
                <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                <TabsTrigger value="methods">Méthodes</TabsTrigger>
                <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
                <TabsTrigger value="practical">Pratiques</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* General Information */}
              <TabsContent value="general" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Description and Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos du jardin</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{garden.description}</p>
                      <div>
                        <h4 className="font-semibold mb-2">Équipements disponibles</h4>
                        <div className="flex flex-wrap gap-2">
                          {garden.features.map((feature) => (
                            <Badge key={feature} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Types de culture</h4>
                        <div className="flex flex-wrap gap-2">
                          {garden.crops.map((crop) => (
                            <Badge key={crop} variant="outline">{crop}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hours and Rules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Horaires et règlement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Horaires d'ouverture</h4>
                        <div className="space-y-1 text-sm">
                          <p>Lundi - Vendredi: 9h - 19h</p>
                          <p>Samedi - Dimanche: 10h - 18h</p>
                          <p className="text-muted-foreground">Fermé les jours fériés</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Règlement intérieur</h4>
                        <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs">{gardenRules}</pre>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger le règlement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Members */}
              <TabsContent value="members" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Membres actifs ({gardenMembers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gardenMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <Badge variant="outline" className="text-xs mt-1">{member.specialty}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Calendar */}
              <TabsContent value="calendar" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Prochaines activités
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(event.date).toLocaleDateString('fr-FR')} • {event.time}
                            </p>
                            <p className="text-sm">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cultivation Methods */}
              <TabsContent value="methods" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cultivationMethods.map((method, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <method.icon className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{method.title}</h4>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Testimonials */}
              <TabsContent value="testimonials" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Témoignages des membres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="border-l-4 border-primary pl-6 py-4">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                              <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{testimonial.name}</h4>
                                <Badge variant="outline" className="text-xs">{testimonial.role}</Badge>
                                <div className="flex">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < testimonial.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Practical Information */}
              <TabsContent value="practical" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Address and Transport */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Localisation et accès
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Adresse</h4>
                        <p className="text-muted-foreground">{practicalInfo.address}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Transports en commun</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {practicalInfo.transport.map((transport, index) => (
                            <li key={index}>• {transport}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Opening Hours */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Horaires d'ouverture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Lundi - Vendredi</span>
                          <span className="text-sm font-medium">{practicalInfo.openingHours.weekdays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Samedi - Dimanche</span>
                          <span className="text-sm font-medium">{practicalInfo.openingHours.weekends}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{practicalInfo.openingHours.closed}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Coordinator Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Coordinateur
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span>{practicalInfo.coordinator.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span>{practicalInfo.coordinator.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{practicalInfo.coordinator.phone}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Materials and Integration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Matériel et intégration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Matériel à apporter</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {practicalInfo.materials.map((material, index) => (
                            <li key={index}>• {material}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Processus d'intégration</h4>
                        <p className="text-sm text-muted-foreground">{practicalInfo.integration}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Contact */}
              <TabsContent value="contact" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact et candidature</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Responsables du jardin</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span>Marie Dupont (Coordinatrice)</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span>marie.dupont@jardin-paris.fr</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <span>06 12 34 56 78</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Adresse</h4>
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p>{garden.location}</p>
                            <p className="text-sm text-muted-foreground">Paris, France</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t">
                      <Button size="lg" onClick={() => navigate(`/rejoindre-jardin/${garden.id}`)}>
                        Postuler pour rejoindre ce jardin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Similar Gardens */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Jardins similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarGardens.map((similarGarden) => (
                <Card key={similarGarden.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/jardin/${similarGarden.id}`)}>
                  <div className="h-48">
                    <img
                      src={similarGarden.image}
                      alt={similarGarden.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{similarGarden.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {similarGarden.location}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(similarGarden.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm ml-1">{similarGarden.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{similarGarden.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default GardenDetails;
