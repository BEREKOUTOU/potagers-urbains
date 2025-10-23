import { Sprout, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Jardins Connectés</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              La plateforme intelligente pour gérer vos potagers urbains et jardins partagés.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Aide & Support</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mentions légales</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">CGU</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recevez nos conseils et actualités
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="votre@email.com"
                className="bg-background"
              />
              <Button size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Jardins Connectés. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
