export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum RentalStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenanceType {
  ROUTINE_SERVICE = 'ROUTINE_SERVICE',
  REPAIR = 'REPAIR',
  CLEANING = 'CLEANING',
  INSPECTION = 'INSPECTION',
}

export enum MileageUnit {
  KILOMETER = 'KILOMETER',
  MILE = 'MILE',
}

export interface User {
  id: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  rentals?: Rental[];
  reviews?: Review[];
}

export interface AuthResponse {
  access_token: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  cars?: Car[];
}

export interface Feature {
  id: number;
  name: string;
  icon?: string;
  cars?: Car[];
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
  description?: string;
  mileage: number;
  mileageUnit: MileageUnit;
  fuelType: FuelType;
  transmission: Transmission;
  engineSize?: number;
  horsePower?: number;
  pricePerDay: number;
  deposit: number;
  isAvailable: boolean;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  features?: Feature[];
  rentals?: Rental[];
  reviews?: Review[];
  maintenance?: Maintenance[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Rental {
  id: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: RentalStatus;
  userId: number;
  user?: User;
  carId: number;
  car?: Car;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  userId: number;
  user?: User;
  carId: number;
  car?: Car;
  createdAt: Date;
}

export interface Maintenance {
  id: number;
  type: MaintenanceType;
  description: string;
  cost: number;
  date: Date;
  mileage: number;
  mileageUnit: MileageUnit;
  carId: number;
  car?: Car;
  createdAt: Date;
  updatedAt: Date;
}
