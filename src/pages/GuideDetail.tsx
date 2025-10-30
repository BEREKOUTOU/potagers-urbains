import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import BackToTop from "@/components/BackToTop";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Download,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Leaf,
  Sun,
  Droplets,
  Scissors,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Eye,
  FileText,
  Video,
  Image as ImageIcon,
  Users,
  Award
} from "lucide-react";

// Données du guide détaillé
const guideData = {
  title: "Débuter son potager urbain",
  description: "Guide complet pour créer votre premier jardin en ville",
  duration: "15 min",
  difficulty: "Débutant",
  author: "Marie Dubois",
  publishedDate: "15 décembre 2024",
  downloads: 1250,
  coverImage: "/assets/img.jpg",
  chapters: [
    { id: "introduction", title: "Introduction", icon: BookOpen },
    { id: "emplacement", title: "Choisir l'emplacement", icon: Sun },
    { id: "materiel", title: "Matériel nécessaire", icon: Scissors },
    { id: "contenants", title: "Préparation des contenants", icon: Leaf },
    { id: "selection", title: "Sélection des plantes", icon: Leaf },
    { id: "plantation", title: "Plantation et soins", icon: Droplets },
    { id: "arrosage", title: "Arrosage et fertilisation", icon: Droplets },
    { id: "problemes", title: "Résolution des problèmes", icon: AlertTriangle }
  ]
};

const GuideDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState("introduction");

  // Calcul de la progression de lecture
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation par chapitres
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    guideData.chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (chapterId: string) => {
    const element = document.getElementById(chapterId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Barre de progression fixe */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      <main className="flex-1 pt-1">
        {/* En-tête avec bouton retour */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 py-8">
          <div className="container">
            <Button
              variant="ghost"
              onClick={() => navigate('/ressources')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux guides
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image de couverture */}
              <div className="lg:col-span-1">
                <img
                  src={guideData.coverImage}
                  alt={guideData.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Informations du guide */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {guideData.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {guideData.description}
                </p>

                {/* Métadonnées */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{guideData.duration}</p>
                      <p className="text-xs text-muted-foreground">Temps de lecture</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{guideData.difficulty}</p>
                      <p className="text-xs text-muted-foreground">Difficulté</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{guideData.downloads}</p>
                      <p className="text-xs text-muted-foreground">Téléchargements</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{guideData.publishedDate}</p>
                      <p className="text-xs text-muted-foreground">Publication</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Par {guideData.author}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation par chapitres - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Sommaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {guideData.chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => scrollToChapter(chapter.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            activeChapter === chapter.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <chapter.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{chapter.title}</span>
                          </div>
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-12">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Introduction</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    Le jardinage urbain est une activité enrichissante qui permet de cultiver ses propres légumes,
                    herbes aromatiques et fleurs même en milieu urbain. Ce guide vous accompagnera pas à pas
                    dans la création de votre premier potager urbain, adapté aux contraintes de l'espace citadin.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700">
                          <strong>Conseil d'expert :</strong> Même avec un petit balcon ou une fenêtre ensoleillée,
                          vous pouvez créer un potager productif et esthétique.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Dans ce guide, nous aborderons tous les aspects essentiels : du choix de l'emplacement
                    à la récolte de vos premières productions. Chaque étape est expliquée de manière détaillée
                    avec des conseils pratiques et des astuces éprouvées.
                  </p>
                </div>
              </section>

              {/* Choisir l'emplacement */}
              <section id="emplacement" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Choisir l'emplacement</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    L'emplacement est crucial pour la réussite de votre potager urbain. Les plantes ont besoin
                    de lumière, d'air et d'un minimum d'espace pour se développer harmonieusement.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <img src="/assets/img0.jpg" alt="Balcon ensoleillé" className="w-full h-48 object-cover rounded-lg" />
                    <img src="/assets/img1.jpg" alt="Jardin sur toit" className="w-full h-48 object-cover rounded-lg" />
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Critères essentiels</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <Sun className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Exposition au soleil :</strong> Minimum 6 heures de soleil direct par jour.
                        Orientez-vous sud, sud-est ou sud-ouest.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Visibilité :</strong> Choisissez un endroit où vous pourrez surveiller
                        régulièrement vos plantes.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Accessibilité :</strong> L'emplacement doit être facilement accessible
                        pour l'arrosage et l'entretien.
                      </div>
                    </li>
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-yellow-700">
                          <strong>Attention :</strong> Évitez les zones exposées aux vents forts qui peuvent
                          dessécher les plantes ou casser les tiges.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Matériel nécessaire */}
              <section id="materiel" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Matériel nécessaire</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    Pour débuter votre potager urbain, vous n'avez pas besoin d'un équipement coûteux.
                    Voici le matériel de base recommandé pour bien commencer.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <img src="/assets/Grelinette.jpg" alt="Grelinette" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <CardTitle className="text-base">Grelinette</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Outil essentiel pour travailler la terre</p>
                        <Badge variant="outline">25-40€</Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <img src="/assets/Arrosoir.jpg" alt="Arrosoir" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <CardTitle className="text-base">Arrosoir 10L</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Pour un arrosage précis et contrôlé</p>
                        <Badge variant="outline">15-25€</Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <img src="/assets/Gants_de_jardinage.jpg" alt="Gants de jardinage" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <CardTitle className="text-base">Gants de jardinage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Protection indispensable</p>
                        <Badge variant="outline">8-15€</Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Matériel complémentaire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Contenants</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Pots en terre cuite ou plastique</li>
                        <li>• Bacs potagers surélevés</li>
                        <li>• Systèmes verticaux pour optimiser l'espace</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Terre et amendements</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Terreau potager de qualité</li>
                        <li>• Compost ou engrais organique</li>
                        <li>• Drainage (graviers, billes d'argile)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Préparation des contenants */}
              <section id="contenants" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Préparation des contenants</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    La préparation des contenants est une étape cruciale qui influence directement
                    la santé et la productivité de vos plantes.
                  </p>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-700">
                          <strong>À retenir :</strong> Un bon drainage est essentiel pour éviter
                          le pourrissement des racines.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Étapes de préparation</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Nettoyez les contenants</h4>
                        <p className="text-sm text-muted-foreground">
                          Désinfectez avec une solution d'eau de Javel diluée (1/10) pour éliminer
                          bactéries et champignons.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Installez le drainage</h4>
                        <p className="text-sm text-muted-foreground">
                          Placez une couche de 3-5 cm de graviers ou billes d'argile au fond
                          pour assurer l'écoulement de l'eau.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Remplissez de terreau</h4>
                        <p className="text-sm text-muted-foreground">
                          Utilisez un terreau spécifique pour légumes, riche et bien drainé.
                          Laissez 3-5 cm en haut pour l'arrosage.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img src="/assets/Bac_potager_80x40cm.jpg" alt="Bac potager préparé" className="w-full h-48 object-cover rounded-lg" />
                    <img src="/assets/Pots_en_terre_cuite.jpg" alt="Pots préparés" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                </div>
              </section>

              {/* Sélection des plantes */}
              <section id="selection" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Sélection des plantes</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    Choisissez des plantes adaptées à la culture en contenants et à votre niveau de débutant.
                    Privilégiez les légumes faciles à cultiver et productifs.
                  </p>

                  <h3 className="text-xl font-semibold mb-4">Légumes recommandés pour débutants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <img src="/assets/tomate.jpg" alt="Tomates" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <CardTitle className="text-base">Tomates</CardTitle>
                        <Badge variant="outline">Intermédiaire</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Riches en saveurs, nécessitent tuteurage et taille régulière.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <img src="/assets/radis.jpg" alt="Radis" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <CardTitle className="text-base">Radis</CardTitle>
                        <Badge variant="outline">Facile</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Récolte rapide (3-4 semaines), parfaite pour débuter.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <img src="/assets/basilic.jpg" alt="Basilic" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <CardTitle className="text-base">Basilic</CardTitle>
                        <Badge variant="outline">Très facile</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Herbe aromatique productive, culture en intérieur possible.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700">
                          <strong>Astuce :</strong> Commencez par 3-4 variétés maximum pour ne pas vous disperser.
                          Vous pourrez diversifier par la suite.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Plantation et soins */}
              <section id="plantation" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Plantation et soins</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    Une fois vos contenants préparés et vos plantes sélectionnées, il est temps de procéder
                    à la plantation. Cette étape demande de la délicatesse pour ne pas abîmer les jeunes plants.
                  </p>

                  <h3 className="text-xl font-semibold mb-4">Technique de plantation</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Creusez le trou</h4>
                        <p className="text-sm text-muted-foreground">
                          Faites un trou deux fois plus large que la motte et aussi profond.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Démottez délicatement</h4>
                        <p className="text-sm text-muted-foreground">
                          Sortez la plante de son pot en maintenant la base de la tige.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Placez et tassez</h4>
                        <p className="text-sm text-muted-foreground">
                          Positionnez la plante au niveau du sol et tassez légèrement autour.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <img src="/assets/garden-1.jpg" alt="Plantation de jeunes plants" className="w-full h-48 object-cover rounded-lg" />
                    <img src="/assets/garden-2.jpg" alt="Plants fraîchement plantés" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                </div>
              </section>

              {/* Arrosage et fertilisation */}
              <section id="arrosage" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Arrosage et fertilisation</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    L'arrosage est l'entretien le plus important de votre potager urbain. Les plantes en contenants
                    sèchent plus rapidement que celles en pleine terre.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700">
                          <strong>Fréquence d'arrosage :</strong> Vérifiez quotidiennement en enfonçant le doigt
                          dans la terre sur 2-3 cm. Arrosez si c'est sec.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Techniques d'arrosage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3">Arrosage manuel</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Utilisez un arrosage au pied pour éviter de mouiller les feuilles</li>
                        <li>• Arrosez abondamment mais moins fréquemment</li>
                        <li>• Préférez l'eau à température ambiante</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Systèmes automatiques</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Arrosage goutte à goutte pour un arrosage précis</li>
                        <li>• Programmateur pour les absences prolongées</li>
                        <li>• Capteurs d'humidité pour l'optimisation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <img src="/assets/Arrosage_goutte_goutte.jpg" alt="Système goutte à goutte" className="w-full h-32 object-cover rounded-lg" />
                    <img src="/assets/Programmateur_automatique.jpg" alt="Programmateur automatique" className="w-full h-32 object-cover rounded-lg" />
                    <img src="/assets/capteur-d-humidite-du-sol.webp" alt="Capteur d'humidité" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                </div>
              </section>

              {/* Résolution des problèmes */}
              <section id="problemes" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6">Résolution des problèmes</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-6">
                    Même les jardiniers expérimentés rencontrent des problèmes. L'important est de les identifier
                    rapidement et d'agir efficacement.
                  </p>

                  <h3 className="text-xl font-semibold mb-4">Problèmes courants et solutions</h3>
                  <div className="space-y-6 mb-6">
                    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Feuilles jaunes</h4>
                      <p className="text-sm text-yellow-700 mb-2">
                        <strong>Cause :</strong> Manque d'eau ou excès d'arrosage, carence en nutriments.
                      </p>
                      <p className="text-sm text-yellow-700">
                        <strong>Solution :</strong> Régulez l'arrosage et ajoutez de l'engrais équilibré.
                      </p>
                    </div>

                    <div className="border-l-4 border-red-400 bg-red-50 p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Pucerons</h4>
                      <p className="text-sm text-red-700 mb-2">
                        <strong>Cause :</strong> Insectes parasites attirés par les jeunes pousses tendres.
                      </p>
                      <p className="text-sm text-red-700">
                        <strong>Solution :</strong> Lavez les plantes à l'eau savonneuse ou utilisez des huiles essentielles.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-400 bg-orange-50 p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">Moisissure</h4>
                      <p className="text-sm text-orange-700 mb-2">
                        <strong>Cause :</strong> Humidité excessive et manque de circulation d'air.
                      </p>
                      <p className="text-sm text-orange-700">
                        <strong>Solution :</strong> Éclaircissez les plantes et améliorez la ventilation.
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-700">
                          <strong>Prévention :</strong> Inspectez régulièrement vos plantes et agissez dès
                          les premiers signes de problème.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar avec actions rapides */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Actions rapides */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Ajouter aux favoris
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Partager
                    </Button>
                  </CardContent>
                </Card>

                {/* Ressources connexes */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Ressources connexes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Calendrier de plantation</p>
                          <p className="text-xs text-muted-foreground">Guide PDF</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <Video className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Vidéo d'introduction</p>
                          <p className="text-xs text-muted-foreground">Tutoriel vidéo</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Fiche technique tomates</p>
                          <p className="text-xs text-muted-foreground">Fiche plante</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Guides similaires */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Guides similaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Compostage en appartement</p>
                          <p className="text-xs text-muted-foreground">Guide complet • 12 min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <Leaf className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Plantes aromatiques faciles</p>
                          <p className="text-xs text-muted-foreground">Guide débutant • 8 min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <Sun className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Jardinage d'intérieur</p>
                          <p className="text-xs text-muted-foreground">Guide intermédiaire • 18 min</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default GuideDetail;
