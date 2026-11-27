// GST Computation Engine for Jay Ambe E-Rickshaw Billing

export interface GSTBreakdown {
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  grandTotal: number;
}

// Intra-state (UP → UP): CGST + SGST
// Inter-state: IGST only
export function computeGST(params: {
  exShowroomPrice: number;
  rtoCharges?: number;
  insuranceCharges?: number;
  accessoriesCharges?: number;
  discount?: number;
  gstRate?: number; // default 5% for EVs
  customerState?: string;
  dealerState?: string;
}): GSTBreakdown {
  const {
    exShowroomPrice,
    rtoCharges = 0,
    insuranceCharges = 0,
    accessoriesCharges = 0,
    discount = 0,
    gstRate = 5.0,
    customerState = "Uttar Pradesh",
    dealerState = "Uttar Pradesh",
  } = params;

  const isIntraState =
    customerState.trim().toLowerCase() === dealerState.trim().toLowerCase();

  // The entered ex-showroom amount is the pre-tax vehicle price.
  const taxableAmount = round2(Math.max(0, exShowroomPrice - discount));

  const totalGST = round2((taxableAmount * gstRate) / 100);

  let cgstRate = 0,
    cgstAmount = 0,
    sgstRate = 0,
    sgstAmount = 0,
    igstRate = 0,
    igstAmount = 0;

  if (isIntraState) {
    cgstRate = round2(gstRate / 2);
    sgstRate = round2(gstRate / 2);
    cgstAmount = round2((taxableAmount * cgstRate) / 100);
    sgstAmount = round2((taxableAmount * sgstRate) / 100);
  } else {
    igstRate = gstRate;
    igstAmount = totalGST;
  }

  const grandTotal = round2(
    taxableAmount +
      cgstAmount +
      sgstAmount +
      igstAmount +
      rtoCharges +
      insuranceCharges +
      accessoriesCharges
  );

  return {
    taxableAmount,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    grandTotal,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Format currency in Indian style
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Convert number to words (Indian system) for invoice
export function numberToWords(num: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero";

  function helper(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    if (n < 1000)
      return ones[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
    if (n < 100000)
      return helper(Math.floor(n / 1000)) + "Thousand " + helper(n % 1000);
    if (n < 10000000)
      return helper(Math.floor(n / 100000)) + "Lakh " + helper(n % 100000);
    return helper(Math.floor(n / 10000000)) + "Crore " + helper(n % 10000000);
  }

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let result = helper(rupees).trim() + " Rupees";
  if (paise > 0) result += " and " + helper(paise).trim() + " Paise";
  result += " Only";
  return result;
}
