import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import BackToTop from "@/components/BackToTop";
import img from '../assets/img.jpg';
import img0 from '../assets/img0.jpg';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';

import tomate from '../assets/tomate.jpg';
import basilic from '../assets/basilic.jpg';
import radis from '../assets/radis.jpg';
import fraise from '../assets/fraise.jpg';
import lavande from '../assets/lavande.jpg';
import persil from '../assets/persil.jpg';

import Arrosoir  from '../assets/Arrosoir.jpg';
import Sécateur  from '../assets/Sécateur.jpg';
import Bac_potager_80x40cm  from '../assets/Bac_potager_80x40cm.jpg';
import Pots_en_terre_cuite  from '../assets/Pots_en_terre_cuite.jpg';
import Système_vertical  from '../assets/Système_vertical.jpg';
import Grelinette from '../assets/Grelinette.jpg';
import Gants_de_jardinage from '../assets/Gants_de_jardinage.jpg';
import Arrosage_goutte_goutte from '../assets/Arrosage_goutte_goutte.jpg';
import Programmateur_automatique from '../assets/Programmateur_automatique.jpg';
import capteur_d_humidite from '../assets/capteur-d-humidite-du-sol.webp';

import {
  Search,
  Filter,
  BookOpen,
  Leaf,
  Calendar as CalendarIcon,
  Wrench,
  Play,
  Download,
  Clock,
  Star,
  TrendingUp,
  Plus,
  Heart,
  Share2,
  FileText,
  Video,
  Image as ImageIcon,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedMonth, setSelectedMonth] = useState("Janvier");
  const [selectedPlantCategory, setSelectedPlantCategory] = useState("Toutes les plantes");
  const navigate = useNavigate();

  const guides = [
    {
      title: "Débuter son potager urbain",
      description: "Guide complet pour créer votre premier jardin en ville",
      duration: "15 min",
      difficulty: "Débutant",
      image: img,
    },
    {
      title: "Optimiser un balcon",
      description: "Maximiser l'espace disponible sur votre balcon",
      duration: "12 min",
      difficulty: "Intermédiaire",
      image: img0,
    },
    {
      title: "Jardinage vertical",
      description: "Techniques pour cultiver verticalement",
      duration: "20 min",
      difficulty: "Avancé",
      image: img1,
    },
    {
      title: "Compostage en ville",
      description: "Créer et maintenir un compost urbain efficace",
      duration: "18 min",
      difficulty: "Débutant",
      image: img2,
    }
  ];

  const plantCards = [
    {
      name: "Tomates cerises",
      category: "Légumes",
      difficulty: "Facile",
      planting: "Mars - Mai",
      harvest: "Juillet - Octobre",
      watering: "Modéré",
      image: tomate
    },
    {
      name: "Basilic",
      category: "Herbes aromatiques",
      difficulty: "Très facile",
      planting: "Avril - Juin",
      harvest: "Mai - Octobre",
      watering: "Régulier",
      image: basilic
    },
    {
      name: "Radis",
      category: "Légumes",
      difficulty: "Très facile",
      planting: "Mars - Septembre",
      harvest: "Avril - Novembre",
      watering: "Régulier",
      image: radis
    },
    {
      name: "Fraisiers",
      category: "Fruits",
      difficulty: "Facile",
      planting: "Mars - Mai",
      harvest: "Mai - Juillet",
      watering: "Régulier",
      image: fraise
    },
    {
      name: "Menthe",
      category: "Herbes aromatiques",
      difficulty: "Très facile",
      planting: "Mars - Octobre",
      harvest: "Avril - Novembre",
      watering: "Abondant",
      image: persil
    },
    {
      name: "Pensées",
      category: "Fleurs",
      difficulty: "Facile",
      planting: "Septembre - Novembre",
      harvest: "Octobre - Mai",
      watering: "Modéré",
      image: lavande
    }
  ];

  const tools = [
    {
      name: "Outils de base",
      items: [
        { name: "Grelinette", priority: "Essentiel", price: "25-40€", image: Grelinette },
        { name: "Arrosoir 10L", priority: "Essentiel", price: "15-25€", image: Arrosoir },
        { name: "Gants de jardinage", priority: "Essentiel", price: "8-15€", image: Gants_de_jardinage }
      ]
    },
    {
      name: "Contenants et bacs",
      items: [
        { name: "Bac potager 80x40cm", priority: "Recommandé", price: "30-50€", image: Bac_potager_80x40cm },
        { name: "Pots en terre cuite", priority: "Optionnel", price: "5-15€/pièce", image: Pots_en_terre_cuite },
        { name: "Système vertical", priority: "Avancé", price: "50-100€", image: Système_vertical }
      ]
    },
    {
      name: "Systèmes d'arrosage",
      items: [
        { name: "Arrosage goutte à goutte", priority: "Recommandé", price: "20-40€", image: Arrosage_goutte_goutte },
        { name: "Programmateur automatique", priority: "Avancé", price: "30-60€", image: Programmateur_automatique },
        { name: "Capteurs d'humidité", priority: "Expert", price: "15-30€", image: capteur_d_humidite }
      ]
    }
  ];

  const videos = [
    {
      title: "Semis de tomates en intérieur",
      duration: "8:32",
      level: "Débutant",
      category: "Techniques de base",
      thumbnail: "/placeholder.svg",
      views: 1250
    },
    {
      title: "Prévention des maladies courantes",
      duration: "12:45",
      level: "Intermédiaire",
      category: "Problèmes courants",
      thumbnail: "/placeholder.svg",
      views: 890
    },
    {
      title: "Installation d'un système hydroponique",
      duration: "18:20",
      level: "Avancé",
      category: "Projets avancés",
      thumbnail: "/placeholder.svg",
      views: 567
    },
    {
      title: "Taille des fruitiers en pots",
      duration: "10:15",
      level: "Intermédiaire",
      category: "Entretien saisonnier",
      thumbnail: "/placeholder.svg",
      views: 734
    }
  ];

  const downloads = [
    {
      title: "Guide complet du potager urbain",
      type: "PDF",
      size: "2.4 MB",
      downloads: 1250,
      icon: FileText
    },
    {
      title: "Calendrier de plantation Paris",
      type: "PDF",
      size: "1.8 MB",
      downloads: 890,
      icon: CalendarIcon
    },
    {
      title: "Fiches techniques légumes",
      type: "ZIP",
      size: "5.2 MB",
      downloads: 567,
      icon: FileText
    },
    {
      title: "Check-list débutant",
      type: "PDF",
      size: "0.8 MB",
      downloads: 1234,
      icon: CheckCircle
    }
  ];

  const popularResources = [
    { title: "Guide débutant", type: "PDF", views: 3400 },
    { title: "Calendrier 2024", type: "PDF", views: 5600 },
    { title: "Planter des tomates", type: "Vidéo", views: 12500 },
    { title: "Basilic - Fiche", type: "Fiche", views: 2100 }
  ];

  const recentResources = [
    { title: "Nouveau guide permaculture", date: "Il y a 2 jours" },
    { title: "Mise à jour calendrier 2024", date: "Il y a 5 jours" },
    { title: "Fiche nouvelles variétés", date: "Il y a 1 semaine" },
    { title: "Tutoriel arrosage automatique", date: "Il y a 2 semaines" }
  ];

  const calendarData: Record<string, Record<string, string[]>> = {
    "Janvier": {
      "À semer": ["Fèves", "Petits pois"],
      "À planter": ["Tulipes", "Narcisses"],
      "À récolter": ["Épinards", "Mâche", "Choux"],
      "Entretien": ["Pailler", "Vider les réserves d'eau", "Rentrer les plantes fragiles"]
    },
    "Février": {
      "À semer": ["Carottes", "Radis"],
      "À planter": ["Ail", "Oignons"],
      "À récolter": ["Choux", "Poireaux"],
      "Entretien": ["Préparer les sols", "Nettoyer les outils"]
    },
    "Mars": {
      "À semer": ["Tomates", "Poivrons"],
      "À planter": ["Pommes de terre", "Haricots"],
      "À récolter": ["Radis", "Laitues"],
      "Entretien": ["Arroser régulièrement", "Fertiliser"]
    },
    "Avril": {
      "À semer": ["Basilic", "Persil"],
      "À planter": ["Tomates", "Concombres"],
      "À récolter": ["Radis", "Carottes"],
      "Entretien": ["Pailler les sols", "Surveiller les maladies"]
    },
    "Mai": {
      "À semer": ["Haricots", "Courgettes"],
      "À planter": ["Melons", "Pastèques"],
      "À récolter": ["Laitues", "Épinards"],
      "Entretien": ["Arroser en profondeur", "Taille des plantes"]
    },
    "Juin": {
      "À semer": ["Carottes", "Betteraves"],
      "À planter": ["Choux", "Brocolis"],
      "À récolter": ["Fraises", "Framboises"],
      "Entretien": ["Mulcher", "Protéger des parasites"]
    },
    "Juillet": {
      "À semer": ["Épinards", "Mâche"],
      "À planter": ["Ail d'automne"],
      "À récolter": ["Tomates", "Concombres"],
      "Entretien": ["Arroser matin/soir", "Récolter régulièrement"]
    },
    "Août": {
      "À semer": ["Radis", "Laitues"],
      "À planter": ["Échalotes"],
      "À récolter": ["Haricots", "Courgettes"],
      "Entretien": ["Pailler abondamment", "Surveiller l'humidité"]
    },
    "Septembre": {
      "À semer": ["Fèves", "Petits pois"],
      "À planter": ["Ail", "Oignons"],
      "À récolter": ["Tomates", "Poivrons"],
      "Entretien": ["Préparer l'automne", "Nettoyer les plates-bandes"]
    },
    "Octobre": {
      "À semer": ["Blé", "Avoine"],
      "À planter": ["Tulipes", "Jacinthes"],
      "À récolter": ["Choux", "Poireaux"],
      "Entretien": ["Rentrer les plantes sensibles", "Protéger du gel"]
    },
    "Novembre": {
      "À semer": ["Épinards d'hiver"],
      "À planter": ["Ail", "Oignons"],
      "À récolter": ["Choux", "Betteraves"],
      "Entretien": ["Pailler épais", "Préparer les abris"]
    },
    "Décembre": {
      "À semer": ["Fèves"],
      "À planter": ["Bulbes de printemps"],
      "À récolter": ["Choux d'hiver", "Poireaux"],
      "Entretien": ["Surveiller les gelées", "Planifier la saison prochaine"]
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Centre de Ressources
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Accédez à nos guides éducatifs, fiches techniques et outils pour réussir votre jardinage urbain
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">47</div>
                  <div className="text-sm text-muted-foreground">Guides pratiques</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Fiches plantes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">89</div>
                  <div className="text-sm text-muted-foreground">Vidéos tutoriels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">34</div>
                  <div className="text-sm text-muted-foreground">Documents PDF</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Search and Filters */}
              <section>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans les ressources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["Tous", "Guides pratiques", "Fiches plantes", "Calendrier", "Outils", "Vidéos", "Documents"].map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Guides Pratiques */}
              {(selectedCategory === "Tous" || selectedCategory === "Guides pratiques") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Guides Pratiques de Jardinage Urbain</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {guides.map((guide, index) => (
                      <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                          <img src={guide.image} alt={guide.title} className="w-100 h-100 object-cover rounded-lg flex-shrink-0" />
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                              <CardDescription className="mb-3">{guide.description}</CardDescription>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {guide.duration}
                                </div>
                                <Badge variant="outline">{guide.difficulty}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <Button className="w-full" onClick={() => navigate(`/guide/${encodeURIComponent(guide.title.toLowerCase().replace(/\s+/g, '-'))}`)}>Lire le guide</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Fiches Techniques par Plantes */}
              {(selectedCategory === "Tous" || selectedCategory === "Fiches plantes") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Fiches Techniques par Plantes</h2>

                  {/* Plant Category Filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Toutes les plantes", "Légumes", "Herbes aromatiques", "Fruits", "Fleurs"].map((category) => (
                      <Button
                        key={category}
                        variant={selectedPlantCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPlantCategory(category)}
                      >
                        {category}
                        {category === "Toutes les plantes" && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {plantCards.length}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plantCards
                      .filter(plant => selectedPlantCategory === "Toutes les plantes" || plant.category === selectedPlantCategory)
                      .map((plant, index) => (
                        <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                          <CardHeader>
                            <img src={plant.image} alt={plant.name} className="w-100 h-100 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                <Leaf className="h-6 w-6 text-accent" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{plant.name}</CardTitle>
                                <Badge variant="outline" className="mt-1">{plant.category}</Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Plantation:</span>
                                <p className="font-medium">{plant.planting}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Récolte:</span>
                                <p className="font-medium">{plant.harvest}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-sm">Arrosage:</span>
                              <p className="text-sm">{plant.watering}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground text-sm">Difficulté:</span>
                              <p className="text-sm font-medium">{plant.difficulty}</p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="w-full">Voir la fiche complète</Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </section>
              )}

              {/* Calendrier de Plantation */}
              {(selectedCategory === "Tous" || selectedCategory === "Calendrier") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Calendrier de Plantation Interactif</h2>
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle>Région Parisienne - 2024</CardTitle>
                      <CardDescription>
                        Découvrez les meilleurs moments pour semer, planter et récolter selon les saisons
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez un mois" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(calendarData).map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col md:flex-row gap-24">
                        {Object.entries(calendarData[selectedMonth]).map(([category, activities]) => (
                          <div key={category} className="space-y-3">
                            <h4 className="font-semibold mb-3 text-primary">{category}</h4>
                            <div className="space-y-2">
                              {activities.map((activity, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                                  <span className="text-sm">{activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Télécharger le calendrier complet
                      </Button>
                    </CardFooter>
                  </Card>
                </section>
              )}

              {/* Outils et Matériel */}
              {(selectedCategory === "Tous" || selectedCategory === "Outils") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Outils et Matériel Recommandés</h2>
                  <div className="space-y-8">
                    {tools.map((category, index) => (
                      <div key={index}>
                        <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {category.items.map((item, itemIndex) => (
                            <Card key={itemIndex} className="border-none shadow-lg">
                              <CardHeader>
                                <img src={item.image} alt={item.name} className="w-100 h-48 object-cover rounded-lg mb-4 flex-shrink-0" />
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{item.name}</CardTitle>
                                  <Badge
                                    variant={item.priority === "Essentiel" ? "default" :
                                    item.priority === "Recommandé" ? "secondary" : "outline"}
                                  >
                                    {item.priority}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">{item.price}</p>
                                <p className="text-sm">
                                  {item.priority === "Essentiel" ? "Indispensable pour débuter" :
                                   item.priority === "Recommandé" ? "Améliore significativement l'expérience" :
                                   "Pour les jardiniers expérimentés"}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button variant="outline" size="sm" className="w-full">
                                  Voir les options
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Bibliothèque de Vidéos */}
              {(selectedCategory === "Tous" || selectedCategory === "Vidéos") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Bibliothèque de Vidéos Tutoriels</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video, index) => (
                      <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                          <div className="relative">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                              <Play className="h-12 w-12 text-primary" />
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">{video.duration}</Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{video.level}</Badge>
                            <Badge variant="outline">{video.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {video.views} vues
                          </p>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button className="flex-1">
                            <Play className="mr-2 h-4 w-4" />
                            Regarder
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Centre de Téléchargements */}
              {(selectedCategory === "Tous" || selectedCategory === "Documents") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Centre de Téléchargements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {downloads.map((doc, index) => (
                      <Card key={index} className="border-none shadow-lg">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <doc.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{doc.title}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{doc.type}</Badge>
                                <span>{doc.size}</span>
                                <span>{doc.downloads} téléchargements</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Resources */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Ressources Populaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularResources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">{resource.type}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resource.views} vues
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Resources */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Nouveautés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentResources.map((resource, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">{resource.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contribute */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Contribuer
                  </CardTitle>
                  <CardDescription>
                    Partagez vos connaissances et aidez la communauté
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Soumettre un guide
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Partager une vidéo
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Ajouter une fiche plante
                  </Button>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Newsletter Ressources</CardTitle>
                  <CardDescription>
                    Recevez les nouvelles ressources chaque semaine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Votre mail" />
                  <Button className="w-full">S'abonner</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Resources;
