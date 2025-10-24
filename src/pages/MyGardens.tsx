import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sprout, ListTodo, CalendarCheck, AlertTriangle, MapPin, Thermometer, Droplets, FlaskConical, Eye, Settings, BarChart3 } from "lucide-react";
import garden1 from "@/assets/garden-1.jpg";
import garden2 from "@/assets/garden-2.jpg";
import garden3 from "@/assets/garden-3.jpg";

const myGardens = [
  {
    id: 1,
    name: "Jardin du Balcon",
    location: "Paris 11ème",
    image: garden3,
    status: "active",
    iot: {
      temperature: 24,
      humidity: 68,
      ph: 6.5
    },
    tasks: [
      { title: "Arrosage tomates", time: "Aujourd'hui 18h" },
      { title: "Tailler basilic", time: "Demain" }
    ],
    harvests: [
      { crop: "Tomates cerises", date: "Dans 5 jours" },
      { crop: "Basilic", date: "Prêt" }
    ]
  },
  {
    id: 2,
    name: "Potager Communautaire",
    location: "Paris 20ème",
    image: garden1,
    status: "active",
    iot: {
      temperature: 22,
      humidity: 72,
      ph: 6.8
    },
    tasks: [
      { title: "Désherbage", time: "Samedi 10h" },
      { title: "Plantation salades", time: "Dimanche" }
    ],
    harvests: [
      { crop: "Courgettes", date: "Dans 3 jours" },
      { crop: "Radis", date: "Prêt" }
    ]
  },
  {
    id: 3,
    name: "Jardin sur Toit",
    location: "Paris 18ème",
    image: garden2,
    status: "warning",
    iot: {
      temperature: 28,
      humidity: 45,
      ph: 7.2
    },
    tasks: [
      { title: "Arrosage urgent", time: "Maintenant" },
      { title: "Vérifier capteurs", time: "Aujourd'hui" }
    ],
    harvests: [
      { crop: "Poivrons", date: "Dans 10 jours" },
      { crop: "Menthe", date: "Prêt" }
    ]
  }
];

const MyGardens = () => {
  const totalGardens = myGardens.length;
  const pendingTasks = myGardens.reduce((acc, garden) => acc + garden.tasks.length, 0);
  const readyHarvests = myGardens.filter(g => 
    g.harvests.some(h => h.date === "Prêt")
  ).length;
  const iotAlerts = myGardens.filter(g => g.status === "warning").length;

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-primary" : "bg-destructive";
  };

  const getIoTColor = (value: number, type: string) => {
    if (type === "humidity") {
      return value < 50 ? "text-destructive" : value > 80 ? "text-accent" : "text-primary";
    }
    if (type === "temperature") {
      return value > 26 ? "text-destructive" : "text-primary";
    }
    return "text-primary";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Titre et Actions */}
        <section className="container py-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Mes Jardins</h1>
              <p className="text-muted-foreground">Gérez et suivez tous vos potagers urbains en un seul endroit</p>
            </div>
            <Link to="/mes-jardins/ajouter">
              <Button size="lg" className="shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Ajouter un nouveau jardin
              </Button>
            </Link>
          </div>
        </section>

        {/* Statistiques Rapides */}
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Jardins</p>
                    <p className="text-3xl font-bold text-foreground">{totalGardens}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Sprout className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tâches en attente</p>
                    <p className="text-3xl font-bold text-foreground">{pendingTasks}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10">
                    <ListTodo className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Récoltes prêtes</p>
                    <p className="text-3xl font-bold text-foreground">{readyHarvests}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Alertes IoT</p>
                    <p className="text-3xl font-bold text-foreground">{iotAlerts}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Liste des Jardins */}
        <section className="container py-8 pb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Vos Jardins</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myGardens.map((garden) => (
              <Card key={garden.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image avec statut */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={garden.image} 
                    alt={garden.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getStatusColor(garden.status)} text-white`}>
                      {garden.status === "active" ? "Actif" : "Alerte"}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{garden.name}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{garden.location}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Données IoT */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Données IoT</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className={`h-4 w-4 ${getIoTColor(garden.iot.temperature, "temperature")}`} />
                        <span className="text-sm">{garden.iot.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className={`h-4 w-4 ${getIoTColor(garden.iot.humidity, "humidity")}`} />
                        <span className="text-sm">{garden.iot.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FlaskConical className={`h-4 w-4 ${getIoTColor(garden.iot.ph, "ph")}`} />
                        <span className="text-sm">pH {garden.iot.ph}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tâches */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Prochaines tâches</p>
                    <div className="space-y-1">
                      {garden.tasks.slice(0, 2).map((task, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <div>
                            <p className="text-foreground font-medium">{task.title}</p>
                            <p className="text-muted-foreground text-xs">{task.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Récoltes */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Prochaines récoltes</p>
                    <div className="space-y-1">
                      {garden.harvests.map((harvest, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{harvest.crop}</span>
                          <Badge variant={harvest.date === "Prêt" ? "default" : "secondary"} className="text-xs">
                            {harvest.date}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 border-t pt-4">
                  <Link to={`/mes-jardins/details/${garden.id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                  </Link>
                  <Link to={`/mes-jardins/editer/${garden.id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Stats
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* État vide (commenté pour montrer avec des données) */}
          {myGardens.length === 0 && (
            <Card className="border-dashed border-2 p-12 text-center">
              <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucun jardin pour le moment
              </h3>
              <p className="text-muted-foreground mb-6">
                Créez votre premier jardin pour commencer à cultiver et suivre vos plantations
              </p>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Créer mon premier jardin
              </Button>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyGardens;
