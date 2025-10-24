import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DashboardCards from "@/components/DashboardCards";
import FeaturesSection from "@/components/FeaturesSection";
import GardensGrid from "@/components/GardensGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <DashboardCards />
        <FeaturesSection />
        <GardensGrid />
        <TestimonialsSection />
        <StatsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
