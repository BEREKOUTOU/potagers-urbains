import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Download,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Droplets,
  FlaskConical,
  Sprout,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Radar,
  FileText,
  MapPin
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gardens } from "@/data/gardens";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  Pie
} from "recharts";

const GardenStats = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Mock data for personal gardens
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
        light: 85
      }
    }
  ];

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

  // Mock data for charts
  const iotData = [
    { date: "2024-01-01", temperature: 18, humidity: 65, ph: 6.8 },
    { date: "2024-01-02", temperature: 19, humidity: 68, ph: 6.9 },
    { date: "2024-01-03", temperature: 17, humidity: 62, ph: 6.7 },
    { date: "2024-01-04", temperature: 20, humidity: 70, ph: 7.0 },
    { date: "2024-01-05", temperature: 18, humidity: 66, ph: 6.8 },
    { date: "2024-01-06", temperature: 21, humidity: 72, ph: 6.9 },
    { date: "2024-01-07", temperature: 19, humidity: 69, ph: 6.8 }
  ];

  const harvestData = [
    { month: "Jan", tomates: 45, laitues: 32, carottes: 28, radis: 15 },
    { month: "Fév", tomates: 52, laitues: 38, carottes: 35, radis: 18 },
    { month: "Mar", tomates: 48, laitues: 41, carottes: 30, radis: 22 },
    { month: "Avr", tomates: 61, laitues: 45, carottes: 38, radis: 25 }
  ];

  const taskData = [
    { name: "Terminées", value: 75, color: "#22c55e" },
    { name: "En cours", value: 15, color: "#3b82f6" },
    { name: "En retard", value: 10, color: "#ef4444" }
  ];

  const seasonalData = [
    { season: "Printemps", recoltes: 85, croissance: 90, maintenance: 75, eau: 80 },
    { season: "Été", recoltes: 95, croissance: 95, maintenance: 80, eau: 85 },
    { season: "Automne", recoltes: 70, croissance: 75, maintenance: 85, eau: 75 },
    { season: "Hiver", recoltes: 45, croissance: 50, maintenance: 90, eau: 65 }
  ];

  const recentHarvests = [
    { date: "2024-01-15", vegetable: "Tomates", quantity: 12, quality: "Excellente" },
    { date: "2024-01-14", vegetable: "Laitues", quantity: 8, quality: "Bonne" },
    { date: "2024-01-13", vegetable: "Carottes", quantity: 15, quality: "Excellente" },
    { date: "2024-01-12", vegetable: "Radis", quantity: 6, quality: "Bonne" }
  ];

  const recentTasks = [
    { task: "Arrosage tomates", status: "Terminée", duration: "15 min", success: 100 },
    { task: "Taille laitues", status: "En cours", duration: "25 min", success: 85 },
    { task: "Semis radis", status: "Terminée", duration: "10 min", success: 95 },
    { task: "Contrôle pH", status: "En retard", duration: "5 min", success: 0 }
  ];

  const alerts = [
    { date: "2024-01-15", type: "Température", severity: "Moyenne", message: "Température élevée détectée", action: "Ventilation activée", resolution: "15 min" },
    { date: "2024-01-14", type: "Humidité", severity: "Faible", message: "Niveau d'humidité bas", action: "Arrosage automatique", resolution: "10 min" },
    { date: "2024-01-13", type: "pH", severity: "Élevée", message: "pH du sol déséquilibré", action: "Ajustement en cours", resolution: "En attente" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header with Navigation */}
      <section className="bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/mes-jardins")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes jardins
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">Statistiques</span>
            </div>
          </div>
        </div>
      </section>

      {/* Title and Garden Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{garden.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-5 w-5" />
              {garden.location}
            </div>

            {/* IoT Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="flex items-center p-6">
                  <Thermometer className="h-12 w-12 text-red-500 mr-4" />
                  <div>
                    <p className="text-red-500 text-3xl font-bold">19°C</p>
                    <p className="text-sm text-muted-foreground">Température actuelle</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <Droplets className="h-12 w-12 text-blue-500 mr-4" />
                  <div>
                    <p className="text-blue-500 text-3xl font-bold">68%</p>
                    <p className="text-sm text-muted-foreground">Humidité du sol</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <FlaskConical className="h-12 w-12 text-green-500 mr-4" />
                  <div>
                    <p className="text-green-500 text-3xl font-bold">6.8</p>
                    <p className="text-sm text-muted-foreground">pH du sol</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Time Filters */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="1m">1 mois</SelectItem>
                    <SelectItem value="3m">3 mois</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Date personnalisée
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={{ from: startDate, to: endDate }}
                      onSelect={(range) => {
                        setStartDate(range?.from);
                        setEndDate(range?.to);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter les données
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Metrics */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Métriques principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">247</p>
                      <p className="text-sm text-muted-foreground">Récoltes totales</p>
                    </div>
                    <Sprout className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+12%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">85%</p>
                      <p className="text-sm text-muted-foreground">Rendement moyen</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-sm text-muted-foreground">Tâches réussies</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">88</p>
                      <p className="text-sm text-muted-foreground">Score santé</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">-2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* IoT Evolution Charts */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Évolution des données IoT</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    Température
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={iotData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Humidité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={iotData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-green-500" />
                    pH du sol
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={iotData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="ph" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Harvest History */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Historique des récoltes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Récoltes par mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={harvestData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tomates" fill="#ef4444" />
                      <Bar dataKey="laitues" fill="#22c55e" />
                      <Bar dataKey="carottes" fill="#f59e0b" />
                      <Bar dataKey="radis" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Récoltes récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Légume</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Qualité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentHarvests.map((harvest, index) => (
                        <TableRow key={index}>
                          <TableCell>{harvest.date}</TableCell>
                          <TableCell>{harvest.vegetable}</TableCell>
                          <TableCell>{harvest.quantity} kg</TableCell>
                          <TableCell>
                            <Badge variant={harvest.quality === "Excellente" ? "default" : "secondary"}>
                              {harvest.quality}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Task Performance */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Performance des tâches</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des tâches</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={taskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {taskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {taskData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tâches récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tâche</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Réussite</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTasks.map((task, index) => (
                        <TableRow key={index}>
                          <TableCell>{task.task}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.status === "Terminée" ? "default" :
                                task.status === "En cours" ? "secondary" : "destructive"
                              }
                            >
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{task.duration}</TableCell>
                          <TableCell>{task.success}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Trends */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Tendances saisonnières</h2>
            <Card>
              <CardHeader>
                <CardTitle>Performance par saison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={seasonalData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="season" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <RechartsRadar name="Récoltes" dataKey="recoltes" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                    <RechartsRadar name="Croissance" dataKey="croissance" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                    <RechartsRadar name="Maintenance" dataKey="maintenance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <RechartsRadar name="Consommation d'eau" dataKey="eau" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Predictions and Recommendations */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Prédictions et recommandations</h2>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Arrosage recommandé:</strong> Les capteurs indiquent un niveau d'humidité en baisse.
                  Arrosage automatique programmé pour demain matin.
                </AlertDescription>
              </Alert>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Prédiction de récolte:</strong> Basé sur les tendances actuelles, prévision de +15%
                  de tomates pour le mois prochain.
                </AlertDescription>
              </Alert>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Alerte météo:</strong> Pluie prévue dans 2 jours. Couvrir les jeunes pousses.
                </AlertDescription>
              </Alert>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Optimisation suggérée:</strong> Ajuster le pH du sol avec du compost organique
                  pour améliorer la croissance des laitues.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* IoT Alerts History */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Historique des alertes IoT</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Gravité</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Action prise</TableHead>
                      <TableHead>Résolution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert, index) => (
                      <TableRow key={index}>
                        <TableCell>{alert.date}</TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              alert.severity === "Élevée" ? "destructive" :
                              alert.severity === "Moyenne" ? "default" : "secondary"
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>{alert.action}</TableCell>
                        <TableCell>{alert.resolution}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GardenStats;
