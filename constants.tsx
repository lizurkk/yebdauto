
import React from 'react';
import { 
  ShieldCheck, Car, BookOpen, Clock, Users, 
  Award, Layers, FileText, ClipboardCheck, MapPin, 
  Zap, Smile, Lock, Heart, Bike
} from 'lucide-react';

export const SCHOOL_INFO = {
  name: "Yebda Auto-École",
  location: "Bab Azzouar, Alger",
  phone: "0559 06 74 41",
  email: "contact@yebda-autoecole.dz",
  hours: "Samedi - Jeudi: 08h00 - 18h00",
  address: "Cité 5 Juillet, Bt 12, Bab Azzouar, 16000 Alger",
  gmaps: "https://www.google.com/maps/search/?api=1&query=Yebda+Auto+Ecole+Bab+Azzouar"
};

export const DOSSIER_ITEMS = [
  "Photocopie de la Carte d'Identité Nationale (CNI).",
  "Acte de naissance N°12 original.",
  "Justificatif de domicile (Cité 5 Juillet ou environs).",
  "Certificat médical d'aptitude physique (Ophtalmologue).",
  "Certificat de groupage sanguin.",
  "04 photos d'identité récentes (fond blanc).",
  "Timbre fiscal pour le permis (500 DA).",
  "02 Enveloppes timbrées libellées à votre adresse."
];

export const RESOURCE_LINKS = {
  codeBookUrl: "https://ia803108.us.archive.org/30/items/CodeRouteAlgerie/code%20route%20alg%C3%A9rie.pdf",
};

export const CORE_VALUES = [
  {
    title: "Expertise",
    description: "Des moniteurs qualifiés pour un apprentissage serein et efficace.",
    icon: <Zap size={40} />,
    color: "bg-slate-900",
  },
  {
    title: "Flexibilité",
    description: "Paiement par tranches adapté à votre budget pour chaque module.",
    icon: <Layers size={40} />,
    color: "bg-brand",
  },
  {
    title: "Succès",
    description: "Un accompagnement personnalisé jusqu'à l'obtention du sésame.",
    icon: <Lock size={40} />,
    color: "bg-[#161618]",
  }
];

export const PRICING_PACKS = [
  {
    id: 'module-code',
    title: 'Code Théorique',
    subtitle: 'Théorie & Signalisation',
    priceFull: 15000,
    priceTranche: 7500,
    tranchesCount: 2,
    icon: <BookOpen />,
    features: [
      'Accès salle illimité',
      'Supports pédagogiques',
      'Tests blancs illimités',
      'Examens hebdomadaires'
    ]
  },
  {
    id: 'module-creneau',
    title: 'Manoeuvres',
    subtitle: 'Parking & Précision',
    priceFull: 15000,
    priceTranche: 7500,
    tranchesCount: 2,
    icon: <ClipboardCheck />,
    highlight: true,
    features: [
      'Circuit privé sécurisé',
      'Maîtrise du véhicule',
      'Point de patinage',
      'Mise en situation'
    ]
  },
  {
    id: 'module-conduite',
    title: 'Circulation',
    subtitle: 'Urbaine & Sécurité',
    priceFull: 20000,
    priceTranche: 10000,
    tranchesCount: 2,
    icon: <Car />,
    features: [
      'Conduite en ville',
      'Gestion du trafic',
      'Ronds-points & Priorités',
      'Accompagnement examen'
    ]
  },
  {
    id: 'module-perfectionnement',
    title: 'Perfectionnement',
    subtitle: 'Remise à niveau',
    priceFull: 20000,
    priceTranche: 10000,
    tranchesCount: 2,
    icon: <Award />,
    features: [
      'Séances à la carte',
      'Reprise de confiance',
      'Circulation complexe',
      'Tous types de routes'
    ]
  }
];

export const PERMIS_CATALOG = [
  {
    id: 'permis-b',
    title: 'Permis B (Léger)',
    subtitle: 'Automobile Standard',
    description: 'La formation phare pour maîtriser la conduite d\'un véhicule léger en boîte manuelle ou automatique.',
    image: '',
    price: 45000,
    specs: [
      { label: 'Boîte Manuelle', icon: <Zap size={18}/> },
      { label: 'Boîte Auto dispos', icon: <Layers size={18}/> }
    ]
  },
  {
    id: 'permis-a',
    title: 'Permis A (Moto)',
    subtitle: 'Liberté sur deux roues',
    description: 'Formation spécialisée pour la maîtrise des motocyclettes. Inclut le plateau technique et la circulation urbaine.',
    image: '',
    price: 32000,
    specs: [
      { label: 'Plateau Privé', icon: <MapPin size={18}/> },
      { label: 'Equipement Fourni', icon: <ShieldCheck size={18}/> }
    ]
  },
  {
    id: 'perfectionnement',
    title: 'Perfectionnement',
    subtitle: 'Post-Permis',
    description: 'Pour les conducteurs titulaires du permis souhaitant se remettre à niveau ou gagner en assurance.',
    image: '',
    price: 20000,
    specs: [
      { label: 'Horaire Flexible', icon: <Clock size={18}/> },
      { label: 'Coach Dédié', icon: <Users size={18}/> }
    ]
  }
];

export const LICENSE_PROCESS = [
  {
    title: "Inscription",
    description: "Constitution du dossier administratif et évaluation initiale de vos capacités de conduite.",
    details: ["Dossier administratif complet", "Évaluation de départ", "Planification de formation", "Premier versement (tranche 1)"],
    duration: "1 à 3 jours",
    proTip: "Pensez à votre certificat médical et vos photos dès l'inscription pour gagner du temps."
  },
  {
    title: "Code de la Route",
    description: "Apprentissage intensif des règles de circulation, de la signalisation et de la sécurité routière.",
    details: ["Cours théoriques en salle illimités", "Signalisation horizontale & verticale", "Examens blancs informatisés", "Séances de code accélérées"],
    duration: "3 à 6 semaines",
    proTip: "La régularité est la clé : 3 séances par semaine garantissent une réussite rapide."
  },
  {
    title: "Manoeuvres (Circuit)",
    description: "Maîtrise technique du véhicule en circuit fermé : parking, précision et embrayage.",
    details: ["Maîtrise du point de patinage", "Marche arrière & Slalom", "Créneau & Garage (droite/gauche)", "Démarrage en côte technique"],
    duration: "2 à 4 semaines",
    proTip: "Le calme et la précision sont plus importants que la vitesse sur le circuit technique."
  },
  {
    title: "Circulation Urbaine",
    description: "Mise en situation réelle en milieu urbain pour valider vos réflexes et votre assurance au volant.",
    details: ["Conduite en agglomération dense", "Gestion des ronds-points & priorités", "Conduite sur autoroute & voies rapides", "Examen blanc final"],
    duration: "4 à 8 semaines",
    proTip: "Anticipez le comportement des autres usagers et restez attentif à votre environnement."
  }
];

export const TESTIMONIALS = [
  {
    name: "Mohamed A.",
    date: "Mars 2024",
    rating: 5,
    text: "Excellente école. Les moniteurs sont patients et le paiement par tranches est très pratique."
  },
  {
    name: "Sonia R.",
    date: "Février 2024",
    rating: 5,
    text: "Permis moto obtenu du premier coup ! Super plateau et conseils avisés."
  }
];

export const FAQ_DATA = [
  {
    question: "Quel est l'âge minimum pour s'inscrire ?",
    answer: "Vous pouvez commencer les cours de code à 17 ans, et passer l'examen de conduite dès vos 18 ans révolus."
  },
  {
    question: "Combien de temps dure la formation en moyenne ?",
    answer: "La durée varie selon votre assiduité, mais comptez généralement entre 2 et 4 mois pour un parcours complet."
  },
  {
    question: "Le dossier médical est-il obligatoire ?",
    answer: "Oui, un certificat d'aptitude physique (ophtalmologue) est indispensable pour valider votre dossier administratif."
  }
];

export const STATS = [
  { label: 'Taux de Réussite', value: '94%', icon: <Award className="text-[#00ADB5]"/> },
  { label: 'Moniteurs Experts', value: '3', icon: <Users className="text-[#00ADB5]"/> },
  { label: 'Véhicules Récents', value: '2', icon: <Car className="text-[#00ADB5]"/> },
];
