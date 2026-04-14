import { Room } from "./types";

export const MOCK_ROOMS: Room[] = [
  { id: "1", number: "101", type: "Standard", status: "Occupied", guest: { id: "g1", name: "John Doe", email: "john@example.com", confirmationNumber: "CONF-7821", checkIn: "2023-10-01", checkOut: "2023-10-05", avatar: "https://i.pravatar.cc/150?u=g1" } },
  { id: "2", number: "102", type: "Standard", status: "Vacant-Clean" },
  { id: "3", number: "103", type: "Deluxe", status: "Vacant-Dirty" },
  { id: "4", number: "104", type: "Suite", status: "Out-of-Order" },
  { id: "5", number: "201", type: "Standard", status: "Occupied", guest: { id: "g2", name: "Jane Smith", email: "jane@example.com", confirmationNumber: "CONF-9912", checkIn: "2023-10-02", checkOut: "2023-10-06", avatar: "https://i.pravatar.cc/150?u=g2" } },
  { id: "6", number: "202", type: "Deluxe", status: "Vacant-Clean" },
  { id: "7", number: "203", type: "Deluxe", status: "Occupied", guest: { id: "g3", name: "Michael Ross", email: "mike@example.com", confirmationNumber: "CONF-1123", checkIn: "2023-09-30", checkOut: "2023-10-04", avatar: "https://i.pravatar.cc/150?u=g3" } },
  { id: "8", number: "204", type: "Suite", status: "Vacant-Clean" },
  { id: "9", number: "301", type: "Penthouse", status: "Occupied", guest: { id: "g4", name: "Harvey Specter", email: "harvey@example.com", confirmationNumber: "CONF-0001", checkIn: "2023-10-01", checkOut: "2023-10-10", avatar: "https://i.pravatar.cc/150?u=g4" } },
  { id: "10", number: "302", type: "Deluxe", status: "Vacant-Clean" },
  { id: "11", number: "303", type: "Standard", status: "Vacant-Dirty" },
  { id: "12", number: "304", type: "Standard", status: "Vacant-Clean" },
  { id: "13", number: "401", type: "Suite", status: "Occupied", guest: { id: "g5", name: "Donna Paulsen", email: "donna@example.com", confirmationNumber: "CONF-8821", checkIn: "2023-10-03", checkOut: "2023-10-07", avatar: "https://i.pravatar.cc/150?u=g5" } },
  { id: "14", number: "402", type: "Deluxe", status: "Vacant-Clean" },
  { id: "15", number: "403", type: "Standard", status: "Out-of-Order" },
  { id: "16", number: "404", type: "Standard", status: "Vacant-Clean" },
];