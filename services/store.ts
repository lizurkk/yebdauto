
import { PERMIS_CATALOG, PRICING_PACKS, SCHOOL_INFO, LICENSE_PROCESS, FAQ_DATA, TESTIMONIALS, CORE_VALUES, RESOURCE_LINKS, STATS, DOSSIER_ITEMS } from '../constants';
import { vehicles as initialVehicles, initialStudents, instructors as initialInstructors, initialFinance } from './mockData';
import { loadStore as loadFirestoreStore, fsSet } from './firestoreStore';

const STORE_KEYS = {
  BRANDING: 'yebda_branding',
  PERMIS: 'yebda_permis_catalog',
  PRICING: 'yebda_pricing_packs',
  SCHOOL: 'yebda_school_info',
  PROCESS: 'yebda_license_process',
  FAQ: 'yebda_faq_data',
  TESTIMONIALS: 'yebda_testimonials_data',
  VALUES: 'yebda_values_data',
  RESOURCES: 'yebda_resources_data',
  HERO: 'yebda_hero_data',
  STATS: 'yebda_stats_data',
  SOCIAL: 'yebda_social_data',
  DOSSIER: 'yebda_dossier_data',
  PAGE_HEADERS: 'yebda_page_headers',
  PRICE_VISIBILITY: 'yebda_price_visibility',
  PLANNING: 'yebda_planning_config',
  LEADS: 'yebda_leads_data'
};

const DEFAULT_BRANDING = {
  primaryColor: '#00ADB5',
  fontFamily: 'Inter',
  buttonShape: 'rounded-full',
  cardShape: 'rounded-[45px]'
};

const DEFAULT_HERO = {
  title: "Maîtrisez la route à nos côtés.",
  highlight: "à nos côtés.",
  subtitle: "Formation certifiée, moniteurs agréés et accompagnement personnalisé à Bab Azzouar pour votre réussite totale et votre sécurité.",
  trustText: "Plus de 2000 candidats formés avec succès depuis 2012."
};

const DEFAULT_PAGE_HEADERS = {
  formations: {
    title: "Obtenez votre Indépendance.",
    highlight: "Indépendance.",
    subtitle: "Découvrez nos programmes de permis B, Moto et nos cours de perfectionnement sur mesure pour conducteurs déjà détenteurs du permis."
  },
  tarifs: {
    title: "Financez votre Réussite.",
    highlight: "Réussite.",
    subtitle: "Paiement comptant ou par tranches, trouvez la formule adaptée à votre budget sans compromis sur la qualité."
  },
  procedure: {
    title: "Votre Parcours de Candidat.",
    highlight: "Candidat.",
    subtitle: "De l'inscription à l'obtention du précieux sésame, voici les 4 étapes fondamentales de votre formation chez Yebda."
  },
  contact: {
    title: "Parlons de votre Avenir.",
    highlight: "Avenir.",
    subtitle: "Une question ? Une inscription ? Notre équipe vous répond à Bab Azzouar. N'hésitez pas à nous solliciter."
  }
};

const DEFAULT_SOCIAL = {
  facebook: "https://facebook.com/yebda-auto-ecole",
  instagram: "https://instagram.com/yebda_autoecole",
  whatsapp: "https://wa.me/213559067441"
};

const DEFAULT_PLANNING_CONFIG = {
  timeSlots: ['07:45', '08:30', '09:15', '10:00', '10:45', '11:30', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15', '19:00'],
  rowColors: ['#E3F2FD', '#F3E5F5', '#E8F5E8', '#FFF3E0', '#FCE4EC', '#E0F2F1', '#F9FBE7', '#F5F5F5', '#EDE7F6', '#FFF8E1', '#FCE4EC', '#E8EAF6', '#F1F8E9', '#FAFAFA', '#E1F5FE', '#FBE9E7'],
  closedDays: ['Vendredi']
};

export const getStore = () => {
  const get = (key: string, def: any) => {
    const val = localStorage.getItem(key);
    if (!val) return def;

    try {
      return JSON.parse(val);
    } catch (error) {
      console.warn(`LocalStorage parse failed for key: ${key}. Resetting to default.`, error);
      localStorage.removeItem(key);
      return def;
    }
  };

  return {
    branding: get(STORE_KEYS.BRANDING, DEFAULT_BRANDING),
    permis: get(STORE_KEYS.PERMIS, PERMIS_CATALOG),
    pricing: get(STORE_KEYS.PRICING, PRICING_PACKS),
    school: get(STORE_KEYS.SCHOOL, SCHOOL_INFO),
    process: get(STORE_KEYS.PROCESS, LICENSE_PROCESS),
    faq: get(STORE_KEYS.FAQ, FAQ_DATA),
    testimonials: get(STORE_KEYS.TESTIMONIALS, TESTIMONIALS),
    values: get(STORE_KEYS.VALUES, CORE_VALUES),
    resources: get(STORE_KEYS.RESOURCES, RESOURCE_LINKS),
    hero: get(STORE_KEYS.HERO, DEFAULT_HERO),
    stats: get(STORE_KEYS.STATS, STATS),
    social: get(STORE_KEYS.SOCIAL, DEFAULT_SOCIAL),
    dossier: get(STORE_KEYS.DOSSIER, DOSSIER_ITEMS),
    pageHeaders: get(STORE_KEYS.PAGE_HEADERS, DEFAULT_PAGE_HEADERS),
    showPrices: get(STORE_KEYS.PRICE_VISIBILITY, false),
    planning: get(STORE_KEYS.PLANNING, DEFAULT_PLANNING_CONFIG),
    leads: get(STORE_KEYS.LEADS, []),
    students: get('yebda_students', initialStudents),
    instructors: get('yebda_instructors', initialInstructors),
    vehicles: get('yebda_vehicles', initialVehicles),
    finance: get('yebda_finance', initialFinance)
  };
};

export const updateStore = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  fsSet(key, data).catch((error) => {
    console.error(`Failed to sync ${key} to Firebase:`, error);
  });
  window.dispatchEvent(new Event('storage_update'));
};

export const syncToFirebase = async () => {
  const store = getStore();
  const keys = Object.keys(store) as (keyof typeof store)[];
  const promises = keys.map(key => fsSet(key, store[key]));
  await Promise.all(promises);
  console.log('All local data synced to Firebase');
};

export const loadRemoteStore = async () => {
  try {
    const remoteStore = await loadFirestoreStore();
    Object.entries(remoteStore).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    window.dispatchEvent(new Event('storage_update'));
    return remoteStore;
  } catch (error) {
    console.error('Failed to load remote store from Firebase:', error);
    return null;
  }
};

export const syncLocalStoreToFirestore = async () => {
  const store = getStore();
  const entries = Object.entries(store);
  try {
    await Promise.all(entries.map(([key, value]) => fsSet(key, value)));
    window.dispatchEvent(new Event('storage_update'));
    return store;
  } catch (error) {
    console.error('Failed to sync local store to Firebase:', error);
    throw error;
  }
};

export const updateBranding = (d: any) => updateStore(STORE_KEYS.BRANDING, d);
export const updateHero = (d: any) => updateStore(STORE_KEYS.HERO, d);
export const updatePageHeaders = (d: any) => updateStore(STORE_KEYS.PAGE_HEADERS, d);
export const updatePermis = (d: any) => updateStore(STORE_KEYS.PERMIS, d);
export const updatePricing = (d: any) => updateStore(STORE_KEYS.PRICING, d);
export const updateSchool = (d: any) => updateStore(STORE_KEYS.SCHOOL, d);
export const updateProcess = (d: any) => updateStore(STORE_KEYS.PROCESS, d);
export const updateFaq = (d: any) => updateStore(STORE_KEYS.FAQ, d);
export const updateTestimonials = (d: any) => updateStore(STORE_KEYS.TESTIMONIALS, d);
export const updateValues = (d: any) => updateStore(STORE_KEYS.VALUES, d);
export const updateSocial = (d: any) => updateStore(STORE_KEYS.SOCIAL, d);
export const updateDossier = (d: any) => updateStore(STORE_KEYS.DOSSIER, d);
export const updateStats = (d: any) => updateStore(STORE_KEYS.STATS, d);
export const updateResources = (d: any) => updateStore(STORE_KEYS.RESOURCES, d);
export const updatePlanning = (d: any) => updateStore(STORE_KEYS.PLANNING, d);
export const updateShowPrices = (d: any) => updateStore(STORE_KEYS.PRICE_VISIBILITY, d);
export const updateLeads = (d: any) => updateStore(STORE_KEYS.LEADS, d);
export const updateStudents = (d: any) => updateStore('yebda_students', d);
export const updateInstructors = (d: any) => updateStore('yebda_instructors', d);
export const updateVehicles = (d: any) => updateStore('yebda_vehicles', d);
export const updateFinance = (d: any) => updateStore('yebda_finance', d);
