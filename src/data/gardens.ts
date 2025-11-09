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
  region: string;
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
    region: "Île-de-France",
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
    region: "Île-de-France",
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
    region: "Île-de-France",
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
    region: "Île-de-France",
    members: 12,
    maxMembers: 15,
    crops: ["Légumes", "Herbes"],
    features: ["Bio", "Permaculture"],
    rating: 4.8,
    image: garden4,
    description: "Jardin communautaire en plein cœur du Marais, spécialisé dans les légumes anciens."
  },
  // L'île-de-France
  {
    id: 5,
    name: "Balcon Vert Belleville",
    location: "12 rue des Rosiers, 75004 Paris",
    region: "Île-de-France",
    members: 8,
    maxMembers: 10,
    crops: ["Herbes", "Fleurs"],
    features: ["Urbain", "Éducatif"],
    rating: 4.6,
    image: garden5,
    description: "Espace de jardinage partagé sur les toits de Belleville."
  },
  // L'île-de-France
  {
    id: 6,
    name: "Potager des Buttes",
    location: "28 avenue des Gobelins, 75013 Paris",
    region: "Île-de-France",
    members: 15,
    maxMembers: 15,
    crops: ["Légumes", "Fruits"],
    features: ["Familial", "Bio"],
    rating: 4.9,
    image: garden6,
    description: "Grand potager communautaire avec verger et compost collectif."
  },
  // Paris
  {
    id: 7,
    name: "Potager de Belleville",
    location: "Paris 20ème",
    region: "Île-de-France",
    members: 18,
    maxMembers: 20,
    crops: ["Légumes", "Herbes aromatiques", "Fleurs"],
    features: ["Bio", "Accessible", "Outils fournis"],
    rating: 4.7,
    image: garden6,
    description: "Jardin urbain communautaire dédié au jardinage durable et à la permaculture, avec serre, composteur et récupérateur d'eau de pluie."
  },
  // Île-de-France
  {
    id: 8,
    name: "Jardin Partagé République",
    location: "Place de la République, 75011 Paris",
    region: "Île-de-France",
    members: 14,
    maxMembers: 16,
    crops: ["Légumes", "Herbes aromatiques", "Fruits"],
    features: ["Bio", "IoT", "Communautaire"],
    rating: 4.9,
    image: garden4,
    description: "Jardin communautaire moderne avec capteurs IoT pour monitoring en temps réel de la température, humidité et pH du sol."
  },
  // Auvergne-Rhône-Alpes
  {
    id: 9,
    name: "Jardin des Alpes",
    location: "Grenoble, Isère",
    region: "Auvergne-Rhône-Alpes",
    members: 10,
    maxMembers: 12,
    crops: ["Légumes", "Fruits"],
    features: ["Bio", "Montagne"],
    rating: 4.7,
    image: garden1,
    description: "Jardin alpin avec cultures adaptées au climat montagnard."
  },
  {
    id: 10,
    name: "Potager Lyonnais",
    location: "Lyon, Rhône",
    region: "Auvergne-Rhône-Alpes",
    members: 16,
    maxMembers: 18,
    crops: ["Herbes", "Légumes"],
    features: ["Urbain", "Éducatif"],
    rating: 4.8,
    image: garden2,
    description: "Espace de jardinage en centre-ville de Lyon."
  },
  // Bourgogne-Franche-Comté
  {
    id: 11,
    name: "Jardin de Dijon",
    location: "Dijon, Côte-d'Or",
    region: "Bourgogne-Franche-Comté",
    members: 12,
    maxMembers: 14,
    crops: ["Légumes", "Vignes"],
    features: ["Bio", "Traditionnel"],
    rating: 4.6,
    image: garden3,
    description: "Jardin traditionnel bourguignon avec vignes."
  },
  // Bretagne
  {
    id: 12,
    name: "Potager Breton",
    location: "Rennes, Ille-et-Vilaine",
    region: "Bretagne",
    members: 14,
    maxMembers: 16,
    crops: ["Légumes", "Herbes"],
    features: ["Bio", "Côtier"],
    rating: 4.9,
    image: garden4,
    description: "Jardin côtier avec légumes bretons typiques."
  },
  // Centre-Val de Loire
  {
    id: 13,
    name: "Jardin d'Orléans",
    location: "Orléans, Loiret",
    region: "Centre-Val de Loire",
    members: 11,
    maxMembers: 13,
    crops: ["Fruits", "Légumes"],
    features: ["Familial", "Bio"],
    rating: 4.7,
    image: garden5,
    description: "Jardin familial près de la Loire."
  },
  // Corse
  {
    id: 14,
    name: "Jardin Corse",
    location: "Ajaccio, Corse-du-Sud",
    region: "Corse",
    members: 9,
    maxMembers: 11,
    crops: ["Herbes aromatiques", "Oliviers"],
    features: ["Méditerranéen", "Bio"],
    rating: 4.8,
    image: garden6,
    description: "Jardin méditerranéen avec plantes corses."
  },
  // Grand Est
  {
    id: 15,
    name: "Potager Alsacien",
    location: "Strasbourg, Bas-Rhin",
    region: "Grand Est",
    members: 13,
    maxMembers: 15,
    crops: ["Légumes", "Choucroute"],
    features: ["Bio", "Culturel"],
    rating: 4.6,
    image: garden1,
    description: "Jardin alsacien avec spécialités locales."
  },
  // Hauts-de-France
  {
    id: 16,
    name: "Jardin du Nord",
    location: "Lille, Nord",
    region: "Hauts-de-France",
    members: 15,
    maxMembers: 17,
    crops: ["Légumes", "Betteraves"],
    features: ["Urbain", "Communautaire"],
    rating: 4.7,
    image: garden2,
    description: "Jardin urbain dans le nord de la France."
  },
  // Normandie
  {
    id: 17,
    name: "Potager Normand",
    location: "Rouen, Seine-Maritime",
    region: "Normandie",
    members: 12,
    maxMembers: 14,
    crops: ["Pommes", "Légumes"],
    features: ["Bio", "Cidre"],
    rating: 4.8,
    image: garden3,
    description: "Jardin normand avec vergers de pommes."
  },
  // Nouvelle-Aquitaine
  {
    id: 18,
    name: "Jardin Bordelais",
    location: "Bordeaux, Gironde",
    region: "Nouvelle-Aquitaine",
    members: 18,
    maxMembers: 20,
    crops: ["Vignes", "Légumes"],
    features: ["Vin", "Bio"],
    rating: 4.9,
    image: garden4,
    description: "Jardin bordelais avec vignes et légumes."
  },
  // Occitanie
  {
    id: 19,
    name: "Potager Toulousain",
    location: "Toulouse, Haute-Garonne",
    region: "Occitanie",
    members: 16,
    maxMembers: 18,
    crops: ["Légumes", "Herbes"],
    features: ["Méditerranéen", "Bio"],
    rating: 4.7,
    image: garden5,
    description: "Jardin méditerranéen à Toulouse."
  },
  // Pays de la Loire
  {
    id: 20,
    name: "Jardin Nantais",
    location: "Nantes, Loire-Atlantique",
    region: "Pays de la Loire",
    members: 14,
    maxMembers: 16,
    crops: ["Légumes", "Muscade"],
    features: ["Urbain", "Éducatif"],
    rating: 4.8,
    image: garden6,
    description: "Jardin urbain nantais."
  },
  // Provence-Alpes-Côte d'Azur
  {
    id: 21,
    name: "Jardin Provençal",
    location: "Marseille, Bouches-du-Rhône",
    region: "Provence-Alpes-Côte d'Azur",
    members: 17,
    maxMembers: 19,
    crops: ["Lavande", "Oliviers"],
    features: ["Méditerranéen", "Bio"],
    rating: 4.9,
    image: garden1,
    description: "Jardin provençal avec plantes aromatiques."
  },
  // Guadeloupe
  {
    id: 22,
    name: "Jardin Créole",
    location: "Pointe-à-Pitre, Guadeloupe",
    region: "Guadeloupe",
    members: 10,
    maxMembers: 12,
    crops: ["Tropicaux", "Épices"],
    features: ["Tropical", "Bio"],
    rating: 4.6,
    image: garden2,
    description: "Jardin tropical guadeloupéen."
  },
  // Guyane
  {
    id: 23,
    name: "Potager Guyanais",
    location: "Cayenne, Guyane",
    region: "Guyane",
    members: 8,
    maxMembers: 10,
    crops: ["Tropicaux", "Fruits"],
    features: ["Équatorial", "Bio"],
    rating: 4.7,
    image: garden3,
    description: "Jardin équatorial en Guyane."
  },
  // Martinique
  {
    id: 24,
    name: "Jardin Martiniquais",
    location: "Fort-de-France, Martinique",
    region: "Martinique",
    members: 11,
    maxMembers: 13,
    crops: ["Bananes", "Ananas"],
    features: ["Tropical", "Bio"],
    rating: 4.8,
    image: garden4,
    description: "Jardin tropical martiniquais."
  },
  // Mayotte
  {
    id: 25,
    name: "Potager Mahorais",
    location: "Mamoudzou, Mayotte",
    region: "Mayotte",
    members: 9,
    maxMembers: 11,
    crops: ["Tropicaux", "Épices"],
    features: ["Insulaire", "Bio"],
    rating: 4.5,
    image: garden5,
    description: "Jardin insulaire à Mayotte."
  },
  // La Réunion
  {
    id: 26,
    name: "Jardin Réunionnais",
    location: "Saint-Denis, La Réunion",
    region: "La Réunion",
    members: 13,
    maxMembers: 15,
    crops: ["Tropicaux", "Vanille"],
    features: ["Volcanique", "Bio"],
    rating: 4.9,
    image: garden6,
    description: "Jardin volcanique réunionnais."
  },
  // Île-de-France
  {
    id: 27,
    name: "Jardin des Batignolles",
    location: "Paris 17ème",
    region: "Île-de-France",
    members: 24,
    maxMembers: 30,
    crops: ["Légumes", "Herbes aromatiques", "Fleurs"],
    features: ["Jardin partagé", "Actif", "Communautaire"],
    rating: 4.8,
    image: garden1,
    description: "Jardin communautaire urbain en plein cœur des Batignolles, dédié au jardinage partagé et à la biodiversité. Espace vert partagé où les habitants cultivent ensemble légumes, herbes et fleurs dans un esprit de convivialité et de respect de l'environnement."
  }
] as const;
