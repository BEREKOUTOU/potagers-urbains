import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Upload, Trash2, Plus, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

// Mock data - in real app, this would come from API
const myGardens = [
  {
    id: 1,
    name: "Jardin du Balcon",
    location: "Paris 11ème",
    image: "/assets/garden-3.jpg",
    status: "active",
    iot: {
      temperature: { min: 18, max: 25, current: 24 },
      humidity: { min: 60, max: 80, current: 68 },
      ph: { min: 6.0, max: 7.0, current: 6.5 }
    },
    tasks: [
      { id: 1, title: "Arrosage tomates", priority: "high", dueDate: "2024-01-15" },
      { id: 2, title: "Tailler basilic", priority: "medium", dueDate: "2024-01-16" }
    ],
    harvests: [
      { id: 1, crop: "Tomates cerises", date: "2024-01-20", quantity: "2 kg" },
      { id: 2, crop: "Basilic", date: "2024-01-15", quantity: "500g" }
    ]
  },
  // ... other gardens
];

type Garden = typeof myGardens[0];

const EditGarden = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'active',
    image: '',
    iot: {
      temperature: { min: 18, max: 25, current: 24 },
      humidity: { min: 60, max: 80, current: 68 },
      ph: { min: 6.0, max: 7.0, current: 6.5 }
    }
  });

  const [tasks, setTasks] = useState(garden?.tasks || []);
  const [harvests, setHarvests] = useState(garden?.harvests || []);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [newHarvest, setNewHarvest] = useState({ crop: '', date: '', quantity: '' });

  useEffect(() => {
    if (id) {
      const foundGarden = myGardens.find(g => g.id === parseInt(id));
      if (foundGarden) {
        setGarden(foundGarden);
        setFormData({
          name: foundGarden.name,
          location: foundGarden.location,
          status: foundGarden.status,
          image: foundGarden.image || '',
          iot: foundGarden.iot
        });
        setTasks(foundGarden.tasks);
        setHarvests(foundGarden.harvests);
      }
    }
    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In real app, update the garden data
      console.log('Saving garden:', { ...formData, tasks, harvests });

      setMessage({ type: 'success', text: 'Modifications sauvegardées avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Deleting garden:', id);
      setMessage({ type: 'success', text: 'Jardin supprimé avec succès.' });
      navigate('/mes-jardins');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
    }
  };

  const addTask = () => {
    if (newTask.title && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({ title: '', priority: 'medium', dueDate: '' });
    }
  };

  const removeTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addHarvest = () => {
    if (newHarvest.crop && newHarvest.date) {
      setHarvests([...harvests, { ...newHarvest, id: Date.now() }]);
      setNewHarvest({ crop: '', date: '', quantity: '' });
    }
  };

  const removeHarvest = (harvestId: number) => {
    setHarvests(harvests.filter(h => h.id !== harvestId));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!garden) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Jardin non trouvé</h1>
            <Link to="/mes-jardins">
              <Button>Retour aux jardins</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header with Back Button */}
        <section className="container py-6 border-b">
          <div className="flex items-center gap-4">
            <Link to="/mes-jardins">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Édition du Jardin</h1>
            </div>
          </div>
        </section>

        {/* Title and Context */}
        <section className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{formData.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={formData.status === 'active' ? 'default' : 'destructive'}>
                  {formData.status === 'active' ? 'Actif' : formData.status === 'maintenance' ? 'Maintenance' : 'Inactif'}
                </Badge>
                <span className="text-muted-foreground">{formData.location}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Status Messages */}
        {message && (
          <section className="container py-4">
            <Alert className={message.type === 'success' ? 'border-green-500' : message.type === 'error' ? 'border-red-500' : 'border-yellow-500'}>
              {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
              {message.type === 'error' && <XCircle className="h-4 w-4" />}
              {message.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          </section>
        )}

        <div className="container py-6 space-y-8">
          {/* General Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du jardin</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Image du jardin</Label>
                <div className="flex items-center gap-4 mt-2">
                  {formData.image && (
                    <img src={formData.image} alt="Garden" className="w-20 h-20 object-cover rounded" />
                  )}
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Modifier l'image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IoT Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration IoT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature */}
              <div>
                <h4 className="font-semibold mb-2">Seuils de Température</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Min (°C)</Label>
                    <Input
                      type="number"
                      value={formData.iot.temperature.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        iot: {
                          ...formData.iot,
                          temperature: { ...formData.iot.temperature, min: parseFloat(e.target.value) }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Max (°C)</Label>
                    <Input
                      type="number"
                      value={formData.iot.temperature.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        iot: {
                          ...formData.iot,
                          temperature: { ...formData.iot.temperature, max: parseFloat(e.target.value) }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Actuel</Label>
                    <Input value={`${formData.iot.temperature.current}°C`} disabled />
                  </div>
                  <div>
                    <Label>Recommandé</Label>
                    <Input value="18-25°C" disabled />
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div>
                <h4 className="font-semibold mb-2">Seuils d'Humidité</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Min (%)</Label>
                    <Input
                      type="number"
                      value={formData.iot.humidity.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        iot: {
                          ...formData.iot,
                          humidity: { ...formData.iot.humidity, min: parseFloat(e.target.value) }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Max (%)</Label>
                    <Input
                      type="number"
                      value={formData.iot.humidity.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        iot: {
                          ...formData.iot,
                          humidity: { ...formData.iot.humidity, max: parseFloat(e.target.value) }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Actuel</Label>
                    <Input value={`${formData.iot.humidity.current}%`} disabled />
                  </div>
                  <div>
                    <Label>Recommandé</Label>
                    <Input value="60-80%" disabled />
                  </div>
                </div>
              </div>

              {/* pH */}
              <div>
                <h4 className="font-semibold mb-2">Seuils de pH</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Min</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.iot.ph.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        iot: {
                          ...formData.iot,
                          ph: { ...formData.iot.ph, min: parseFloat(e.target.value) }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Max</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.iot.ph.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        iot: {
                          ...formData.iot,
                          ph: { ...formData.iot.ph, max: parseFloat(e.target.value) }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Actuel</Label>
                    <Input value={formData.iot.ph.current} disabled />
                  </div>
                  <div>
                    <Label>Recommandé</Label>
                    <Input value="6.0-7.0" disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Tâches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Tasks */}
              <div>
                <h4 className="font-semibold mb-2">Tâches existantes</h4>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Priorité: {task.priority} | Échéance: {task.dueDate}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Task */}
              <div>
                <h4 className="font-semibold mb-2">Ajouter une nouvelle tâche</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Nom de la tâche"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <Button onClick={addTask}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Harvests Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Récoltes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Harvests */}
              <div>
                <h4 className="font-semibold mb-2">Récoltes existantes</h4>
                <div className="space-y-2">
                  {harvests.map((harvest) => (
                    <div key={harvest.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{harvest.crop}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {harvest.date} | Quantité: {harvest.quantity}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeHarvest(harvest.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Harvest */}
              <div>
                <h4 className="font-semibold mb-2">Ajouter une nouvelle récolte</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Légume"
                    value={newHarvest.crop}
                    onChange={(e) => setNewHarvest({ ...newHarvest, crop: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newHarvest.date}
                    onChange={(e) => setNewHarvest({ ...newHarvest, date: e.target.value })}
                  />
                  <Input
                    placeholder="Quantité estimée"
                    value={newHarvest.quantity}
                    onChange={(e) => setNewHarvest({ ...newHarvest, quantity: e.target.value })}
                  />
                  <Button onClick={addHarvest}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </Button>
            <Link to="/mes-jardins">
              <Button variant="outline" className="flex-1">
                Annuler
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  Supprimer le jardin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce jardin ? Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Annuler</Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Supprimer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditGarden;
