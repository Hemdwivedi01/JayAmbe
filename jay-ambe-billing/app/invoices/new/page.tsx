import { prisma } from "@/lib/prisma";
import InvoiceForm from "./invoice-form";

export default async function NewInvoicePage() {
  // Fetch required data for the form
  const customers = await prisma.customer.findMany({
    orderBy: { fullName: "asc" },
  });
  
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
    include: { model: true },
    orderBy: { chassisNumber: "asc" },
  });

  const financers = await prisma.financer.findMany({
    orderBy: { financerName: "asc" },
  });

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Create Invoice</h1>
        <p className="text-slate-400 mt-2">Generate a new GST invoice for a vehicle sale.</p>
      </div>
      
      <InvoiceForm customers={customers} vehicles={vehicles} financers={financers} />
    </div>
  );
}
