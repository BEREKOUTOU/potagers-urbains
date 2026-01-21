import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sprout, Menu } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextBase";
import { useState } from "react";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium transition-colors text-primary border-b-2 border-primary pb-0.5"
                : "text-sm font-medium transition-colors text-foreground hover:text-primary"
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/mes-jardins"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium transition-colors text-primary border-b-2 border-primary pb-0.5"
                : "text-sm font-medium transition-colors text-foreground hover:text-primary"
            }
          >
            Mes Jardins
          </NavLink>
          <NavLink
            to="/communaute"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium transition-colors text-primary border-b-2 border-primary pb-0.5"
                : "text-sm font-medium transition-colors text-foreground hover:text-primary"
            }
          >
            Communauté
          </NavLink>
          <NavLink
            to="/ressources"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium transition-colors text-primary border-b-2 border-primary pb-0.5"
                : "text-sm font-medium transition-colors text-foreground hover:text-primary"
            }
          >
            Ressources
          </NavLink>
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium transition-colors text-primary border-b-2 border-primary pb-0.5"
                : "text-sm font-medium transition-colors text-foreground hover:text-primary"
            }
          >
            Profil
          </NavLink>
        </nav>

        <div className="hidden md:flex">
          {isAuthenticated ? (
            <Button onClick={logout}>Déconnexion</Button>
          ) : (
            <Link to="/connexion">
              <Button>Connexion</Button>
            </Link>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Bienvenue sur Jardins Connectés</SheetDescription>
            <nav className="flex flex-col gap-4 mt-8">
              <NavLink
                to="/"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                Accueil
              </NavLink>
              <NavLink
                to="/mes-jardins"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                Mes Jardins
              </NavLink>
              <NavLink
                to="/communaute"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                Communauté
              </NavLink>
              <NavLink
                to="/ressources"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                Ressources
              </NavLink>
              <NavLink
                to="/profil"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                Profil
              </NavLink>
            </nav>
            <div className="mt-8">
              {isAuthenticated ? (
                <Button onClick={() => { logout(); setIsOpen(false); }}>Déconnexion</Button>
              ) : (
                <Link to="/connexion" onClick={() => setIsOpen(false)}>
                  <Button>Connexion</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
