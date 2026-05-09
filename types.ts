export enum FormationType {
  CODE = 'Code Théorique',
  CRENEAU = 'Créneau (Parking)',
  CONDUITE = 'Conduite (Circulation)',
  PERFECTIONNEMENT = 'Perfectionnement',
  COMPLET = 'Formation Complète'
}

export type PaymentMethod = 'Cash';

export interface ProgressSkill {
  id: string;
  label: string;
  completed: boolean;
  category: 'Bases' | 'Manoeuvres' | 'Circulation' | 'Avancé';
}

export interface Student {
  id: string;
  name: string;
  age: number;
  cin: string;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
  formation: FormationType;
  transmission: 'Manuel';
  paidAmount: number;
  totalAmount: number;
  status: 'active' | 'graduated' | 'dropped';
  instructorId?: string;
  progress?: ProgressSkill[];
}

export interface Instructor {
  id: string;
  name: string;
  licenseNumber: string;
  specialty: 'Code' | 'Pratique' | 'Mixte';
  phone: string;
  experience: string;
  avatar: string;
  availability: string;
  assignedStudents: string[];
  email?: string;
  address?: string;
  bio?: string;
  rating?: number;
  totalStudents?: number;
  successRate?: number;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  fuelType: 'Essence' | 'Diesel' | 'GPL';
  transmission: 'Manuel';
  status: 'available' | 'maintenance' | 'in_use';
  lastMaintenance: string;
  nextMaintenanceDate: string;
  insuranceExpiry: string;
  technicalControlExpiry: string;
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  desiredFormation: FormationType;
  message?: string;
  date: string;
  status: 'pending' | 'contacted' | 'converted' | 'rejected';
}

export interface Transaction {
  id: string;
  date: string;
  studentId?: string;
  person: string;
  type: string;
  paymentMode: 'Plein' | 'Tranche';
  method: PaymentMethod;
  numeric: number;
  amount: string;
}

export interface Lesson {
  id: string;
  studentId: string;
  instructorId: string;
  vehicleId?: string;
  type: 'Code' | 'Créneau' | 'Conduite' | 'Perfectionnement';
  day: string;
  time: string;
  weekOffset: number;
}