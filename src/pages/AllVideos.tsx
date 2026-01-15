import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackToTop from "@/components/BackToTop";
import {
  Search,
  Filter,
  Play,
  Share2,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Heart,
  Bookmark
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AllVideos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les vidéos");
  const [selectedLevel, setSelectedLevel] = useState("Tous niveaux");
  const [selectedDuration, setSelectedDuration] = useState("Toutes durées");
  const [sortBy, setSortBy] = useState("Plus récentes");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const videos = [
    {
      title: "Semis de tomates en intérieur",
      duration: "8:32",
      level: "Débutant",
      category: "Techniques de base",
      thumbnail: "/placeholder.svg",
      views: 1250,
      date: "2024-01-15",
      author: "Marie Dubois",
      description: "Apprenez à semer vos tomates en intérieur pour un démarrage réussi de votre saison de jardinage."
    },
    {
      title: "Prévention des maladies courantes",
      duration: "12:45",
      level: "Intermédiaire",
      category: "Problèmes courants",
      thumbnail: "/placeholder.svg",
      views: 890,
      date: "2024-01-10",
      author: "Pierre Martin",
      description: "Découvrez comment identifier et prévenir les maladies les plus courantes dans votre potager urbain."
    },
    {
      title: "Installation d'un système hydroponique",
      duration: "18:20",
      level: "Avancé",
      category: "Projets avancés",
      thumbnail: "/placeholder.svg",
      views: 567,
      date: "2024-01-08",
      author: "Sophie Laurent",
      description: "Guide complet pour installer votre propre système hydroponique en milieu urbain."
    },
    {
      title: "Taille des fruitiers en pots",
      duration: "10:15",
      level: "Intermédiaire",
      category: "Entretien saisonnier",
      thumbnail: "/placeholder.svg",
      views: 734,
      date: "2024-01-05",
      author: "Jean Dupont",
      description: "Maîtrisez l'art de la taille des fruitiers cultivés en pots pour une meilleure fructification."
    },
    {
      title: "Compostage en appartement",
      duration: "15:30",
      level: "Débutant",
      category: "Techniques de base",
      thumbnail: "/placeholder.svg",
      views: 2100,
      date: "2024-01-03",
      author: "Claire Bernard",
      description: "Comment créer et maintenir un compost efficace même dans un petit appartement."
    },
    {
      title: "Jardinage vertical sur balcon",
      duration: "22:10",
      level: "Avancé",
      category: "Projets avancés",
      thumbnail: "/placeholder.svg",
      views: 1456,
      date: "2024-01-01",
      author: "Thomas Moreau",
      description: "Techniques avancées pour optimiser l'espace vertical de votre balcon."
    },
    {
      title: "Semis sous abri",
      duration: "9:45",
      level: "Débutant",
      category: "Techniques de base",
      thumbnail: "/placeholder.svg",
      views: 980,
      date: "2023-12-28",
      author: "Anne Petit",
      description: "Protégez vos semis précoces avec des techniques d'abri adaptées à la ville."
    },
    {
      title: "Gestion des parasites naturels",
      duration: "14:20",
      level: "Intermédiaire",
      category: "Problèmes courants",
      thumbnail: "/placeholder.svg",
      views: 1234,
      date: "2023-12-25",
      author: "Michel Roux",
      description: "Utilisez les méthodes naturelles pour contrôler les parasites dans votre jardin urbain."
    },
    {
      title: "Création d'un jardin aromatique",
      duration: "11:50",
      level: "Intermédiaire", 
      category: "Projets avancés",
      thumbnail: "/placeholder.svg",
      views: 2100,
      date: "2023-12-22",
      author: "Julie Dubois",
      description: "Créez un jardin aromatique en utilisant des plantes aromatiques et des techniques de jardinage."
    }
  ];

  const playlists = [
    { title: "Débuter son potager urbain", count: 8, thumbnail: "/placeholder.svg" },
    { title: "Jardinage vertical", count: 12, thumbnail: "/placeholder.svg" },
    { title: "Solutions aux problèmes courants", count: 15, thumbnail: "/placeholder.svg" },
    { title: "Projets DIY avancés", count: 10, thumbnail: "/placeholder.svg" }
  ];

  const popularVideos = videos.slice(0, 5);
  const recentVideos = videos.slice(0, 4);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes les vidéos" || video.category === selectedCategory;
    const matchesLevel = selectedLevel === "Tous niveaux" || video.level === selectedLevel;
    const matchesDuration = selectedDuration === "Toutes durées" ||
                           (selectedDuration === "Courtes (0-5 min)" && parseInt(video.duration.split(':')[0]) < 5) ||
                           (selectedDuration === "Moyennes (5-15 min)" && parseInt(video.duration.split(':')[0]) >= 5 && parseInt(video.duration.split(':')[0]) < 15) ||
                           (selectedDuration === "Longues (15+ min)" && parseInt(video.duration.split(':')[0]) >= 15);

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case "Plus populaires":
        return b.views - a.views;
      case "Durée croissante":
        return parseInt(a.duration.split(':')[0]) - parseInt(b.duration.split(':')[0]);
      case "Durée décroissante":
        return parseInt(b.duration.split(':')[0]) - parseInt(a.duration.split(':')[0]);
      case "Alphabétique":
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const videosPerPage = 12;
  const totalPages = Math.ceil(sortedVideos.length / videosPerPage);
  const paginatedVideos = sortedVideos.slice((currentPage - 1) * videosPerPage, currentPage * videosPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/ressources')}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour aux ressources
                </Button>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Bibliothèque Vidéo Complète
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Accédez à tous nos tutoriels vidéo pour maîtriser le jardinage urbain, du débutant à l'expert
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{videos.length}</div>
                  <div className="text-sm text-muted-foreground">Vidéos disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">2h 45min</div>
                  <div className="text-sm text-muted-foreground">Contenu total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">4</div>
                  <div className="text-sm text-muted-foreground">Catégories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">3</div>
                  <div className="text-sm text-muted-foreground">Niveaux</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Search and Filters */}
              <section>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans les vidéos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Recherche avancée
                  </Button>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Catégories:</span>
                    {["Toutes les vidéos", "Techniques de base", "Problèmes courants", "Projets avancés", "Entretien saisonnier"].map((category) => (
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

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Niveau:</span>
                    {["Tous niveaux", "Débutant", "Intermédiaire", "Avancé"].map((level) => (
                      <Button
                        key={level}
                        variant={selectedLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLevel(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Durée:</span>
                    {["Toutes durées", "Courtes (0-5 min)", "Moyennes (5-15 min)", "Longues (15+ min)"].map((duration) => (
                      <Button
                        key={duration}
                        variant={selectedDuration === duration ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDuration(duration)}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Sort and View Options */}
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plus récentes">Plus récentes</SelectItem>
                        <SelectItem value="Plus populaires">Plus populaires</SelectItem>
                        <SelectItem value="Durée croissante">Durée croissante</SelectItem>
                        <SelectItem value="Durée décroissante">Durée décroissante</SelectItem>
                        <SelectItem value="Alphabétique">Alphabétique</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {filteredVideos.length} vidéos trouvées
                  </div>
                </div>
              </section>

              {/* Videos Grid/List */}
              <section>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedVideos.map((video, index) => (
                      <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                          <div className="relative">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                              <Play className="h-12 w-12 text-primary" />
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">{video.duration}</Badge>
                            </div>
                            <div className="absolute top-2 left-2">
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{video.level}</Badge>
                            <Badge variant="outline">{video.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {video.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(video.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {video.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-muted-foreground">{video.views} vues</span>
                            <Button variant="outline" size="sm">
                              <Bookmark className="h-4 w-4 mr-1" />
                              Sauvegarder
                            </Button>
                          </div>
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
                ) : (
                  <div className="space-y-4">
                    {paginatedVideos.map((video, index) => (
                      <Card key={index} className="border-none shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                                <Play className="h-8 w-8 text-primary" />
                              </div>
                              <div className="absolute -top-1 -right-1">
                                <Badge variant="secondary" className="text-xs">{video.duration}</Badge>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {video.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                      <User className="h-4 w-4" />
                                      {video.author}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(video.date).toLocaleDateString('fr-FR')}
                                    </div>
                                    <span>{video.views} vues</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{video.level}</Badge>
                                    <Badge variant="outline">{video.category}</Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button variant="outline" size="sm">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                  <Button>
                                    <Play className="mr-2 h-4 w-4" />
                                    Regarder
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <section>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Afficher</span>
                      <Select defaultValue="12">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="36">36</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">par page</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} sur {totalPages}
                    </div>
                  </div>
                </section>
              )}

              {/* Playlists Section */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Playlists Thématiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {playlists.map((playlist, index) => (
                    <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer">
                      <CardHeader>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                          <Play className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-base">{playlist.title}</CardTitle>
                        <CardDescription>{playlist.count} vidéos</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          Voir la playlist
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Videos */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Vidéos Populaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularVideos.map((video, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary" />
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <Badge variant="secondary" className="text-xs">{video.duration}</Badge>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">{video.views} vues</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Videos */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Nouveautés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVideos.map((video, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary" />
                          </div>
                          <div className="absolute -top-1 -right-1">
                            <Badge variant="secondary" className="text-xs">{video.duration}</Badge>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">{new Date(video.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Favorites */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Mes Favoris
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connectez-vous pour sauvegarder vos vidéos préférées
                  </p>
                  <Button className="w-full" size="sm">
                    Se connecter
                  </Button>
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

export default AllVideos;
