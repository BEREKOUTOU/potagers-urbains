import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  MapPin,
  Thermometer,
  Droplets,
  FlaskConical,
  Eye,
  Upload,
  Palette,
  Bell,
  CheckCircle,
  Save,
  X
} from "lucide-react";

// Garden type options
const gardenTypes = [
  {
    id: "balcony",
    name: "Balcon",
    icon: "🏠",
    description: "Espace limité sur balcon ou fenêtre"
  },
  {
    id: "terrace",
    name: "Terrasse",
    icon: "🏡",
    description: "Grande surface en extérieur"
  },
  {
    id: "shared",
    name: "Parcelle partagée",
    icon: "🌱",
    description: "Terrain communautaire ou partagé"
  }
];

// IoT sensors configuration
const iotSensors = [
  {
    id: "temperature",
    name: "Température",
    icon: Thermometer,
    unit: "°C",
    min: 0,
    max: 50,
    defaultMin: 15,
    defaultMax: 30,
    benefit: "Surveille les conditions optimales de croissance"
  },
  {
    id: "humidity",
    name: "Humidité",
    icon: Droplets,
    unit: "%",
    min: 0,
    max: 100,
    defaultMin: 40,
    defaultMax: 80,
    benefit: "Prévient le dessèchement ou l'excès d'eau"
  },
  {
    id: "ph",
    name: "pH du sol",
    icon: FlaskConical,
    unit: "",
    min: 0,
    max: 14,
    defaultMin: 5.5,
    defaultMax: 7.5,
    benefit: "Optimise l'absorption des nutriments"
  },
  {
    id: "light",
    name: "Luminosité",
    icon: Eye,
    unit: "lux",
    min: 0,
    max: 100000,
    defaultMin: 10000,
    defaultMax: 50000,
    benefit: "Assure un éclairage adapté aux plantes"
  }
];

// Theme colors
const themeColors = [
  { name: "Vert Nature", value: "#22c55e" },
  { name: "Bleu Calme", value: "#3b82f6" },
  { name: "Violet Créatif", value: "#8b5cf6" },
  { name: "Orange Énergique", value: "#f97316" },
  { name: "Rose Doux", value: "#ec4899" }
];

// Gallery images (placeholder - would be actual images)
const galleryImages = [
  "/assets/garden-1.jpg",
  "/assets/garden-2.jpg",
  "/assets/garden-3.jpg",
  "/assets/hero-garden.jpg",
  "/assets/workshop.jpg"
];

const AddNewGarden = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    location: "",
    gardenType: "",
    // IoT Config
    sensors: {
      temperature: { enabled: false, min: 15, max: 30 },
      humidity: { enabled: false, min: 40, max: 80 },
      ph: { enabled: false, min: 5.5, max: 7.5 },
      light: { enabled: false, min: 10000, max: 50000 }
    },
    // Personalization
    coverImage: galleryImages[0],
    themeColor: themeColors[0].value,
    notifications: {
      email: true,
      push: true,
      frequency: "daily"
    }
  });

  const [locationLoading, setLocationLoading] = useState(false);

  // Get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode this
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
        }
      );
    }
  };

  // Update form data
  const updateFormData = (section: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && prev[section] !== null
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  // Handle sensor toggle
  const toggleSensor = (sensorId: string) => {
    const sensor = iotSensors.find(s => s.id === sensorId);
    if (!sensor) return;

    setFormData(prev => ({
      ...prev,
      sensors: {
        ...prev.sensors,
        [sensorId]: {
          ...prev.sensors[sensorId],
          enabled: !prev.sensors[sensorId].enabled,
          min: prev.sensors[sensorId].enabled ? sensor.defaultMin : prev.sensors[sensorId].min,
          max: prev.sensors[sensorId].enabled ? sensor.defaultMax : prev.sensors[sensorId].max
        }
      }
    }));
  };

  // Handle sensor threshold change
  const updateSensorThreshold = (sensorId: string, type: 'min' | 'max', value: number[]) => {
    setFormData(prev => ({
      ...prev,
      sensors: {
        ...prev.sensors,
        [sensorId]: {
          ...prev.sensors[sensorId],
          [type]: value[0]
        }
      }
    }));
  };

  // Calculate progress
  const getProgress = () => {
    const steps = [
      formData.name && formData.location && formData.gardenType, // Step 1
      Object.values(formData.sensors).some(s => s.enabled), // Step 2
      formData.coverImage && formData.themeColor // Step 3
    ];
    return (steps.filter(Boolean).length / 3) * 100;
  };

  // Check if form is valid for current step
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.location && formData.gardenType;
      case 2:
        return true; // IoT is optional
      case 3:
        return formData.coverImage && formData.themeColor;
      default:
        return false;
    }
  };

  // Handle next step
  const nextStep = () => {
    if (isStepValid(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle save as draft
  const saveAsDraft = () => {
    // In a real app, save to localStorage or API
    localStorage.setItem('gardenDraft', JSON.stringify(formData));
    alert('Brouillon sauvegardé !');
  };

  // Handle create garden
  const createGarden = () => {
    if (isStepValid(3)) {
      // In a real app, send to API
      console.log('Creating garden:', formData);
      navigate('/mes-jardins');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <section className="container py-4 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/mes-jardins">Mes Jardins</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Ajouter un nouveau jardin</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>

        {/* Title and Progress */}
        <section className="container py-8 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter un nouveau jardin</h1>
              <p className="text-muted-foreground mb-4">
                Créez votre jardin urbain personnalisé en quelques étapes simples
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <Progress value={getProgress()} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Étape {currentStep} sur 3
                </span>
              </div>
            </div>

            {/* Real-time Preview */}
            <Card className="w-full lg:w-80 border-2 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Aperçu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="h-32 rounded-lg bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${formData.coverImage})` }}
                >
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-semibold text-sm">
                      {formData.name || "Nom du jardin"}
                    </h3>
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {formData.location || "Localisation"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="secondary">
                    {gardenTypes.find(t => t.id === formData.gardenType)?.name || "Non défini"}
                  </Badge>
                </div>

                {Object.values(formData.sensors).some(s => s.enabled) && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Capteurs IoT:</span>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(formData.sensors).map(([id, sensor]) => {
                        if (!sensor.enabled) return null;
                        const sensorInfo = iotSensors.find(s => s.id === id);
                        if (!sensorInfo) return null;
                        const Icon = sensorInfo.icon;
                        return (
                          <Badge key={id} variant="outline" className="text-xs">
                            <Icon className="h-3 w-3 mr-1" />
                            {sensorInfo.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Steps */}
        <section className="container py-8">
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    Informations de base
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Garden Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du jardin *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Mon balcon fleuri"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', '', e.target.value)}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="Ex: Paris 11ème"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', '', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {locationLoading ? "Chargement..." : "Auto"}
                      </Button>
                    </div>
                  </div>

                  {/* Garden Type */}
                  <div className="space-y-3">
                    <Label>Type de jardin *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {gardenTypes.map((type) => (
                        <Card
                          key={type.id}
                          className={`cursor-pointer transition-all ${
                            formData.gardenType === type.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => updateFormData('gardenType', '', type.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <h3 className="font-semibold mb-1">{type.name}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: IoT Configuration */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    Configuration des capteurs IoT
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Activez et configurez les capteurs pour surveiller votre jardin automatiquement
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {iotSensors.map((sensor) => {
                    const Icon = sensor.icon;
                    const sensorData = formData.sensors[sensor.id];
                    return (
                      <div key={sensor.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-semibold">{sensor.name}</h3>
                              <p className="text-sm text-muted-foreground">{sensor.benefit}</p>
                            </div>
                          </div>
                          <Switch
                            checked={sensorData.enabled}
                            onCheckedChange={() => toggleSensor(sensor.id)}
                          />
                        </div>

                        {sensorData.enabled && (
                          <div className="space-y-4 pl-8">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm">Seuil minimum ({sensor.unit})</Label>
                                <div className="mt-2">
                                  <Slider
                                    value={[sensorData.min]}
                                    onValueChange={(value) => updateSensorThreshold(sensor.id, 'min', value)}
                                    min={sensor.min}
                                    max={sensor.max}
                                    step={sensor.id === 'ph' ? 0.1 : 1}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{sensor.min}{sensor.unit}</span>
                                    <span className="font-semibold">{sensorData.min}{sensor.unit}</span>
                                    <span>{sensor.max}{sensor.unit}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm">Seuil maximum ({sensor.unit})</Label>
                                <div className="mt-2">
                                  <Slider
                                    value={[sensorData.max]}
                                    onValueChange={(value) => updateSensorThreshold(sensor.id, 'max', value)}
                                    min={sensor.min}
                                    max={sensor.max}
                                    step={sensor.id === 'ph' ? 0.1 : 1}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{sensor.min}{sensor.unit}</span>
                                    <span className="font-semibold">{sensorData.max}{sensor.unit}</span>
                                    <span>{sensor.max}{sensor.unit}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Personalization */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    Personnalisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cover Image */}
                  <div className="space-y-3">
                    <Label>Image de couverture</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                            formData.coverImage === image ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => updateFormData('coverImage', '', image)}
                        >
                          <img
                            src={image}
                            alt={`Option ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                          {formData.coverImage === image && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Importer une image personnalisée
                    </Button>
                  </div>

                  {/* Theme Color */}
                  <div className="space-y-3">
                    <Label>Couleur thématique</Label>
                    <div className="flex gap-3 flex-wrap">
                      {themeColors.map((color) => (
                        <button
                          key={color.value}
                          className={`w-12 h-12 rounded-full border-4 ${
                            formData.themeColor === color.value ? 'border-primary' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateFormData('themeColor', '', color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-4">
                    <Label>Préférences de notifications</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Notifications par email</span>
                        </div>
                        <Switch
                          checked={formData.notifications.email}
                          onCheckedChange={(checked) => updateFormData('notifications', 'email', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span>Notifications push</span>
                        </div>
                        <Switch
                          checked={formData.notifications.push}
                          onCheckedChange={(checked) => updateFormData('notifications', 'push', checked)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Fréquence des notifications</Label>
                        <Select
                          value={formData.notifications.frequency}
                          onValueChange={(value) => updateFormData('notifications', 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immédiat</SelectItem>
                            <SelectItem value="daily">Quotidien</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Précédent
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate('/mes-jardins')}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={saveAsDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder comme brouillon
                </Button>
                {currentStep < 3 ? (
                  <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                    Suivant
                  </Button>
                ) : (
                  <Button onClick={createGarden} disabled={!isStepValid(3)} className="bg-primary">
                    Créer le jardin
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AddNewGarden;
