import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  Edit,
  Share2,
  Bell,
  Thermometer,
  Droplets,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Plus,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  Camera,
  FileText,
  Settings,
  BarChart3,
  AlertTriangle,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Search,
  Tag,
  Download,
  Upload,
  Zap
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

// Mock data for personal garden details
const personalGardens = [
  {
    id: 1,
    name: "Mon Potager Balcon",
    location: "Paris 11ème",
    image: "/assets/Jardin_Balcon.jpg",
    status: "active",
    description: "Mon petit jardin urbain sur le balcon avec tomates, basilic et herbes aromatiques.",
    createdDate: "2023-03-15",
    area: "8 m²",
    soilType: "Terreau universel",
    iot: {
      temperature: 24,
      humidity: 68,
      ph: 6.5,
      light: 85,
      history: {
        temperature: [22, 23, 24, 25, 24, 23, 24],
        humidity: [65, 67, 68, 70, 68, 66, 68],
        ph: [6.3, 6.4, 6.5, 6.6, 6.5, 6.4, 6.5],
        timestamps: ["08h", "10h", "12h", "14h", "16h", "18h", "20h"]
      }
    },
    tasks: [
      { id: 1, title: "Arrosage tomates", priority: "high", status: "pending", dueDate: "2024-01-15", category: "arrosage" },
      { id: 2, title: "Tailler basilic", priority: "medium", status: "pending", dueDate: "2024-01-16", category: "maintenance" },
      { id: 3, title: "Fertiliser les plantes", priority: "low", status: "completed", dueDate: "2024-01-10", category: "maintenance" }
    ],
    harvests: [
      { id: 1, crop: "Tomates cerises", date: "2024-01-20", status: "planned", quantity: "2 kg" },
      { id: 2, crop: "Basilic", date: "2024-01-18", status: "ready", quantity: "500g" },
      { id: 3, crop: "Persil", date: "2024-01-25", status: "planned", quantity: "300g" }
    ],
    photos: [
      { id: 1, url: "/assets/Jardin_Balcon.jpg", date: "2024-01-10", tags: ["croissance", "tomates"] },
      { id: 2, url: "/assets/Jardin_Balcon2.jpg", date: "2024-01-08", tags: ["arrosage", "basilic"] },
      { id: 3, url: "/assets/Jardin-Balcon2.jpg", date: "2024-01-05", tags: ["récolte", "herbes"] }
    ],
    notes: [
      { id: 1, date: "2024-01-12", content: "Les tomates poussent bien, beaucoup de fleurs.", tags: ["observation", "tomates"] },
      { id: 2, date: "2024-01-10", content: "Arrosage automatique activé, humidité stable.", tags: ["maintenance", "iot"] },
      { id: 3, date: "2024-01-08", content: "Nouveau compost ajouté, plantes plus vigoureuses.", tags: ["fertilisant", "croissance"] }
    ],
    alerts: [
      { id: 1, type: "temperature", condition: "above", value: 28, enabled: true },
      { id: 2, type: "humidity", condition: "below", value: 50, enabled: true },
      { id: 3, type: "task", condition: "overdue", value: 1, enabled: true }
    ],
    stats: {
      totalHarvests: 12,
      averageYield: 2.5,
      tasksCompleted: 45,
      timeSpent: 120,
      healthScore: 85
    }
  }
];

const PersonalGardenDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTask, setNewTask] = useState({ title: "", priority: "medium", category: "maintenance" });
  const [newNote, setNewNote] = useState({ content: "", tags: "" });

  const garden = personalGardens.find(g => g.id === parseInt(id || "0"));

  if (!garden) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Jardin non trouvé</h1>
          <Button onClick={() => navigate("/mes-jardins")}>
            Retour à mes jardins
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getIoTColor = (value: number, type: string) => {
    if (type === "humidity") {
      return value < 50 ? "text-destructive" : value > 80 ? "text-blue-500" : "text-green-500";
    }
    if (type === "temperature") {
      return value > 26 ? "text-destructive" : value < 18 ? "text-blue-500" : "text-green-500";
    }
    if (type === "ph") {
      return value < 6 || value > 7.5 ? "text-destructive" : "text-green-500";
    }
    return "text-green-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const addTask = () => {
    // Mock add task functionality
    console.log("Adding task:", newTask);
    setNewTask({ title: "", priority: "medium", category: "maintenance" });
  };

  const addNote = () => {
    // Mock add note functionality
    console.log("Adding note:", newNote);
    setNewNote({ content: "", tags: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/mes-jardins">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à mes jardins
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{garden.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xl">{garden.location}</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {garden.status === "active" ? "Actif" : "Alerte"}
                  </Badge>
                  <span className="text-lg">{garden.area}</span>
                </div>
                <p className="text-lg opacity-90 mb-6">{garden.description}</p>
                <div className="flex gap-4">
                  <Button size="lg" variant="secondary">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-green-800 hover:bg-white hover:text-green-800">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-green-800 hover:bg-white hover:text-green-800">
                    <Bell className="h-4 w-4 mr-2" />
                    Alertes
                  </Button>
                </div>
              </div>
              <div className="lg:pl-8">
                <div className="relative">
                  <img
                    src={garden.image}
                    alt={garden.name}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
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
            <Tabs defaultValue="iot" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="iot">IoT</TabsTrigger>
                <TabsTrigger value="tasks">Tâches</TabsTrigger>
                <TabsTrigger value="harvests">Récoltes</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
                <TabsTrigger value="alerts">Alertes</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              {/* IoT Dashboard */}
              <TabsContent value="iot" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Real-time IoT Data */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Données IoT en Temps Réel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Thermometer className={`h-8 w-8 ${getIoTColor(garden.iot.temperature, "temperature")}`} />
                            <div>
                              <p className="text-sm text-muted-foreground">Température</p>
                              <p className="text-2xl font-bold">{garden.iot.temperature}°C</p>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Droplets className={`h-8 w-8 ${getIoTColor(garden.iot.humidity, "humidity")}`} />
                            <div>
                              <p className="text-sm text-muted-foreground">Humidité</p>
                              <p className="text-2xl font-bold">{garden.iot.humidity}%</p>
                            </div>
                          </div>
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FlaskConical className={`h-8 w-8 ${getIoTColor(garden.iot.ph, "ph")}`} />
                            <div>
                              <p className="text-sm text-muted-foreground">pH du sol</p>
                              <p className="text-2xl font-bold">{garden.iot.ph}</p>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Zap className="h-8 w-8 text-yellow-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Lumière</p>
                              <p className="text-2xl font-bold">{garden.iot.light}%</p>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 24h History */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Historique 24h</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Température</span>
                            <span>{garden.iot.temperature}°C</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Humidité</span>
                            <span>{garden.iot.humidity}%</span>
                          </div>
                          <Progress value={68} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>pH</span>
                            <span>{garden.iot.ph}</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Historical Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Graphiques Historiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="7days">
                      <TabsList>
                        <TabsTrigger value="7days">7 jours</TabsTrigger>
                        <TabsTrigger value="30days">30 jours</TabsTrigger>
                        <TabsTrigger value="3months">3 mois</TabsTrigger>
                      </TabsList>
                      <TabsContent value="7days" className="mt-4">
                        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Graphique température - 7 jours</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="30days" className="mt-4">
                        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Graphique humidité - 30 jours</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="3months" className="mt-4">
                        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Graphique pH - 3 mois</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Task Management */}
              <TabsContent value="tasks" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Gestion des Tâches</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une tâche
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nouvelle tâche</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Titre de la tâche"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                        <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Faible</SelectItem>
                            <SelectItem value="medium">Moyenne</SelectItem>
                            <SelectItem value="high">Élevée</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arrosage">Arrosage</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="recolte">Récolte</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={addTask} className="w-full">Ajouter</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {garden.tasks.map((task) => (
                    <Card key={task.id} className={`border-l-4 ${task.status === 'completed' ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                            {task.status === 'completed' ? 'Terminée' : 'En attente'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Clock className="h-4 w-4" />
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            Priorité: {task.priority}
                          </span>
                          <Badge variant="outline">{task.category}</Badge>
                        </div>
                        {task.status !== 'completed' && (
                          <Button size="sm" className="mt-2 w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer comme terminée
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Harvest Calendar */}
              <TabsContent value="harvests" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendrier des Récoltes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Récoltes Planifiées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {garden.harvests.map((harvest) => (
                          <div key={harvest.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-semibold">{harvest.crop}</h4>
                              <p className="text-sm text-muted-foreground">{harvest.date}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={harvest.status === 'ready' ? 'default' : 'secondary'}>
                                {harvest.status === 'ready' ? 'Prêt' : 'Planifié'}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">{harvest.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Photo Gallery */}
              <TabsContent value="photos" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Galerie Photos</h2>
                  <Button>
                    <Camera className="h-4 w-4 mr-2" />
                    Ajouter une photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {garden.photos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <div className="h-48">
                        <img
                          src={photo.url}
                          alt="Garden photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">{photo.date}</p>
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Notes and Journal */}
              <TabsContent value="notes" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Notes et Journal</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nouvelle note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Contenu de la note"
                          value={newNote.content}
                          onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                        />
                        <Input
                          placeholder="Tags (séparés par des virgules)"
                          value={newNote.tags}
                          onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                        />
                        <Button onClick={addNote} className="w-full">Ajouter</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {garden.notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-muted-foreground">{note.date}</p>
                          <div className="flex gap-1">
                            {note.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p>{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="settings" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres Avancés</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Seuils des Capteurs IoT</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Température max (°C)</label>
                          <Input type="number" defaultValue="28" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Humidité min (%)</label>
                          <Input type="number" defaultValue="50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">pH optimal</label>
                          <Input type="number" step="0.1" defaultValue="6.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Planification d'Arrosage Automatique</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="auto-watering" />
                          <label htmlFor="auto-watering">Activer l'arrosage automatique</label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Fréquence (jours)</label>
                            <Input type="number" defaultValue="2" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Durée (minutes)</label>
                            <Input type="number" defaultValue="15" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Alert Configuration */}
              <TabsContent value="alerts" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration des Alertes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {garden.alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <div>
                            <p className="font-medium capitalize">{alert.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.condition} {alert.value}
                            </p>
                          </div>
                        </div>
                        <Checkbox checked={alert.enabled} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Statistics and Analytics */}
              <TabsContent value="stats" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Récoltes</p>
                          <p className="text-3xl font-bold">{garden.stats.totalHarvests}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Rendement Moyen</p>
                          <p className="text-3xl font-bold">{garden.stats.averageYield}kg</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tâches Terminées</p>
                          <p className="text-3xl font-bold">{garden.stats.tasksCompleted}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Score Santé</p>
                          <p className="text-3xl font-bold">{garden.stats.healthScore}%</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button size="lg" className="rounded-full shadow-lg">
          <Camera className="h-5 w-5" />
        </Button>
        <Button size="lg" className="rounded-full shadow-lg">
          <FileText className="h-5 w-5" />
        </Button>
        <Button size="lg" className="rounded-full shadow-lg">
          <CheckCircle className="h-5 w-5" />
        </Button>
        <Button size="lg" className="rounded-full shadow-lg">
          <Droplets className="h-5 w-5" />
        </Button>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default PersonalGardenDetails;
