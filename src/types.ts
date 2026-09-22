export type Language = 'ar' | 'en';

export type RegionZone = 'north' | 'east' | 'west' | 'south' | 'centre';

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  centerGarageAr: string;
  centerGarageEn: string;
  zone: RegionZone;
  x: number; // For map visualization (percentage 0-100)
  y: number; // For map visualization (percentage 0-100)
  descriptionAr: string;
  descriptionEn: string;
  landmarkAr: string;
  landmarkEn: string;
  image: string;
}

export interface BusGarage {
  id: string;
  governorateId: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  workingHoursAr: string;
  workingHoursEn: string;
  servicesAr: string[];
  servicesEn: string[];
  activeOperatorsCount: number;
  dailyDepartures: number;
}

export interface BusOperator {
  id: string;
  nameAr: string;
  nameEn: string;
  fleetNameAr: string;
  fleetNameEn: string;
  logoColor: string;
  logoBg: string;
  rating: number;
  reviewsCount: number;
  descriptionAr: string;
  descriptionEn: string;
  features: string[];
  fleetCount?: number;
  establishedYear?: number;
  amenities?: string[];
  routesServedAr?: string[];
  routesServedEn?: string[];
}

export type BusClass = 'vip' | 'first' | 'express';

export interface TripSchedule {
  id: string;
  operatorId: string;
  operatorNameAr: string;
  operatorNameEn: string;
  fromGovernorateId: string;
  toGovernorateId: string;
  fromGarageAr: string;
  fromGarageEn: string;
  toGarageAr: string;
  toGarageEn: string;
  departureTime: string; // e.g. "07:30"
  arrivalTime: string;   // e.g. "12:00"
  durationHours: number; // e.g. 4.5
  distanceKm: number;
  priceSYP: number;
  busClass: BusClass;
  busModel: string;
  plateNumber: string;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  stopsAr?: string[];
  stopsEn?: string[];
  daysOfWeek: number[]; // 0-6 (0 = Sunday, 5 = Friday, etc.)
}

export interface SeatInfo {
  number: number;
  row: number;
  col: number; // 1, 2, aisle, 3, 4
  type: 'window' | 'aisle';
  status: 'available' | 'reserved' | 'selected' | 'premium';
  isFemalePreferred?: boolean;
}

export interface PassengerProfile {
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female';
  seatNumber: number;
}

export type PaymentMethodType = 'shamcash' | 'syriatel' | 'card' | 'safar_wallet' | 'cash_on_board';

export interface TicketBooking {
  ticketId: string;
  pnr: string;
  tripId: string;
  trip: TripSchedule;
  travelDate: string; // YYYY-MM-DD
  passengers: PassengerProfile[];
  selectedSeats: number[];
  luggageKgTotal: number;
  excessLuggageFeeSYP: number;
  baseFareSYP: number;
  discountSYP: number;
  totalAmountSYP: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'confirmed' | 'pending' | 'cancelled';
  boardingStatus: 'scheduled' | 'boarded' | 'completed';
  bookedAt: string;
  qrPayload: string;
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'payment' | 'cashback' | 'refund' | 'referral' | 'booking';
  amountSYP: number;
  date: string;
  descriptionAr: string;
  descriptionEn: string;
  method?: string;
  status: 'success' | 'pending';
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyProfile {
  tier: LoyaltyTier;
  points: number;
  nextTierPoints: number;
  totalTrips: number;
  savedAmountSYP: number;
  perksAr: string[];
  perksEn: string[];
  cashbackPercentage?: number;
  loungeAccess?: boolean;
}
