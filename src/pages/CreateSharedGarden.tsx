import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackToTop from "@/components/BackToTop";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  MapPin,
  Upload,
  X,
  Save,
  Users,
  Camera,
  MessageSquare,
  Calendar,
  Lightbulb,
  TrendingUp,
  Star,
  CheckCircle,
  Trash2
} from "lucide-react";

// Types de cultures
const cropTypes = [
  { id: "vegetables", label: "Légumes" },
  { id: "herbs", label: "Herbes aromatiques" },
  { id: "fruits", label: "Fruits" },
  { id: "flowers", label: "Fleurs" }
];

// Équipements disponibles
const equipmentOptions = [
  { id: "greenhouse", label: "Serre" },
  { id: "tools", label: "Outils" },
  { id: "composting", label: "Compostage" },
  { id: "irrigation", label: "Système d'arrosage" },
  { id: "storage", label: "Espace de stockage" },
  { id: "fencing", label: "Clôture" }
];

// Conseils pour démarrer
const tips = [
  "Définissez clairement les règles de participation dès le départ",
  "Organisez une réunion d'accueil pour les nouveaux membres",
  "Établissez un planning de tâches partagé",
  "Encouragez le partage des connaissances et des compétences",
  "Préparez un budget prévisionnel pour les achats communs"
];

// Statistiques des jardins
const gardenStats = [
  { label: "Jardins actifs", value: "247", icon: TrendingUp },
  { label: "Membres actifs", value: "1,543", icon: Users },
  { label: "Échanges réussis", value: "892", icon: CheckCircle }
];

// Témoignages
const testimonials = [
  {
    name: "Marie Dubois",
    garden: "Jardin des Lilas",
    quote: "Créer ce jardin partagé a transformé notre quartier. Nous avons maintenant une communauté soudée autour du jardinage urbain.",
    rating: 5
  },
  {
    name: "Pierre Martin",
    garden: "Potager Solidaire",
    quote: "L'entraide et le partage sont au cœur de notre projet. C'est incroyable de voir comment un petit espace peut rassembler tant de personnes.",
    rating: 5
  }
];

const CreateSharedGarden = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cropTypes: [] as string[],
    maxMembers: 10,
    location: "",
    latitude: 0,
    longitude: 0,
    equipment: [] as string[],
    rules: "",
    contactEmail: "",
    contactPhone: "",
    discussionGroup: false,
    meetingFrequency: "monthly"
  });

  // Gestionnaire de changement des champs
  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gestionnaire des cases à cocher pour les types de cultures
  const handleCropTypeChange = (cropId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cropTypes: checked
        ? [...prev.cropTypes, cropId]
        : prev.cropTypes.filter(id => id !== cropId)
    }));
  };

  // Gestionnaire des cases à cocher pour les équipements
  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: checked
        ? [...prev.equipment, equipmentId]
        : prev.equipment.filter(id => id !== equipmentId)
    }));
  };

  // Gestionnaire d'upload d'images
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  // Suppression d'une image
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Sauvegarde en brouillon
  const saveDraft = () => {
    localStorage.setItem('sharedGardenDraft', JSON.stringify({ ...formData, uploadedImages }));
    alert('Brouillon sauvegardé !');
  };

  // Création du jardin
  const createGarden = () => {
    // Validation basique
    if (!formData.name || !formData.description || !formData.location) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Ici, envoi à l'API
    console.log('Création du jardin partagé:', { ...formData, uploadedImages });
    navigate('/decouvrir-jardins');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="container py-4 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Accueil</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Créer mon jardin partagé</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>

        {/* Section Héros */}
        <section className="bg-gradient-to-r from-green-400 via-blue-500 to-green-600 py-16">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Créer Votre Jardin Partagé
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Rassemblez une communauté autour du jardinage urbain et créez un espace de partage,
              d'entraide et de culture durable dans votre quartier.
            </p>
          </div>
        </section>

        {/* Formulaire Principal */}
        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire (2 colonnes) */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne Gauche */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom du jardin *</Label>
                        <Input
                          id="name"
                          placeholder="Ex: Jardin Solidaire du Quartier"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Décrivez votre projet de jardin partagé..."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Types de cultures envisagées</Label>
                        <div className="space-y-2 mt-2">
                          {cropTypes.map((crop) => (
                            <div key={crop.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={crop.id}
                                checked={formData.cropTypes.includes(crop.id)}
                                onCheckedChange={(checked) => handleCropTypeChange(crop.id, checked as boolean)}
                              />
                              <Label htmlFor={crop.id}>{crop.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
                        <Select
                          value={formData.maxMembers.toString()}
                          onValueChange={(value) => handleInputChange('maxMembers', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 10, 15, 20, 25, 30].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} membres</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Colonne Droite */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location">Adresse/Localisation *</Label>
                        <Input
                          id="location"
                          placeholder="Ex: 123 Rue de la Paix, Paris 75001"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>

                      {/* Carte Interactive (placeholder) */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Carte interactive</p>
                        <p className="text-sm text-gray-400">
                          Cliquez pour sélectionner l'emplacement exact de votre jardin
                        </p>
                        <Button variant="outline" className="mt-4">
                          Ouvrir la carte
                        </Button>
                      </div>

                      <div>
                        <Label>Équipements disponibles</Label>
                        <div className="space-y-2 mt-2">
                          {equipmentOptions.map((equipment) => (
                            <div key={equipment.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={equipment.id}
                                checked={formData.equipment.includes(equipment.id)}
                                onCheckedChange={(checked) => handleEquipmentChange(equipment.id, checked as boolean)}
                              />
                              <Label htmlFor={equipment.id}>{equipment.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload d'Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Photos du jardin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Glissez-déposez vos images ici</p>
                      <p className="text-sm text-gray-400 mb-4">ou</p>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Parcourir les fichiers
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Règles du Jardin */}
              <Card>
                <CardHeader>
                  <CardTitle>Règles du jardin</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Définissez les règles de fonctionnement de votre jardin partagé..."
                    value={formData.rules}
                    onChange={(e) => handleInputChange('rules', e.target.value)}
                    rows={6}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Suggestions: horaires d'accès, responsabilités des membres, fréquence des réunions, etc.
                  </p>
                </CardContent>
              </Card>

              {/* Options de Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contact et Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Email de contact</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="votre.email@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Téléphone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="discussionGroup"
                      checked={formData.discussionGroup}
                      onCheckedChange={(checked) => handleInputChange('discussionGroup', checked)}
                    />
                    <Label htmlFor="discussionGroup">Créer un groupe de discussion</Label>
                  </div>

                  <div>
                    <Label htmlFor="meetingFrequency">Fréquence des réunions</Label>
                    <Select
                      value={formData.meetingFrequency}
                      onValueChange={(value) => handleInputChange('meetingFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="biweekly">Bihebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                        <SelectItem value="quarterly">Trimestrielle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Boutons d'Action */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/">
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Link>
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={saveDraft}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder le brouillon
                      </Button>
                      <Button onClick={createGarden} className="bg-green-600 hover:bg-green-700">
                        Créer mon jardin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Informatif */}
            <div className="space-y-6">
              {/* Conseils */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Conseils pour bien démarrer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques des jardins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gardenStats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{stat.label}</span>
                          </div>
                          <Badge variant="secondary">{stat.value}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Témoignages */}
              <Card>
                <CardHeader>
                  <CardTitle>Témoignages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm italic mb-2">"{testimonial.quote}"</p>
                        <div className="text-xs text-gray-500">
                          <strong>{testimonial.name}</strong> - {testimonial.garden}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default CreateSharedGarden;
