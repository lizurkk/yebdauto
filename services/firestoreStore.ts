import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PERMIS_CATALOG, PRICING_PACKS, SCHOOL_INFO, LICENSE_PROCESS, FAQ_DATA, TESTIMONIALS, CORE_VALUES, RESOURCE_LINKS, STATS, DOSSIER_ITEMS } from '../constants';
import { vehicles as initialVehicles, initialStudents, instructors as initialInstructors, initialFinance } from './mockData';

const COLLECTION = 'store';

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
  formations: { title: "Obtenez votre Indépendance.", highlight: "Indépendance.", subtitle: "Découvrez nos programmes de permis B, Moto et nos cours de perfectionnement sur mesure." },
  tarifs: { title: "Financez votre Réussite.", highlight: "Réussite.", subtitle: "Paiement comptant ou par tranches, trouvez la formule adaptée à votre budget." },
  procedure: { title: "Votre Parcours de Candidat.", highlight: "Candidat.", subtitle: "De l'inscription à l'obtention du précieux sésame, voici les 4 étapes fondamentales." },
  contact: { title: "Parlons de votre Avenir.", highlight: "Avenir.", subtitle: "Une question ? Une inscription ? Notre équipe vous répond à Bab Azzouar." }
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

const DEFAULTS: Record<string, any> = {
  yebda_branding: DEFAULT_BRANDING,
  yebda_permis_catalog: PERMIS_CATALOG,
  yebda_pricing_packs: PRICING_PACKS,
  yebda_school_info: SCHOOL_INFO,
  yebda_license_process: LICENSE_PROCESS,
  yebda_faq_data: FAQ_DATA,
  yebda_testimonials_data: TESTIMONIALS,
  yebda_values_data: CORE_VALUES,
  yebda_resources_data: RESOURCE_LINKS,
  yebda_hero_data: DEFAULT_HERO,
  yebda_stats_data: STATS,
  yebda_social_data: DEFAULT_SOCIAL,
  yebda_dossier_data: DOSSIER_ITEMS,
  yebda_page_headers: DEFAULT_PAGE_HEADERS,
  yebda_price_visibility: false,
  yebda_planning_config: DEFAULT_PLANNING_CONFIG,
  yebda_leads_data: [],
  yebda_students: initialStudents,
  yebda_instructors: initialInstructors,
  yebda_vehicles: initialVehicles,
  yebda_finance: initialFinance
};

const isReactElement = (value: any) => (
  typeof value === 'object' &&
  value !== null &&
  Object.prototype.hasOwnProperty.call(value, '$$typeof')
);

const sanitizeFirestoreValue = (value: any): any => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return value.map((item) => {
      const sanitized = sanitizeFirestoreValue(item);
      return sanitized === undefined ? null : sanitized;
    });
  }
  if (isReactElement(value)) {
    return undefined;
  }
  if (typeof value === 'object') {
    const sanitizedObject: Record<string, any> = {};
    Object.entries(value).forEach(([key, child]) => {
      const sanitizedChild = sanitizeFirestoreValue(child);
      if (sanitizedChild !== undefined) {
        sanitizedObject[key] = sanitizedChild;
      }
    });
    return sanitizedObject;
  }
  return undefined;
};

// ── Read a single document from Firestore ──
export const fsGet = async (key: string) => {
  const ref = doc(db, COLLECTION, key);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().value : DEFAULTS[key];
};

// ── Write a single document to Firestore ──
export const fsSet = async (key: string, value: any) => {
  const ref = doc(db, COLLECTION, key);
  const sanitizedValue = sanitizeFirestoreValue(value);
  await setDoc(ref, { value: sanitizedValue === undefined ? null : sanitizedValue });
  window.dispatchEvent(new Event('storage_update'));
};

// ── Load the full store from Firestore ──
export const loadStore = async () => {
  const keys = Object.keys(DEFAULTS);
  const results = await Promise.all(keys.map((k) => fsGet(k)));
  const store: Record<string, any> = {};
  keys.forEach((k, i) => { store[k] = results[i]; });
  return store;
};

// ── Update helpers — same names as your existing store ──
export const updateBranding    = (d: any) => fsSet('yebda_branding', d);
export const updateHero        = (d: any) => fsSet('yebda_hero_data', d);
export const updatePageHeaders = (d: any) => fsSet('yebda_page_headers', d);
export const updatePermis      = (d: any) => fsSet('yebda_permis_catalog', d);
export const updatePricing     = (d: any) => fsSet('yebda_pricing_packs', d);
export const updateSchool      = (d: any) => fsSet('yebda_school_info', d);
export const updateProcess     = (d: any) => fsSet('yebda_license_process', d);
export const updateFaq         = (d: any) => fsSet('yebda_faq_data', d);
export const updateTestimonials= (d: any) => fsSet('yebda_testimonials_data', d);
export const updateValues      = (d: any) => fsSet('yebda_values_data', d);
export const updateSocial      = (d: any) => fsSet('yebda_social_data', d);
export const updateDossier     = (d: any) => fsSet('yebda_dossier_data', d);
export const updateStats       = (d: any) => fsSet('yebda_stats_data', d);
export const updateResources   = (d: any) => fsSet('yebda_resources_data', d);
export const updatePlanning    = (d: any) => fsSet('yebda_planning_config', d);
export const updateShowPrices  = (d: any) => fsSet('yebda_price_visibility', d);
export const updateLeads       = (d: any) => fsSet('yebda_leads_data', d);
export const updateStudents    = (d: any) => fsSet('yebda_students', d);
export const updateInstructors = (d: any) => fsSet('yebda_instructors', d);
export const updateVehicles    = (d: any) => fsSet('yebda_vehicles', d);
export const updateFinance     = (d: any) => fsSet('yebda_finance', d);
