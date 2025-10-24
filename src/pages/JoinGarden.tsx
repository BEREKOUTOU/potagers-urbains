import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Star, ArrowLeft, Download, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gardens } from "@/data/gardens";
import BackToTop from "@/components/BackToTop";

const JoinGarden = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const garden = gardens.find(g => g.id === parseInt(id || "0"));

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    motivation: "",
    experience: "",
    experienceDetails: "",
    availability: [] as string[],
    availabilityDetails: "",
    acceptRules: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!garden) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Jardin non trouvé</h1>
          <Button onClick={() => navigate("/decouvrir-jardins")}>
            Retour aux jardins
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    const newAvailability = checked
      ? [...formData.availability, day]
      : formData.availability.filter(d => d !== day);
    handleInputChange("availability", newAvailability);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Le nom complet est requis";
    if (!formData.email.trim()) newErrors.email = "L'adresse email est requise";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.motivation.trim()) newErrors.motivation = "La motivation est requise";
    if (!formData.experience) newErrors.experience = "Le niveau d'expérience est requis";
    if (!formData.acceptRules) newErrors.acceptRules = "Vous devez accepter le règlement";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted:", formData);
      // Navigate to success page or show success message
    }
  };

  const gardenRules = `
Règlement intérieur du jardin ${garden.name}

1. Respect des horaires d'ouverture et de fermeture
2. Participation aux tâches collectives selon le planning établi
3. Utilisation responsable des outils et équipements
4. Respect de l'environnement et des autres membres
5. Interdiction de consommer les produits sans autorisation
6. Signalement des problèmes ou incidents immédiatement
7. Participation aux réunions mensuelles
8. Respect des règles d'hygiène et de sécurité

En cas de non-respect répété, l'accès au jardin pourra être suspendu.
  `.trim();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Garden Details */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 mb-6"
                  onClick={() => navigate("/decouvrir-jardins")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux jardins
                </Button>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{garden.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xl">{garden.location}</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{garden.members}/{garden.maxMembers} membres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(garden.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span>{garden.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {garden.crops.map((crop) => (
                    <Badge key={crop} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {crop}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {garden.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="border-white text-white">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <p className="text-lg opacity-90">{garden.description}</p>
              </div>
              <div className="lg:pl-8">
                <img
                  src={garden.image}
                  alt={garden.name}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Demande d'adhésion</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Nom complet <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Adresse email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Numéro de téléphone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card>
                <CardHeader>
                  <CardTitle>Motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="motivation">
                      Pourquoi souhaitez-vous rejoindre ce jardin ? <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="motivation"
                      placeholder="Décrivez vos motivations pour rejoindre ce jardin communautaire..."
                      value={formData.motivation}
                      onChange={(e) => handleInputChange("motivation", e.target.value)}
                      className={`min-h-24 ${errors.motivation ? "border-red-500" : ""}`}
                    />
                    {errors.motivation && <p className="text-sm text-red-500">{errors.motivation}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Gardening Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Expérience en jardinage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      Niveau d'expérience <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="experienced">Expérimenté</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceDetails">
                      Détails de votre expérience
                    </Label>
                    <Textarea
                      id="experienceDetails"
                      placeholder="Décrivez vos expériences passées en jardinage..."
                      value={formData.experienceDetails}
                      onChange={(e) => handleInputChange("experienceDetails", e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Disponibilités horaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Jours de disponibilité</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={formData.availability.includes(day)}
                            onCheckedChange={(checked) => handleAvailabilityChange(day, checked === true)}
                          />
                          <Label htmlFor={day} className="text-sm">{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Créneaux horaires préférés</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Matin (9h-12h)", "Après-midi (12h-18h)", "Soir (18h-21h)"].map((slot) => (
                        <div key={slot} className="flex items-center space-x-2">
                          <Checkbox id={slot} />
                          <Label htmlFor={slot} className="text-sm">{slot}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availabilityDetails">
                      Précisions supplémentaires
                    </Label>
                    <Textarea
                      id="availabilityDetails"
                      placeholder="Indiquez vos contraintes horaires ou disponibilités spécifiques..."
                      value={formData.availabilityDetails}
                      onChange={(e) => handleInputChange("availabilityDetails", e.target.value)}
                      className="min-h-16"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Rules Acceptance */}
              <Card>
                <CardHeader>
                  <CardTitle>Règlement intérieur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{gardenRules}</pre>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptRules"
                        checked={formData.acceptRules}
                        onCheckedChange={(checked) => handleInputChange("acceptRules", checked === true)}
                        className={errors.acceptRules ? "border-red-500" : ""}
                      />
                      <Label htmlFor="acceptRules" className="text-sm">
                        J'accepte le règlement intérieur du jardin <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le règlement
                    </Button>
                  </div>
                  {errors.acceptRules && <p className="text-sm text-red-500">{errors.acceptRules}</p>}
                </CardContent>
              </Card>

              {/* Summary and Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Jardin sélectionné</h4>
                    <p className="text-sm">{garden.name} - {garden.location}</p>
                    {formData.fullName && formData.email && (
                      <>
                        <h4 className="font-semibold mt-4 mb-2">Informations saisies</h4>
                        <p className="text-sm">Nom: {formData.fullName}</p>
                        <p className="text-sm">Email: {formData.email}</p>
                      </>
                    )}
                    <h4 className="font-semibold mt-4 mb-2">Prochaines étapes</h4>
                    <p className="text-sm">
                      Votre candidature sera examinée par les administrateurs du jardin.
                      Vous recevrez une réponse par email dans les 7 jours ouvrés.
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => navigate("/decouvrir-jardins")}>
                      Retour aux jardins
                    </Button>
                    <Button type="submit" size="lg">
                      Soumettre ma candidature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default JoinGarden;
