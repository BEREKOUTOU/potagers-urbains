import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextBase";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Jardins Connectés</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary"
              }`
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/mes-jardins"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary"
              }`
            }
          >
            Mes Jardins
          </NavLink>
          <NavLink
            to="/communaute"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary"
              }`
            }
          >
            Communauté
          </NavLink>
          <NavLink
            to="/ressources"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary"
              }`
            }
          >
            Ressources
          </NavLink>
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? "text-primary border-b-2 border-primary pb-0.5" : "text-foreground hover:text-primary"
              }`
            }
          >
            Profil
          </NavLink>
        </nav>

        {isAuthenticated ? (
          <Button onClick={logout}>Déconnexion</Button>
        ) : (
          <Link to="/connexion">
            <Button>Connexion</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
