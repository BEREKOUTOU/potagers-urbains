import { Sprout} from "lucide-react"; // {Sprout}
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  MessageSquare,
  Calendar,
  Plus,
  MapPin,
  Image as ImageIcon,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Clock,
  Search,
  Filter,
  Star,
  Award
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import harvest1 from "@/assets/harvest-1.jpg";
import beforeAfter from "@/assets/before-after.jpg";
import workshop from "@/assets/workshop.jpg";
import garden1 from "@/assets/garden-1.jpg";
import garden2 from "@/assets/garden-2.jpg";
import garden3 from "@/assets/garden-3.jpg";
import garden4 from "@/assets/garden-4.jpg";

import Atelier from "@/assets/Atelier_Permaculture_urbaine.jpg";
import troc from "@/assets/Grand_Troc_Graines_Automne.jpg";
import visite from "@/assets/Visite_guidée_Jardin_sur_toit.jpg";

const forumCategories = [
  {
    icons: "🌱",
    name: "Débutants",
    description: "Questions et conseils pour bien démarrer",
    discussions: 234,
    lastPost: "Il y a 5 min",
    color: "bg-primary/10 text-primary"
  },
  {
    icons: "🔬",
    name: "Techniques avancées",
    description: "Permaculture, aquaponie et innovations",
    discussions: 156,
    lastPost: "Il y a 23 min",
    color: "bg-accent/10 text-accent"
  },
  {
    icons: "🐞",
    name: "Problèmes courants",
    description: "Maladies, parasites et solutions",
    discussions: 189,
    lastPost: "Il y a 1h",
    color: "bg-destructive/10 text-destructive"
  },
  {
    icons: "🌻",
    name: "Partage d'expériences",
    description: "Vos réussites et apprentissages",
    discussions: 312,
    lastPost: "Il y a 2h",
    color: "bg-secondary text-secondary-foreground"
  }
];

const localGroups = [
  {
    name: "Paris Centre",
    arrondissements: "1er, 2e, 3e, 4e",
    members: 145,
    nextEvent: "Troc de graines - Samedi 14h",
    image: garden1
  },
  {
    name: "Paris Est",
    arrondissements: "11e, 12e, 20e",
    members: 203,
    nextEvent: "Visite jardin partagé - Dimanche 10h",
    image: garden2
  },
  {
    name: "Paris Nord",
    arrondissements: "18e, 19e",
    members: 167,
    nextEvent: "Atelier compostage - Mercredi 18h",
    image: garden3
  }
];

const galleryPhotos = [
  { image: harvest1, category: "Récoltes", likes: 34, author: "Marie L." },
  { image: beforeAfter, category: "Avant/Après", likes: 52, author: "Thomas D." },
  { image: workshop, category: "Conseils", likes: 28, author: "Sophie M." },
  { image: garden1, category: "Jardins", likes: 41, author: "Pierre B." },
  { image: garden2, category: "Jardins", likes: 37, author: "Julie R." },
  { image: garden3, category: "Récoltes", likes: 29, author: "Marc T." }, 
  {image: garden4, category: "Récoltes", likes: 34, author: "Marie L." }
];

const questions = [
  {
    title: "Mes tomates ont des taches noires, que faire ?",
    author: "Alice M.",
    category: "Maladies",
    answers: 8,
    votes: 12,
    time: "Il y a 2h",
    hasExpert: true
  },
  {
    title: "Meilleur moment pour planter des salades ?",
    author: "Jean P.",
    category: "Plantation",
    answers: 5,
    votes: 7,
    time: "Il y a 4h",
    hasExpert: false
  },
  {
    title: "Comment optimiser l'arrosage automatique ?",
    author: "Claire D.",
    category: "Arrosage",
    answers: 12,
    votes: 18,
    time: "Il y a 6h",
    hasExpert: true
  }
];

const events = [
  {
    Image: Atelier,
    title: "Atelier Permaculture urbaine",
    date: "15 Nov 2024",
    time: "14h00",
    location: "Jardin des Lilas - Paris 20e",
    participants: 24,
    maxParticipants: 30,
    category: "Atelier"
  },
  {
    Image: troc,
    title: "Grand Troc de Graines d'Automne",
    date: "17 Nov 2024",
    time: "10h00",
    location: "Mairie du 11e",
    participants: 67,
    maxParticipants: 100,
    category: "Événement"
  },
  {
    Image: visite,
    title: "Visite guidée - Jardin sur toit",
    date: "20 Nov 2024",
    time: "16h00",
    location: "Paris 18e",
    participants: 15,
    maxParticipants: 20,
    category: "Visite"
  },
  {
    Image: garden4,
    title: "Atelier de jardinage urbain",
    date: "25 Nov 2024",
    time: "14h00",
    location: "Paris 12e",
    participants: 10,
    maxParticipants: 15,
    category: "Atelier"
  }
];

const featuredMembers = [
  {
    name: "Sophie Martin",
    initials: "SM",
    location: "Paris 20e",
    specialty: "Permaculture",
    gardens: 2,
    posts: 156,
    helpful: 89
  },
  {
    name: "Thomas Dubois",
    initials: "TD",
    location: "Paris 11e",
    specialty: "IoT & Automatisation",
    gardens: 1,
    posts: 98,
    helpful: 67
  },
  {
    name: "Marie Laurent",
    initials: "ML",
    location: "Paris 18e",
    specialty: "Jardinage vertical",
    gardens: 3,
    posts: 203,
    helpful: 124
  }
];

const recentActivities = [
  { type: "discussion", user: "Pierre B.", action: "a créé une discussion", time: "5 min" },
  { type: "photo", user: "Julie R.", action: "a partagé une photo", time: "15 min" },
  { type: "event", user: "Marc T.", action: "a créé un événement", time: "32 min" },
  { type: "member", user: "Claire D.", action: "a rejoint la communauté", time: "1h" },
  { type: "discussion", user: "Alice M.", action: "a répondu à une question", time: "2h" }
];

const Community = () => {
  // const [selectedSection, setSelectedSection] = useState("Tous");
  const [selectedSection, setSelectedSection] = useState("Forum");

const sections = [
  // { id: "Tous", label: "Toutes les sections", icon: Users },
    {  id: "Forum", label: "Forum de discussion", icon: MessageSquare },
    { id: "Groupes", label: "Groupes locaux", icon: MapPin },
    { id: "Galerie", label: "Galerie communautaire", icon: ImageIcon },
    { id: "Questions", label: "Questions-Réponses", icon: MessageCircle },
    { id: "Événements", label: "Événements locaux", icon: Calendar },
    { id: "Membres", label: "Membres de la semaine", icon: Star }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Communauté des Jardiniers Urbains
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Partagez vos expériences, apprenez des experts et cultivez ensemble
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-none shadow-lg bg-background">
                <CardContent className="pt-6 text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">12,389</p>
                  <p className="text-sm text-muted-foreground">Membres actifs</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-background">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-10 w-10 text-accent mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">891</p>
                  <p className="text-sm text-muted-foreground">Discussions actives</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-background">
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">47</p>
                  <p className="text-sm text-muted-foreground">Événements ce mois</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-background border-b">
          <div className="container">
            <div className="flex flex-wrap gap-2 justify-center">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "outline"}
                    onClick={() => setSelectedSection(section.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Forum Section */}
              {(selectedSection === "Tous" || selectedSection === "Forum") && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Forum de Discussion</h2>
                    <Button asChild>
                      <Link to="/communaute/nouvelle-discussion">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle discussion
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {forumCategories.map((category, index) => (
                      <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={category.color}>
                                  {category.icons} {category.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {category.discussions} discussions
                                </span>
                              </div>
                              <CardDescription>{category.description}</CardDescription>
                            </div>
                            <MessageCircle className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardFooter className="border-t pt-4">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Dernier message {category.lastPost}
                          </p>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Local Groups */}
              {(selectedSection === "Tous" || selectedSection === "Groupes") && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Groupes Locaux</h2>
                    <Button variant="outline">
                      <MapPin className="mr-2 h-4 w-4" />
                      Voir la carte
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {localGroups.map((group, index) => (
                      <Card key={index} className="border-none shadow-lg overflow-hidden">
                        <div className="h-32 overflow-hidden">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription>
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {group.arrondissements}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{group.members} membres</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{group.nextEvent}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">Rejoindre le groupe</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery */}
              {(selectedSection === "Tous" || selectedSection === "Galerie") && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Galerie Communautaire</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrer
                      </Button>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryPhotos.map((photo, index) => (
                      <Card key={index} className="border-none shadow-lg overflow-hidden group cursor-pointer">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={photo.image}
                            alt={photo.category}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-3 left-3 right-3">
                              <Badge className="mb-2">{photo.category}</Badge>
                              <div className="flex items-center justify-between text-white text-sm">
                                <span>{photo.author}</span>
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {photo.likes}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Q&A Section */}
              {(selectedSection === "Tous" || selectedSection === "Questions") && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Questions & Réponses</h2>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Poser une question
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                              <TrendingUp className="h-5 w-5 text-primary" />
                              <span className="text-lg font-bold text-foreground">{question.votes}</span>
                              <span className="text-xs text-muted-foreground">votes</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <CardTitle className="text-base">{question.title}</CardTitle>
                                {question.hasExpert && (
                                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                                    <Award className="h-3 w-3 mr-1" />
                                    Expert
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{question.author}</span>
                                <Badge variant="outline">{question.category}</Badge>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {question.answers} réponses
                                </span>
                                <span>{question.time}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Events */}
              {(selectedSection === "Tous" || selectedSection === "Événements") && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Événements à Venir</h2>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer événement
                    </Button>
                  </div>

                  <div className="space-y-4  grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event, index) => (
                      <Card key={index} className="border-none shadow-lg">
                        <CardHeader>
                          <img
                            src={event.Image}
                            alt={event.title}
                            className="w-full h-40 object-cover mb-4 rounded-md"
                          />
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge>{event.category}</Badge>
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{event.date} à {event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{event.participants}/{event.maxParticipants} participants</span>
                                </div>
                              </div>
                            </div>
                            <Button>S'inscrire</Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Featured Members */}
              {(selectedSection === "Tous" || selectedSection === "Membres") && (
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Membres de la Semaine</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {featuredMembers.map((member, index) => (
                      <Card key={index} className="border-none shadow-lg text-center">
                        <CardHeader>
                          <Avatar className="h-20 w-20 mx-auto mb-3 bg-primary/10">
                            <AvatarFallback className="text-2xl text-primary">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription>
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {member.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Badge className="bg-primary/10 text-primary">
                            <Star className="h-3 w-3 mr-1" />
                            {member.specialty}
                          </Badge>
                          <div className="grid grid-cols-3 gap-2 text-sm pt-2">
                            <div>
                              <p className="font-bold text-foreground">{member.gardens}</p>
                              <p className="text-muted-foreground text-xs">Jardins</p>
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{member.posts}</p>
                              <p className="text-muted-foreground text-xs">Posts</p>
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{member.helpful}</p>
                              <p className="text-muted-foreground text-xs">Utiles</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" size="sm">
                            Voir profil
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
              {/* Search */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Rechercher</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher dans la communauté..."
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start  bg-green-600 text-white" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une discussion
                  </Button>
                  <Button className="w-full justify-start bg-blue-600 text-white" variant="outline">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Partager une photo
                  </Button>
                  <Button className="w-full justify-start bg-purple-600 text-white" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Créer un événement
                  </Button>
                  <Button className="w-full justify-start bg-pink-600 text-white" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Rejoindre un groupe
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Activités Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{activity.user}</span>{' '}
                            <span className="text-muted-foreground">{activity.action}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
