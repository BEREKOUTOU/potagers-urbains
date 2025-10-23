import garden1 from '../assets/garden-01.jpg';
import garden2 from '../assets/garden-02.jpg';
import garden3 from '../assets/garden-03.jpg';
import garden4 from '../assets/garden-04.jpg';
import garden5 from '../assets/garden-05.jpg';
import garden6 from '../assets/garden-06.jpg';

export type Garden = {
  id: number;
  name: string;
  location: string;
  members: number;
  maxMembers: number;
  crops: readonly string[];
  features: readonly string[];
  rating: number;
  image?: string;
  description?: string;
};

export const gardens: readonly Garden[] = [
  {
    id: 1,
    name: "Jardin du Marais",
    location: "15 rue Cardinet, 75017 Paris",
    members: 12,
    maxMembers: 15,
    crops: ["Légumes", "Herbes"],
    features: ["Bio", "Permaculture"],
    rating: 4.8,
    image: garden1,
    description: "Jardin communautaire en plein cœur du Marais, spécialisé dans les légumes anciens."
  },
  {
    id: 2,
    name: "Balcon Vert Belleville",
    location: "32 rue de Belleville, 75020 Paris",
    members: 8,
    maxMembers: 10,
    crops: ["Herbes", "Fleurs"],
    features: ["Urbain", "Éducatif"],
    rating: 4.6,
    image: garden2,
    description: "Espace de jardinage partagé sur les toits de Belleville."
  },
  {
    id: 3,
    name: "Potager des Buttes",
    location: "8 place de la République, 75011 Paris",
    members: 15,
    maxMembers: 15,
    crops: ["Légumes", "Fruits"],
    features: ["Familial", "Bio"],
    rating: 4.9,
    image:  garden3,
    description: "Grand potager communautaire avec verger et compost collectif."
  },
  {
    id: 4,
    name: "Jardin des Lilas",
    location: "45 rue des Abbesses, 75018 Paris",
    members: 12,
    maxMembers: 15,
    crops: ["Légumes", "Herbes"],
    features: ["Bio", "Permaculture"],
    rating: 4.8,
    image: garden4,
    description: "Jardin communautaire en plein cœur du Marais, spécialisé dans les légumes anciens."
  },
  {
    id: 5,
    name: "Balcon Vert Belleville",
    location: "12 rue des Rosiers, 75004 Paris",
    members: 8,
    maxMembers: 10,
    crops: ["Herbes", "Fleurs"],
    features: ["Urbain", "Éducatif"],
    rating: 4.6,
    image: garden5,
    description: "Espace de jardinage partagé sur les toits de Belleville."
  },
  {
    id: 6,
    name: "Potager des Buttes",
    location: "28 avenue des Gobelins, 75013 Paris",
    members: 15,
    maxMembers: 15,
    crops: ["Légumes", "Fruits"],
    features: ["Familial", "Bio"],
    rating: 4.9,
    image: garden6,
    description: "Grand potager communautaire avec verger et compost collectif."
  },
  {
    id: 7,
    name: "Potager de Belleville",
    location: "Paris 20ème",
    members: 18,
    maxMembers: 20,
    crops: ["Légumes", "Herbes aromatiques", "Fleurs"],
    features: ["Bio", "Accessible", "Outils fournis"],
    rating: 4.7,
    image: garden6,
    description: "Jardin urbain communautaire dédié au jardinage durable et à la permaculture, avec serre, composteur et récupérateur d'eau de pluie."
  },
  {
    id: 8,
    name: "Jardin Partagé République",
    location: "Place de la République, 75011 Paris",
    members: 14,
    maxMembers: 16,
    crops: ["Légumes", "Herbes aromatiques", "Fruits"],
    features: ["Bio", "IoT", "Communautaire"],
    rating: 4.9,
    image: garden4,
    description: "Jardin communautaire moderne avec capteurs IoT pour monitoring en temps réel de la température, humidité et pH du sol."
  }
] as const;
