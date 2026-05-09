
/**
 * YEBDA AUTO-ÉCOLE - DATABASE ARCHITECTURE (PostgreSQL)
 * 
 * --- TABLES SETUP ---
 * 
 * -- 1. Instructors Table
 * CREATE TABLE instructors (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   license_number TEXT UNIQUE,
 *   specialty TEXT CHECK (specialty IN ('Code', 'Pratique', 'Mixte')),
 *   phone TEXT,
 *   experience TEXT,
 *   avatar TEXT,
 *   availability TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- 2. Vehicles Table (BVM Only)
 * CREATE TABLE vehicles (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   model TEXT NOT NULL,
 *   plate TEXT UNIQUE NOT NULL,
 *   fuel_type TEXT CHECK (fuel_type IN ('Essence', 'Diesel', 'GPL')),
 *   transmission TEXT DEFAULT 'Manuel',
 *   status TEXT DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'in_use')),
 *   last_maintenance DATE,
 *   insurance_expiry DATE,
 *   image TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- 3. Students Table
 * CREATE TABLE students (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   cin TEXT UNIQUE NOT NULL,
 *   phone TEXT,
 *   email TEXT,
 *   address TEXT,
 *   registration_date DATE DEFAULT CURRENT_DATE,
 *   formation TEXT,
 *   transmission TEXT DEFAULT 'Manuel',
 *   total_amount NUMERIC DEFAULT 45000,
 *   paid_amount NUMERIC DEFAULT 0,
 *   status TEXT DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'dropped')),
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- 4. Lessons Table (Planning)
 * CREATE TABLE lessons (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   student_id UUID REFERENCES students(id) ON DELETE CASCADE,
 *   instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
 *   vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
 *   type TEXT CHECK (type IN ('Code', 'Créneau', 'Conduite', 'Perfectionnement')),
 *   day TEXT NOT NULL,
 *   time TEXT NOT NULL,
 *   week_offset INTEGER DEFAULT 0,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- 5. Finance Table
 * CREATE TABLE finance (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   date DATE DEFAULT CURRENT_DATE,
 *   student_id UUID REFERENCES students(id) ON DELETE SET NULL,
 *   person_name TEXT, -- Fallback for non-student expenses
 *   category TEXT, -- Module name or Expense type
 *   payment_mode TEXT CHECK (payment_mode IN ('Plein', 'Tranche')),
 *   method TEXT CHECK (method IN ('Cash')),
 *   amount NUMERIC NOT NULL,
 *   is_expense BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- 6. CMS Settings (Site Content)
 * CREATE TABLE cms_settings (
 *   key TEXT PRIMARY KEY,
 *   value JSONB NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

import { getStore, updateInstructors, updateVehicles } from './store';
import { Instructor, Vehicle } from '../types';

const simulateNetwork = () => new Promise(resolve => setTimeout(resolve, 400));

export const db = {
  isRealTime: false, 

  getInstructors: async (): Promise<Instructor[]> => {
    await simulateNetwork();
    return getStore().instructors;
  },

  addInstructor: async (instructor: Instructor) => {
    await simulateNetwork();
    const current = getStore().instructors;
    updateInstructors([instructor, ...current]);
    return instructor;
  },

  updateInstructor: async (updated: Instructor) => {
    await simulateNetwork();
    const current = getStore().instructors;
    updateInstructors(current.map(i => i.id === updated.id ? updated : i));
    return updated;
  },

  deleteInstructor: async (id: string) => {
    await simulateNetwork();
    const current = getStore().instructors;
    updateInstructors(current.filter(i => i.id !== id));
    return true;
  },

  getVehicles: async (): Promise<Vehicle[]> => {
    await simulateNetwork();
    return getStore().vehicles;
  },

  addVehicle: async (vehicle: Vehicle) => {
    await simulateNetwork();
    const current = getStore().vehicles;
    updateVehicles([vehicle, ...current]);
    return vehicle;
  },

  updateVehicle: async (updated: Vehicle) => {
    await simulateNetwork();
    const current = getStore().vehicles;
    updateVehicles(current.map(v => v.id === updated.id ? updated : v));
    return updated;
  },

  deleteVehicle: async (id: string) => {
    await simulateNetwork();
    const current = getStore().vehicles;
    updateVehicles(current.filter(v => v.id !== id));
    return true;
  }
};
