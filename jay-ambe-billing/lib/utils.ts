import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dealership constants — update these with actual details
export const DEALER_INFO = {
  name: "Jay Ambe E-Rickshaw",
  address: "Main Market, Mau, Uttar Pradesh - 275101",
  phone: "+91 XXXXX XXXXX",
  gstin: "09XXXXXXXXXXXXX", // UP GST state code = 09
  state: "Uttar Pradesh",
  stateCode: "09",
  pan: "XXXXXXXXXXXXX",
  email: "jayambe.erickshaw@gmail.com",
  signatory: "Proprietor",
  bankName: "Bank of India",
  accountNo: "XXXXXXXXXXXXXXXX",
  ifscCode: "BKID0XXXXXX",
  upiId: "jayambe@upi",
} as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

export const PAYMENT_MODES = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer / NEFT / RTGS" },
  { value: "FINANCE", label: "Finance / Loan" },
  { value: "HYBRID", label: "Hybrid (Part Cash + Finance)" },
];

export const VEHICLE_STATUSES = [
  { value: "AVAILABLE", label: "Available", color: "green" },
  { value: "BOOKED", label: "Booked", color: "yellow" },
  { value: "SOLD", label: "Sold", color: "blue" },
  { value: "SERVICE", label: "Service", color: "orange" },
];

export const EV_COLORS = [
  "Red", "Blue", "Green", "Yellow", "White", "Black",
  "Orange", "Purple", "Grey", "Silver", "Pink", "Maroon",
];
