import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import BackToTop from "@/components/BackToTop";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sprout, User, Mail, Phone, MapPin, Calendar, Edit, Settings, Shield, Trash2, Download, ExternalLink, Heart, BookOpen, Video, FileText, Plus, Activity, Users, Star, Camera, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("/photo-profil.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState({
    firstName: user?.first_name || "Jean",
    lastName: user?.last_name || "Dupont",
    email: user?.email || "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue des Jardins, 75001 Paris",
    bio: user?.bio || "Passionné de jardinage urbain et de permaculture. J'adore partager mes connaissances sur les jardins connectés."
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    region: user?.region || "Île-de-France",
    language: "Français",
    timezone: "Europe/Paris"
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        bio: userInfo.bio,
        location: userInfo.address, // Assuming address maps to location
        region: preferences.region,
      });
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-white border-2 border-white shadow-md hover:bg-gray-50"
                onClick={handleCameraClick}
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{userInfo.firstName} {userInfo.lastName}</h1>
              <p className="text-xl mb-2">{userInfo.email}</p>
              <p className="text-lg opacity-90">Membre depuis {user?.join_date ? new Date(user.join_date).toLocaleDateString('fr-FR') : '15 mars 2023'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <Sprout className="h-12 w-12 text-green-600 mr-4" />
                <div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Jardins créés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <BookOpen className="h-12 w-12 text-blue-600 mr-4" />
                <div>
                  <p className="text-3xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Ressources téléchargées</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-12 w-12 text-purple-600 mr-4" />
                <div>
                  <p className="text-3xl font-bold">28</p>
                  <p className="text-sm text-muted-foreground">Contributions partagées</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Activity className="h-12 w-12 text-orange-600 mr-4" />
                <div>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Jours d'activité</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Informations</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="activity">Activités</TabsTrigger>
              <TabsTrigger value="gardens">Mes Jardins</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations Personnelles
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations de base et votre profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={userInfo.firstName}
                        onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={userInfo.lastName}
                        onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userInfo.bio}
                      onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sauvegarde...
                            </>
                          ) : (
                            "Sauvegarder"
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>Annuler</Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif">Notifications par email</Label>
                      <Switch
                        id="email-notif"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notif">Notifications push</Label>
                      <Switch
                        id="push-notif"
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-summary">Résumé hebdomadaire</Label>
                      <Switch
                        id="weekly-summary"
                        checked={preferences.weeklySummary}
                        onCheckedChange={(checked) => setPreferences({...preferences, weeklySummary: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Paramètres Régionaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Région</Label>
                      <Select value={preferences.region} onValueChange={(value) => setPreferences({...preferences, region: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Île-de-France">Île-de-France</SelectItem>
                          <SelectItem value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</SelectItem>
                          <SelectItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Langue</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Français">Français</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fuseau horaire</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Changer le mot de passe</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity History */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Historique des Activités
                  </CardTitle>
                  <CardDescription>
                    Vos dernières actions sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <Sprout className="h-8 w-8 text-green-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Jardin "Balcon Fleuri" créé</p>
                        <p className="text-sm text-muted-foreground">15 mars 2024</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <BookOpen className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Guide "Permaculture Urbaine" téléchargé</p>
                        <p className="text-sm text-muted-foreground">12 mars 2024</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <Users className="h-8 w-8 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Commentaire posté sur "Conseils d'arrosage"</p>
                        <p className="text-sm text-muted-foreground">10 mars 2024</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User's Gardens */}
            <TabsContent value="gardens" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mes Jardins</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Jardin
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((garden) => {
                  const gardenImages = ['Jardin_Balcon.jpg', 'Jardin_Balcon2.jpg', 'Jardin-Balcon2.jpg'];
                  return (
                    <Card key={garden}>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-3 gap-1">
                          {gardenImages.map((img, idx) => (
                            <img key={idx} src={`/assets/${img}`} alt={`Jardin ${idx - 2}`} className="w-full h-32 object-cover rounded-t-lg" />
                          ))}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">Jardin Balcon {garden}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Balcon</Badge>
                            <Badge variant="outline">Actif</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">Créé le 15 mars 2024</p>
                          <Button className="w-full">
                            <Sprout className="h-4 w-4 mr-2" />
                            Accéder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Favorite Resources */}
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Ressources Favorites
                  </CardTitle>
                  <CardDescription>
                    Vos ressources mises en favoris
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">Guide de Permaculture</p>
                          <p className="text-sm text-muted-foreground">Guide • Ajouté le 10 mars 2024</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Video className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="font-medium">Atelier Compostage</p>
                          <p className="text-sm text-muted-foreground">Vidéo • Ajouté le 8 mars 2024</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium">Calendrier Lunaire</p>
                          <p className="text-sm text-muted-foreground">Document • Ajouté le 5 mars 2024</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Advanced Settings */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres Avancés du Compte
              </CardTitle>
              <CardDescription>
                Gestion avancée de votre compte et de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Gérer les connexions tierces
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Zone de danger</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Profile;
