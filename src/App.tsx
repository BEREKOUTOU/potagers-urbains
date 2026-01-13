import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const MyGardens = lazy(() => import("./pages/MyGardens"));
const Community = lazy(() => import("./pages/Community"));
const Resources = lazy(() => import("./pages/Resources"));
const Profile = lazy(() => import("./pages/Profile"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const DiscoverGardens = lazy(() => import("./pages/DiscoverGardens"));
const JoinGarden = lazy(() => import("./pages/JoinGarden"));
const GardenDetails = lazy(() => import("./pages/GardenDetails"));
const AIFeatures = lazy(() => import("./pages/AIFeatures"));
const NewDiscussion = lazy(() => import("./pages/NewDiscussion"));
const AddNewGarden = lazy(() => import("./pages/AddNewGarden"));
const EditGarden = lazy(() => import("./pages/EditGarden"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GardenStats = lazy(() => import("./pages/GardenStats"));
const PersonalGardenDetails = lazy(() => import("./pages/PersonalGardenDetails"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const SharePhoto = lazy(() => import("./pages/SharePhoto"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mes-jardins" element={
                <ProtectedRoute>
                  <MyGardens />
                </ProtectedRoute>
              } />
              <Route path="/mes-jardins/details/:id" element={
                <ProtectedRoute>
                  <PersonalGardenDetails />
                </ProtectedRoute>
              } />
              <Route path="/mes-jardins/stats/:id" element={
                <ProtectedRoute>
                  <GardenStats />
                </ProtectedRoute>
              } />
              <Route path="/mes-jardins/ajouter" element={
                <ProtectedRoute>
                  <AddNewGarden />
                </ProtectedRoute>
              } />
              <Route path="/mes-jardins/editer/:id" element={
                <ProtectedRoute>
                  <EditGarden />
                </ProtectedRoute>
              } />
              <Route path="/communaute" element={<Community />} />
              <Route path="/communaute/nouvelle-discussion" element={
                <ProtectedRoute>
                  <NewDiscussion />
                </ProtectedRoute>
              } />
              <Route path="/communaute/partager-photo" element={
                <ProtectedRoute>
                  <SharePhoto />
                </ProtectedRoute>
              } />
              <Route path="/ressources" element={<Resources />} />
              <Route path="/guide/:title" element={<GuideDetail />} />
              <Route path="/evenements/creer" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/profil" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/inscription" element={<Signup />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/decouvrir-jardins" element={<DiscoverGardens />} />
              <Route path="/rejoindre-jardin/:id" element={<JoinGarden />} />
              <Route path="/jardin/:id" element={<GardenDetails />} />
              <Route path="/jardin-stats/:id" element={<GardenStats />} />
              <Route path="/ia-fonctionnalites" element={<AIFeatures />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
