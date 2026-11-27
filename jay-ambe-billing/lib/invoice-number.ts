import { prisma } from "./prisma";

export function getCurrentFinancialYear(): { start: number; label: string } {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-based
  const year = now.getFullYear();

  // Financial year starts April 1
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return {
    start: startYear,
    label: `${startYear}-${String(endYear).slice(2)}`,
  };
}

export async function generateInvoiceNumber(): Promise<string> {
  const fy = getCurrentFinancialYear();

  // Find the latest invoice in the current financial year
  const fyStart = new Date(`${fy.start}-04-01T00:00:00.000Z`);
  const fyEnd = new Date(`${fy.start + 1}-03-31T23:59:59.999Z`);

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceDate: {
        gte: fyStart,
        lte: fyEnd,
      },
    },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  });

  let nextSeq = 1;
  if (lastInvoice) {
    // Format: JA/2026-27/001  → extract the numeric part
    const parts = lastInvoice.invoiceNumber.split("/");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  const seq = String(nextSeq).padStart(3, "0");
  return `JA/${fy.label}/${seq}`;
}
