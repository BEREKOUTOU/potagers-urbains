import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Image as ImageIcon,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Clock,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: undefined,
    time: "",
    location: "",
    description: "",
    category: "",
    capacity: "",
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "atelier", label: "Atelier" },
    { value: "troc", label: "Troc" },
    { value: "visite", label: "Visite" },
    { value: "formation", label: "Formation" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.date) newErrors.date = "La date est requise";
    if (!formData.time.trim()) newErrors.time = "L'heure est requise";
    if (!formData.location.trim()) newErrors.location = "Le lieu est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = "La capacité doit être supérieure à 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Submit form data
      console.log("Form submitted:", formData);
    }
  };

  const tips = [
    {
      icon: "🌱",
      title: "Choisissez un titre accrocheur",
      description: "Un titre clair et engageant attire plus de participants."
    },
    {
      icon: "📅",
      title: "Planifiez à l'avance",
      description: "Laissez suffisamment de temps pour la promotion de votre événement."
    },
    {
      icon: "📍",
      title: "Précisez le lieu",
      description: "Indiquez une adresse claire et accessible pour faciliter l'accès."
    },
    {
      icon: "👥",
      title: "Définissez la capacité",
      description: "Évitez la surpopulation en fixant un nombre maximum de participants."
    },
    {
      icon: "📸",
      title: "Ajoutez une image",
      description: "Une belle photo attire l'attention et donne envie de participer."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header with Navigation */}
        <section className="bg-background border-b">
          <div className="container py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/communaute">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la communauté
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Title */}
        <section className="py-8 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5">
          <div className="container">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Créer un Événement
              </h1>
              <p className="text-lg text-muted-foreground">
                Organisez un événement pour la communauté des jardiniers urbains
              </p>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de base */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de base</CardTitle>
                    <CardDescription>Définissez les éléments essentiels de votre événement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre de l'événement *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Atelier Permaculture urbaine"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={errors.title ? "border-destructive" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.title}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Date et Heure */}
                <Card>
                  <CardHeader>
                    <CardTitle>Date et Heure</CardTitle>
                    <CardDescription>Quand aura lieu votre événement ?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${errors.date ? "border-destructive" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? format(formData.date, "PPP", { locale: fr }) : "Sélectionner une date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.date}
                              onSelect={(date) => handleInputChange("date", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.date && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.date}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="time">Heure *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange("time", e.target.value)}
                          className={errors.time ? "border-destructive" : ""}
                        />
                        {errors.time && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Localisation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Localisation</CardTitle>
                    <CardDescription>Où se déroulera l'événement ?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="location">Lieu *</Label>
                      <Input
                        id="location"
                        placeholder="Ex: Jardin des Lilas - Paris 20e"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className={errors.location ? "border-destructive" : ""}
                      />
                      {errors.location && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                    <CardDescription>Décrivez en détail votre événement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="description">Description détaillée *</Label>
                      <Textarea
                        id="description"
                        placeholder="Décrivez l'événement, son objectif, ce qui sera abordé..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className={errors.description ? "border-destructive" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Catégorie et Capacité */}
                <Card>
                  <CardHeader>
                    <CardTitle>Catégorie et Capacité</CardTitle>
                    <CardDescription>Classifiez votre événement et définissez le nombre de participants</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Catégorie *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.category}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="capacity">Capacité maximale *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          min="1"
                          placeholder="Ex: 30"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange("capacity", e.target.value)}
                          className={errors.capacity ? "border-destructive" : ""}
                        />
                        {errors.capacity && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.capacity}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Image d'illustration</CardTitle>
                    <CardDescription>Ajoutez une photo pour rendre votre événement plus attractif</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Cliquez pour sélectionner une image
                          </p>
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publier l'Événement
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/communaute">Annuler</Link>
                  </Button>
                </div>
              </form>

              {/* Section de Prévisualisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Aperçu de l'événement
                  </CardTitle>
                  <CardDescription>Voici comment votre événement apparaîtra dans la liste</CardDescription>
                </CardHeader>
                <CardContent>
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={formData.title || "Événement"}
                          className="w-full h-40 object-cover mb-4 rounded-md"
                        />
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-md mb-4 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>{categories.find(c => c.value === formData.category)?.label || "Catégorie"}</Badge>
                            <CardTitle className="text-lg">{formData.title || "Titre de l'événement"}</CardTitle>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {formData.date ? format(formData.date, "dd MMM yyyy", { locale: fr }) : "Date"} à {formData.time || "Heure"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{formData.location || "Lieu"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>0/{formData.capacity || "0"} participants</span>
                            </div>
                          </div>
                        </div>
                        <Button>S'inscrire</Button>
                      </div>
                    </CardHeader>
                  </Card>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Conseils */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Conseils pour réussir votre événement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="text-2xl">{tip.icon}</div>
                        <div>
                          <h4 className="font-medium text-sm">{tip.title}</h4>
                          <p className="text-xs text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques communautaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Événements ce mois</span>
                    <Badge variant="secondary">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Participants moyens</span>
                    <Badge variant="secondary">24</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taux de participation</span>
                    <Badge variant="secondary">78%</Badge>
                  </div>
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

export default CreateEvent;
