
import { Student, Instructor, Vehicle, FormationType } from '../types';

export const initialStudents: Student[] = [
  { 
    id: '1', name: 'Ahmed Benali', age: 24, phone: '0661 12 34 56', email: 'ahmed@email.com', 
    registrationDate: '2023-11-15', formation: FormationType.COMPLET, paidAmount: 35000, 
    totalAmount: 50000, status: 'active',
    // Added missing properties
    cin: '123456789', address: 'Alger Centre', transmission: 'Manuel'
  },
  { 
    id: '2', name: 'Fatima Zerdoumi', age: 19, phone: '0550 98 76 54', email: 'fatima@email.com', 
    registrationDate: '2023-12-01', formation: FormationType.CODE, paidAmount: 15000, 
    totalAmount: 15000, status: 'active',
    // Added missing properties
    cin: '987654321', address: 'Bab Azzouar', transmission: 'Manuel'
  }
];

export const instructors: Instructor[] = [
  { 
    id: '1', name: 'Karim Lounis', specialty: 'Code', phone: '0551 11 22 33', experience: '15 ans', 
    assignedStudents: ['2'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    // Added missing properties
    licenseNumber: 'L-123456', availability: 'Matin'
  },
  { 
    id: '2', name: 'Said Belkacem', specialty: 'Pratique', phone: '0552 22 33 44', experience: '10 ans', 
    assignedStudents: ['1'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    // Added missing properties
    licenseNumber: 'L-789012', availability: 'Après-midi'
  },
];

export const vehicles: Vehicle[] = [
  { 
    id: 'v1', 
    model: 'Volkswagen Polo 7', 
    plate: '01234-122-16', 
    status: 'available', 
    lastMaintenance: '2024-01-10', 
    image: 'https://images.unsplash.com/photo-1617469767053-d3b508a0d822?q=80&w=800&auto=format&fit=crop',
    fuelType: 'Essence', transmission: 'Manuel', insuranceExpiry: '2024-02-28',
    nextMaintenanceDate: '2024-03-15', technicalControlExpiry: '2024-05-10'
  },
  { 
    id: 'v2', 
    model: 'Skoda Fabia III', 
    plate: '56789-118-16', 
    status: 'in_use', 
    lastMaintenance: '2024-02-05', 
    image: 'https://images.unsplash.com/photo-1606148047425-634027476837?q=80&w=800&auto=format&fit=crop',
    fuelType: 'Essence', transmission: 'Manuel', insuranceExpiry: '2024-03-05',
    nextMaintenanceDate: '2024-02-25', technicalControlExpiry: '2024-06-15'
  }
];

export const initialFinance = {
  transactions: [
    { id: 't1', date: '01/01/2024', person: 'Ahmed Benali', type: 'Versement Inscription', numeric: 20000, amount: '20,000 DA' },
    { id: 't2', date: '05/01/2024', person: 'Fatima Zerdoumi', type: 'Paiement Complet Code', numeric: 15000, amount: '15,000 DA' },
    { id: 't3', date: '10/01/2024', person: 'Ahmed Benali', type: 'Tranche 2', numeric: 15000, amount: '15,000 DA' },
  ],
  expenses: [
    { id: 'e1', date: '02/01/2024', person: 'Naftal', type: 'Carburant Polo', numeric: 3500, amount: '3,500 DA' },
    { id: 'e2', date: '08/01/2024', person: 'Loyer Agence', type: 'Charges fixes', numeric: 45000, amount: '45,000 DA' },
  ]
};
