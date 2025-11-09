import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Stethoscope,
  MessageCircle,
  CloudRain,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  Upload,
  Send,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  Droplets,
  Sun,
  X,
  Loader2,
  Mic
} from "lucide-react";

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Mock data for AI features
const aiFeatures = [
  {
    icon: Stethoscope,
    title: "Diagnostic automatique des maladies",
    description: "Analysez les photos de vos plantes pour identifier maladies, parasites et carences nutritionnelles en quelques secondes"
  },
  {
    icon: Brain,
    title: "Conseils personnalisés IoT",
    description: "Recommandations intelligentes basées sur les données de vos capteurs pour optimiser l'arrosage et l'éclairage"
  },
  {
    icon: CloudRain,
    title: "Prédictions météorologiques",
    description: "Prévisions précises du temps local pour planifier vos activités de jardinage et protéger vos cultures"
  },
  {
    icon: TrendingUp,
    title: "Optimisation des rendements",
    description: "Algorithmes d'IA pour maximiser vos récoltes en optimisant les cycles de culture et les variétés"
  },
  {
    icon: MessageCircle,
    title: "Chat interactif avec GreenBot",
    description: "Posez vos questions à notre assistant IA 24/7 pour obtenir des conseils experts personnalisés"
  },
  {
    icon: BarChart3,
    title: "Analyse prédictive",
    description: "Prévisions des problèmes potentiels avant qu'ils n'apparaissent grâce à l'analyse de tendances"
  }
];

// Mock chat messages
const mockChat = [
  { sender: "user", message: "Mes tomates ont des taches jaunes, que faire ?" },
  { sender: "bot", message: "Cela ressemble à une carence en magnésium. Augmentez l'arrosage avec de l'eau riche en minéraux ou utilisez un engrais équilibré." },
  { sender: "user", message: "Quelle variété recommandez-vous pour mon balcon ?" },
  { sender: "bot", message: "Pour un balcon, je recommande la variété 'Black Krim' - résistante et productive. Assurez-vous d'avoir au moins 6h de soleil par jour." }
];

// Mock diagnostic examples
const diagnosticExamples = [
  {
    before: "/src/assets/garden-1.jpg",
    after: "/src/assets/garden-2.jpg",
    problem: "Mildiou détecté",
    solution: "Traiter avec du soufre et améliorer la ventilation",
    confidence: 95
  },
  {
    before: "/src/assets/harvest-1.jpg",
    after: "/src/assets/garden-3.jpg",
    problem: "Carence en potassium",
    solution: "Ajouter de la potasse et ajuster le pH du sol",
    confidence: 88
  }
];

// Mock IoT data
const iotData = {
  temperature: 22,
  humidity: 65,
  light: 85,
  soilMoisture: 70
};

const AIFeatures = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(mockChat);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    problem: string;
    confidence: number;
    solution: string;
    severity: 'low' | 'medium' | 'high';
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { sender: "user", message: chatMessage }]);
      // Simulate bot response
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          sender: "bot",
          message: "Merci pour votre question ! GreenBot analyse votre situation et vous répondra bientôt avec des conseils personnalisés."
        }]);
      }, 1000);
      setChatMessage("");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale: 10MB.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setDiagnosticResult(null);
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = [
        {
          problem: "Mildiou détecté",
          confidence: 92,
          solution: "Appliquez un traitement à base de soufre et améliorez la ventilation autour de la plante. Évitez l'arrosage par aspersion.",
          severity: 'high' as const
        },
        {
          problem: "Carence en azote",
          confidence: 87,
          solution: "Utilisez un engrais riche en azote ou ajoutez du compost organique. Les feuilles jaunissent généralement par manque d'azote.",
          severity: 'medium' as const
        },
        {
          problem: "Pucerons présents",
          confidence: 95,
          solution: "Traitez avec un savon insecticide ou utilisez des huiles essentielles. Les pucerons sont visibles à l'œil nu sur les jeunes pousses.",
          severity: 'medium' as const
        },
        {
          problem: "Plante en bonne santé",
          confidence: 88,
          solution: "Continuez vos bonnes pratiques ! Votre plante semble en excellente forme.",
          severity: 'low' as const
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setDiagnosticResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosticResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    const checkSpeechRecognitionSupport = () => {
      // Check for different browser implementations
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        try {
          const recognitionInstance = new SpeechRecognitionAPI();
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false;
          recognitionInstance.lang = 'fr-FR'; // French language

          recognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setChatMessage(transcript);
            setIsRecording(false);
          };

          recognitionInstance.onend = () => {
            setIsRecording(false);
          };

          recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
            let errorMessage = 'Erreur de reconnaissance vocale.';
            switch (event.error) {
              case 'not-allowed':
                errorMessage += ' Permission du microphone refusée. Veuillez autoriser l\'accès au microphone.';
                break;
              case 'no-speech':
                errorMessage += ' Aucun discours détecté. Essayez de parler plus fort.';
                break;
              case 'network':
                errorMessage += ' Erreur réseau. Vérifiez votre connexion internet.';
                break;
              default:
                errorMessage += ' Vérifiez les permissions du microphone.';
            }
            alert(errorMessage);
          };

          setRecognition(recognitionInstance);
        } catch (error) {
          console.error('Failed to initialize speech recognition:', error);
          setRecognition(null);
        }
      } else {
        console.warn('Speech Recognition API not supported in this browser');
        setRecognition(null);
      }
    };

    checkSpeechRecognitionSupport();
  }, []);

  const handleMicClick = () => {
    if (!recognition) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                GreenBot
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
              Assistant IA pour le Jardinage Urbain
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Découvrez comment l'intelligence artificielle révolutionne votre expérience de jardinage.
              Diagnostics automatiques, conseils personnalisés et prédictions intelligentes pour des récoltes abondantes.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Commencer avec l'IA
            </Button>
          </div>
        </div>
      </section>

      {/* AI Features Overview */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Capacités d'Intelligence Artificielle
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Six fonctionnalités puissantes pour transformer votre jardinage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Diagnostic */}
      <section className="container py-20 bg-secondary/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Diagnostic Interactif
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Téléchargez une photo de votre plante pour obtenir un diagnostic instantané
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!selectedFile ? (
            <Card
              className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-8 text-center">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Glissez-déposez votre image ici</h3>
                <p className="text-muted-foreground mb-4">
                  Formats acceptés: JPG, PNG, WEBP (max 10MB)
                </p>
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}>
                  <Upload className="h-4 w-4 mr-2" />
                  Sélectionner un fichier
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Plant preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={removeFile}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{selectedFile.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {isAnalyzing ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Analyse en cours...</span>
                        </div>
                        <Progress value={66} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                          GreenBot examine votre plante avec précision
                        </p>
                      </div>
                    ) : diagnosticResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              diagnosticResult.severity === 'high' ? 'destructive' :
                              diagnosticResult.severity === 'medium' ? 'secondary' : 'default'
                            }
                          >
                            {diagnosticResult.problem}
                          </Badge>
                          <Badge variant="outline">
                            {diagnosticResult.confidence}% confiance
                          </Badge>
                        </div>
                        <p className="text-sm">{diagnosticResult.solution}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setDiagnosticResult(null);
                          }}
                        >
                          Analyser une autre photo
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => processFile(selectedFile)}>
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Lancer le diagnostic
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Chat Interface */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Chat avec GreenBot
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Posez vos questions à notre assistant IA spécialisé en jardinage urbain
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="h-96 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Conversation avec GreenBot
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Posez votre question sur le jardinage..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Mic
                  className={`h-6 w-6 cursor-pointer mt-2 transition-colors ${
                    isRecording
                      ? 'text-red-500 animate-pulse'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={handleMicClick}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Diagnostic Gallery */}
      <section className="container py-20 bg-secondary/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Exemples de Diagnostics Réussis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment GreenBot a aidé d'autres jardiniers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagnosticExamples.map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-4 p-4">
                <div>
                  <img src={example.before} alt="Avant" className="w-full h-32 object-cover rounded" />
                  <p className="text-sm text-muted-foreground mt-2">Avant</p>
                </div>
                <div>
                  <img src={example.after} alt="Après" className="w-full h-32 object-cover rounded" />
                  <p className="text-sm text-muted-foreground mt-2">Après traitement</p>
                </div>
              </div>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="destructive">{example.problem}</Badge>
                  <Badge variant="secondary">{example.confidence}% confiance</Badge>
                </div>
                <p className="text-sm">{example.solution}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* IoT Data Section */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Données IoT et Prédictions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyse en temps réel de vos capteurs pour des recommandations optimales
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{iotData.temperature}°C</div>
              <p className="text-sm text-muted-foreground">Température</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{iotData.humidity}%</div>
              <p className="text-sm text-muted-foreground">Humidité</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{iotData.light}%</div>
              <p className="text-sm text-muted-foreground">Luminosité</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Droplets className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{iotData.soilMoisture}%</div>
              <p className="text-sm text-muted-foreground">Humidité du sol</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Yield Optimization */}
      <section className="container py-20 bg-secondary/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Optimisation des Rendements
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Améliorez vos récoltes grâce aux conseils de l'IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">+35%</div>
              <p className="text-sm text-muted-foreground">Augmentation des rendements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">92%</div>
              <p className="text-sm text-muted-foreground">Taux de succès des diagnostics</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-600">-60%</div>
              <p className="text-sm text-muted-foreground">Réduction des pertes</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prêt à Révolutionner Votre Jardinage ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Rejoignez des milliers de jardiniers urbains qui utilisent déjà GreenBot pour des récoltes exceptionnelles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/signup" className="w-full">
              Commencer avec GreenBot
            </Link>
            </Button>
            <Button size="lg" variant="outline">
              Télécharger l'App Mobile
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default AIFeatures;
