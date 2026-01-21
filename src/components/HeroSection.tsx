import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-background/0 to-background/10" />
      </div>
      
      <div className="container relative z-10 text-center px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Gérez vos potagers urbains intelligemment
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
          Connectez vos jardins, suivez vos cultures en temps réel et rejoignez une communauté passionnée d'agriculture urbaine
        </p>
        <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 flex-wrap">
          <Link to="/inscription">
            <AnimatedButton
              className="bg-green-500 text-white "
              variant="default"
              size="default"
              glow={true}
              textEffect="normal"
              uppercase={true}
              rounded="custom"
              asChild={false}
              hideAnimations={false}
              shimmerColor="#39FF14"
              shimmerSize="0.15em"
              shimmerDuration="3s"
              borderRadius="50px"
              background="rgba(34, 197, 94, 1)"
            >
              Commencer maintenant
            </AnimatedButton>
          </Link>
          <Link to="/decouvrir-jardins">
            <AnimatedButton
              className="bg-transparent text-white rounded-sm border border-white hover:bg-white hover:text-black"
              variant="default"
              size="default"
              glow={false}
              textEffect="normal"
              uppercase={true}
              rounded="custom"
              asChild={false}
              hideAnimations={false}
              shimmerColor="#FFFFFF"
              shimmerSize="0.15em"
              shimmerDuration="3s"
              borderRadius="50px"
              background="rgba(0, 0, 0, 0)"
            >
              Découvrir les jardins
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
