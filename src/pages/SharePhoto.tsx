import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageIcon, Upload, CheckCircle } from "lucide-react";

const SharePhoto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photo: null as File | null,
    description: "",
    category: ""
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    "Jardin",
    "Récolte",
    "Avant/Après",
    "Conseils",
    "Événements",
    "Autres"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.photo || !formData.description || !formData.category) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);

      // Redirect after success
      setTimeout(() => {
        navigate("/communaute");
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Photo partagée avec succès !</h2>
              <p className="text-muted-foreground">Votre photo a été ajoutée à la galerie communautaire.</p>
              <Button onClick={() => navigate("/communaute")} className="mt-4">
                Retour à la communauté
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Partager une Photo
              </h1>
              <p className="text-muted-foreground">
                Partagez vos expériences de jardinage avec la communauté
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Détails de la photo
                </CardTitle>
                <CardDescription>
                  Remplissez les informations ci-dessous pour partager votre photo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      {preview ? (
                        <div className="space-y-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, photo: null }));
                              setPreview(null);
                            }}
                          >
                            Changer de photo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                          <div>
                            <Label htmlFor="photo" className="cursor-pointer">
                              <span className="text-primary hover:underline">
                                Cliquez pour sélectionner une photo
                              </span>
                              <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Formats acceptés: JPG, PNG, GIF (max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre photo, partagez vos conseils ou posez une question..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Partage en cours..." : "Partager la photo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default SharePhoto;
