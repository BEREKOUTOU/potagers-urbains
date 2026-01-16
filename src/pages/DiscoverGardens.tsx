import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Sprout, MapPin, Users, Star, Search, Filter, Grid, List, Plus, Leaf, Carrot, Flower, Apple, Award, TrendingUp, Users2, Calendar, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gardens, type Garden } from "@/data/gardens";
import { useNavigate } from "react-router-dom";
import BackToTop from "@/components/BackToTop";

const DiscoverGardens = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [memberRange, setMemberRange] = useState<number[]>([1, 20]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredGardens = useMemo(() => {
    return gardens.filter((garden) => {
      // Search query filter (name or location)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !garden.name.toLowerCase().includes(query) &&
          !garden.location.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion && selectedRegion !== "toutes") {
        if (garden.region !== selectedRegion) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation && selectedLocation !== "tous") {
        if (garden.location !== selectedLocation) {
          return false;
        }
      }

      // Member range filter
      if (garden.members < memberRange[0] || garden.members > memberRange[1]) {
        return false;
      }

      // Crop types filter (simple match based on crop names)
      if (selectedCrops.length > 0) {
        const hasMatchingCrop = garden.crops.some((crop) => {
          const cropLower = crop.toLowerCase();
          return selectedCrops.some((selected) => {
            if (selected === "legumes") return cropLower.includes("tomate") || cropLower.includes("radis") || cropLower.includes("carotte");
            if (selected === "herbes") return cropLower.includes("basilic") || cropLower.includes("persil") || cropLower.includes("lavande");
            if (selected === "fruits") return cropLower.includes("fraise") || cropLower.includes("pomme");
            if (selected === "fleurs") return cropLower.includes("fleur") || cropLower.includes("rose");
            return false;
          });
        });
        if (!hasMatchingCrop) {
          return false;
        }
      }

      // Availability filter
      if (availableOnly && garden.members >= garden.maxMembers) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedLocation, memberRange, selectedCrops, availableOnly]);

  const recommendedGardens: Garden[] = gardens.slice(0, 3);

  const cropTypes: readonly {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "legumes", label: "Légumes", icon: Carrot },
    { id: "herbes", label: "Herbes aromatiques", icon: Leaf },
    { id: "fruits", label: "Fruits", icon: Apple },
    { id: "fleurs", label: "Fleurs", icon: Flower }
  ] as const;

  const regions = Array.from(new Set(gardens.map(g => g.region))).sort();

  const handleCropToggle = (cropId: string): void => {
    setSelectedCrops(prev =>
      prev.includes(cropId)
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    );
  };

  interface GardenCardProps {
    garden: Garden;
    isListView?: boolean;
  }

  const GardenCard = ({ garden, isListView = false }: GardenCardProps): JSX.Element => (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow w-full"  ${isListView ? 'flex' : ''}`}>
      <div className={`${isListView ? 'w-1/3' : 'w-full'} h-48`}>
        <img
          src={garden.image}
          alt={garden.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className={`${isListView ? 'w-2/3 p-4' : 'p-4'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{garden.name}</h3>
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
            <span className="text-sm font-medium ml-1">{garden.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          {garden.location}
        </div>

        <div className="flex items-center gap-2 text-sm mb-3">
          <Users className="h-4 w-4" />
          {garden.members}/{garden.maxMembers} membres
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {garden.crops.map((crop) => (
            <Badge key={crop} variant="secondary" className="text-xs">
              {crop}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {garden.features.map((feature) => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {garden.description}
        </p>

        <div className="flex gap-0.5 justify-center">
          <Button className="flex-1" onClick={() => navigate(`/rejoindre-jardin/${garden.id}`)}>
            Rejoindre ce jardin
          </Button>
          <Button variant="outline" onClick={() => navigate(`/jardin/${garden.id}`)}>
            En savoir plus
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/jardin-stats/${garden.id}`)}>
            <BarChart3 className="h-4 w-4" />
            Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explorez les Jardins Urbains
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Découvrez et rejoignez la communauté des jardiniers urbains de Paris
            </p>

            {/* Main Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un jardin par nom ou localisation..."
                className="pl-12 pr-4 py-3 text-lg bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filtres de recherche</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Region */}
              <div className="space-y-2">
                <Label>Région</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les régions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Localisation</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les arrondissements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les arrondissements</SelectItem>
                    <SelectItem value="1er">Paris 1er</SelectItem>
                    <SelectItem value="2e">Paris 2ème</SelectItem>
                    <SelectItem value="3e">Paris 3ème</SelectItem>
                    <SelectItem value="4e">Paris 4ème</SelectItem>
                    <SelectItem value="18e">Paris 18ème</SelectItem>
                    <SelectItem value="19e">Paris 19ème</SelectItem>
                    <SelectItem value="20e">Paris 20ème</SelectItem>
                    <SelectItem value="21e">Paris 21ème</SelectItem>
                    <SelectItem value="22e">Paris 22ème</SelectItem>
                    <SelectItem value="23e">Paris 23ème</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Member Range */}
              <div className="space-y-2">
                <Label>Nombre de membres: {memberRange[0]} - {memberRange[1]}</Label>
                <Slider
                  value={memberRange}
                  onValueChange={setMemberRange}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Crop Types */}
              <div className="space-y-2">
                <Label>Type de culture</Label>
                <div className="space-y-2">
                  {cropTypes.map((crop) => (
                    <div key={crop.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={crop.id}
                        checked={selectedCrops.includes(crop.id)}
                        onCheckedChange={() => handleCropToggle(crop.id)}
                      />
                      <Label htmlFor={crop.id} className="text-sm flex items-center gap-1">
                        <crop.icon className="h-3 w-3" />
                        {crop.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>Disponibilité</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={availableOnly}
                    onCheckedChange={(checked) => setAvailableOnly(checked === true)}
                  />
                  <Label htmlFor="available" className="text-sm">
                    Jardins ouverts aux nouveaux membres
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
       {/* Statistics */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <Sprout className="h-12 w-12 text-green-600 mr-4" />
                <div>
                  <p className="text-green-600 text-3xl font-bold">47</p>
                  <p className="text-sm text-muted-foreground">Jardins disponibles</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users2 className="h-12 w-12 text-blue-600 mr-4" />
                <div>
                  <p className="text-blue-600 text-3xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Places disponibles</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-12 w-12 text-purple-600 mr-4" />
                <div>
                  <p className="text-purple-600 text-3xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Nouveaux ce mois</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <TrendingUp className="h-12 w-12 text-orange-600 mr-4" />
                <div>
                  <p className="text-orange-600 text-3xl font-bold">342</p>
                  <p className="text-sm text-muted-foreground">Membres actifs</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Map and List View */}
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 ">
            {/* Map Placeholder */}
            <Card className=" items-center justify-center h-96 ">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Carte des jardins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center bg-muted/50 rounded-md">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Carte interactive en cours de développement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gardens List/Grid */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle>Jardins disponibles</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`space-y-4 ${viewMode === "grid" ? "grid grid-cols-2 gap-2" : "space-y-4"}`}>
                  {filteredGardens.map((garden) => (
                    <GardenCard key={garden.id} garden={garden} isListView={viewMode === "list"} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommended Gardens */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Recommandés pour vous</h2>
          <p className="text-muted-foreground text-center mb-8">Jardins sélectionnés selon vos préférences et votre localisation</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedGardens.map((garden) => (
              <GardenCard key={garden.id} garden={garden} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous n'avez pas trouvé votre jardin idéal ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Créez votre propre espace de jardinage urbain et rejoignez notre communauté
          </p>
          <Button size="lg" variant="secondary" className="shadow-lg" onClick={() => navigate('/creer-jardin-partage')}>
            <Plus className="h-5 w-5 mr-2" />
            Créer mon jardin
          </Button>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default DiscoverGardens;
