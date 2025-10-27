import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import BackToTop from "@/components/BackToTop";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  Link,
  Image as ImageIcon,
  Upload,
  X,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Save,
  Send,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

const NewDiscussion = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    tags: "",
    privacy: "public",
    images: [] as File[]
  });

  const [showPreview, setShowPreview] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = [
    { value: "plantation", label: "Plantation", description: "Semis, repiquage et plantation" },
    { value: "arrosage", label: "Arrosage", description: "Techniques d'arrosage et irrigation" },
    { value: "maladies", label: "Maladies", description: "Diagnostic et traitement des maladies" },
    { value: "recolte", label: "Récolte", description: "Moment et techniques de récolte" },
    { value: "entretien", label: "Entretien", description: "Taille, fertilisation et maintenance" },
    { value: "autres", label: "Autres", description: "Questions diverses sur le jardinage urbain" }
  ];

  const privacyOptions = [
    { value: "public", label: "Public", description: "Visible par tous les membres" },
    { value: "members", label: "Membres seulement", description: "Visible par les membres connectés" },
    { value: "local", label: "Groupe local", description: "Visible par votre groupe local" }
  ];

  const suggestedTags = [
    "débutant", "avancé", "tomates", "salades", "herbes aromatiques", "compost", "permaculture", "balcon", "terrasse"
  ];

  const handleInputChange = (field: string, value: string | boolean | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImages = files.filter(file => file.type.startsWith('image/'));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validImages].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getProgress = () => {
    let progress = 0;
    if (formData.title.trim()) progress += 25;
    if (formData.category) progress += 25;
    if (formData.content.trim()) progress += 25;
    if (formData.tags.trim()) progress += 25;
    return progress;
  };

  const isFormValid = () => {
    return formData.title.trim() && formData.category && formData.content.trim();
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft:", formData);
  };

  const handlePublish = () => {
    if (isFormValid()) {
      // TODO: Implement publish functionality
      console.log("Publishing discussion:", formData);
    }
  };

  const renderPreview = () => {
    const selectedCategory = categories.find(cat => cat.value === formData.category);
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {selectedCategory && (
                  <Badge className="bg-primary/10 text-primary">
                    {selectedCategory.label}
                  </Badge>
                )}
                {formData.privacy !== "public" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {formData.privacy === "members" ? "Membres" : "Groupe local"}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-2">
                {formData.title || "Titre de votre discussion"}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>Par Vous</span>
                <span>•</span>
                <span>À l'instant</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none mb-4">
            {formData.content ? (
              <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
            ) : (
              <p className="text-muted-foreground italic">Votre contenu apparaîtra ici...</p>
            )}
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">
          Titre de la discussion <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Posez votre question ou décrivez votre sujet..."
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          maxLength={100}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formData.title.length}/100 caractères</span>
          {formData.title && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-base font-medium">
          Catégorie <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisissez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div>
                  <div className="font-medium">{category.label}</div>
                  <div className="text-sm text-muted-foreground">{category.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.category && <CheckCircle className="h-4 w-4 text-green-500 inline" />}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-base font-medium">
          Description <span className="text-destructive">*</span>
        </Label>
        <div className="border rounded-md">
          <div className="border-b p-2 flex gap-1">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            id="content"
            placeholder="Décrivez votre problème, partagez votre expérience, posez votre question..."
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="min-h-[200px] border-0 resize-none"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formData.content.length} caractères</span>
          {formData.content && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Images (optionnel)</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Glissez-déposez vos images ici ou cliquez pour sélectionner
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={formData.images.length >= 5}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sélectionner des images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-base font-medium">
          Tags (optionnel)
        </Label>
        <Input
          id="tags"
          placeholder="Ex: tomates, maladies, débutant (séparés par des virgules)"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Les tags aident les autres membres à trouver votre discussion
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-sm text-muted-foreground">Suggestions :</span>
          {suggestedTags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => {
                const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
                if (!currentTags.includes(tag)) {
                  handleInputChange('tags', [...currentTags, tag].join(', '));
                }
              }}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-2">
        <Label htmlFor="privacy" className="text-base font-medium">
          Confidentialité
        </Label>
        <Select value={formData.privacy} onValueChange={(value) => handleInputChange('privacy', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisissez la confidentialité" />
          </SelectTrigger>
          <SelectContent>
            {privacyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-4 bg-muted/30 border-b">
          <div className="container">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <RouterLink to="/">Accueil</RouterLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <RouterLink to="/communaute">Communauté</RouterLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Nouvelle discussion</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Title Section */}
        <section className="py-8 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5">
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <RouterLink to="/communaute">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au forum
                </RouterLink>
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Créer une nouvelle discussion
            </h1>
            <p className="text-lg text-muted-foreground">
              Partagez vos questions, expériences ou conseils avec la communauté
            </p>
          </div>
        </section>

        {/* Progress */}
        <section className="py-4 bg-background border-b">
          <div className="container">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={getProgress()} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground">
                {getProgress()}% complété
              </span>
            </div>
          </div>
        </section>

        <div className="container py-8">
          {isMobile ? (
            /* Mobile Layout - Tabs */
            <Tabs value={showPreview ? "preview" : "form"} onValueChange={(value) => setShowPreview(value === "preview")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Éditer</TabsTrigger>
                <TabsTrigger value="preview">Aperçu</TabsTrigger>
              </TabsList>
              <TabsContent value="form" className="mt-6">
                {renderForm()}
              </TabsContent>
              <TabsContent value="preview" className="mt-6">
                {renderPreview()}
              </TabsContent>
            </Tabs>
          ) : (
            /* Desktop Layout - Two Columns */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                {renderForm()}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Aperçu en temps réel</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {showPreview && renderPreview()}
              </div>
            </div>
          )}

          {/* Tips Section */}
          <Alert className="mt-8">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Conseils pour une bonne discussion :</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Choisissez un titre clair et descriptif</li>
                <li>• Fournissez autant de détails que possible</li>
                <li>• Utilisez des tags pertinents pour une meilleure visibilité</li>
                <li>• Respectez les autres membres et restez courtois</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Sauvegarder en brouillon
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex items-center gap-2"
            >
              <RouterLink to="/communaute">
                <X className="h-4 w-4" />
                Annuler
              </RouterLink>
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!isFormValid()}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              Publier la discussion
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default NewDiscussion;
