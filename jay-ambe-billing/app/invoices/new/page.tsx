import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/invoice-number";
import InvoiceForm from "./invoice-form";

export default async function NewInvoicePage() {
  const [customers, vehicles, financers, invoiceNumber] = await Promise.all([
    prisma.customer.findMany({ orderBy: { fullName: "asc" } }),
    prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      include: { model: true },
      orderBy: { chassisNumber: "asc" },
    }),
    prisma.financer.findMany({ orderBy: { financerName: "asc" } }),
    generateInvoiceNumber(),
  ]);

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Create Invoice</h1>
        <p className="text-slate-400 mt-2">Create and save a tax invoice for an available vehicle.</p>
      </div>
      
      <InvoiceForm customers={customers} vehicles={vehicles} financers={financers} invoiceNumber={invoiceNumber} />
    </div>
  );
}
