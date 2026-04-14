import { LucideIcon } from "lucide-react";

export type RoomStatus = "Occupied" | "Vacant-Clean" | "Vacant-Dirty" | "Out-of-Order";

export interface Guest {
  id: string;
  name: string;
  email: string;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  avatar: string;
}

export interface Room {
  id: string;
  number: string;
  type: "Deluxe" | "Suite" | "Standard" | "Penthouse";
  status: RoomStatus;
  guest?: Guest;
}

export interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: string;
}