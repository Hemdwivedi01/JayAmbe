import Link from "next/link";
import { notFound } from "next/navigation";
import { formatINR, numberToWords } from "@/lib/gst";
import { prisma } from "@/lib/prisma";
import { formatBatterySerials } from "@/lib/vehicle";
import PrintButton from "./print-button";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoiceId = Number(id);
  if (!Number.isInteger(invoiceId) || invoiceId < 1) notFound();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      customer: true,
      financer: true,
      vehicle: { include: { model: true } },
    },
  });
  if (!invoice) notFound();

  const date = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(invoice.invoiceDate);

  return (
    <main className="mx-auto max-w-4xl space-y-5 p-6 sm:p-8">
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3">
        <Link href="/invoices" className="text-sm text-blue-400 hover:underline">
          ← Back to invoices
        </Link>
        <PrintButton />
      </div>

      <article className="invoice-paper space-y-7 rounded-xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-slate-900 pb-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Tax Invoice</p>
            <h1 className="mt-2 text-3xl font-bold">Jay Ambe</h1>
            <p className="mt-1 text-sm text-slate-600">E-Rickshaw Sales & Service</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-semibold">{invoice.invoiceNumber}</p>
            <p className="mt-1 text-sm text-slate-600">Invoice date: {date}</p>
            <p className="mt-1 text-sm text-slate-600">Payment: {invoice.paymentStatus}</p>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Bill to</h2>
            <p className="mt-2 font-semibold">{invoice.customer.fullName}</p>
            <p className="text-sm text-slate-700">{invoice.customer.phoneNumber}</p>
            <p className="text-sm text-slate-700">{invoice.customer.address}, {invoice.customer.city}, {invoice.customer.state}{invoice.customer.pincode ? ` ${invoice.customer.pincode}` : ""}</p>
            {invoice.customer.gstin && <p className="mt-1 text-sm text-slate-700">GSTIN: {invoice.customer.gstin}</p>}
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Vehicle</h2>
            <p className="mt-2 font-semibold">{invoice.vehicle.model.brand} {invoice.vehicle.model.modelName}</p>
            <p className="text-sm text-slate-700">{invoice.vehicle.model.vehicleType} · {invoice.vehicle.color}</p>
            <p className="text-sm text-slate-700">Chassis: {invoice.vehicle.chassisNumber}</p>
            <p className="text-sm text-slate-700">Motor: {invoice.vehicle.motorNumber}</p>
            <p className="text-sm text-slate-700">Battery: {invoice.vehicle.batteryType ?? "Not specified"}{invoice.vehicle.batteryBrand ? ` · ${invoice.vehicle.batteryBrand}` : ""}</p>
            <p className="text-sm text-slate-700">Battery serial(s): {formatBatterySerials(invoice.vehicle.batterySerials)}</p>
            {invoice.vehicle.controllerNumber && <p className="text-sm text-slate-700">Controller: {invoice.vehicle.controllerNumber}</p>}
            {invoice.vehicle.chargerSerial && <p className="text-sm text-slate-700">Charger: {invoice.vehicle.chargerSerial}</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Price & tax details</h2>
          <div className="overflow-hidden rounded-lg border border-slate-300">
            <Line label="Base vehicle price" value={invoice.taxableAmount + invoice.discount} />
            <Line label="Discount" value={-invoice.discount} />
            <Line label="Taxable amount" value={invoice.taxableAmount} />
            {invoice.igstAmount > 0 ? (
              <Line label={`IGST (${invoice.igstRate}%)`} value={invoice.igstAmount} />
            ) : (
              <>
                <Line label={`CGST (${invoice.cgstRate}%)`} value={invoice.cgstAmount} />
                <Line label={`SGST (${invoice.sgstRate}%)`} value={invoice.sgstAmount} />
              </>
            )}
            <Line label="RTO charges" value={invoice.rtoCharges} />
            <Line label="Insurance" value={invoice.insuranceCharges} />
            <Line label="Accessories" value={invoice.accessoriesCharges} />
            <div className="flex justify-between bg-slate-100 px-4 py-3 font-bold">
              <span>Grand total</span><span>{formatINR(invoice.grandTotal)}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600">Amount in words: {numberToWords(invoice.grandTotal)}</p>
        </section>

        <section className="grid gap-5 border-t border-slate-300 pt-5 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold">Payment</h2>
            <p className="mt-1 text-sm text-slate-700">Mode: {invoice.paymentMode.replaceAll("_", " ")}</p>
            <p className="text-sm text-slate-700">Received: {formatINR(invoice.downPayment)}</p>
            <p className="text-sm text-slate-700">Financed: {formatINR(invoice.financeAmount)}{invoice.financer ? ` · ${invoice.financer.financerName}` : ""}</p>
            <p className="text-sm text-slate-700">Balance due: {formatINR(Math.max(0, invoice.grandTotal - invoice.downPayment - invoice.financeAmount))}</p>
          </div>
          <div className="text-sm text-slate-700">
            <h2 className="font-semibold">Warranty & terms</h2>
            <p className="mt-1">Warranty is subject to the warranty card and manufacturer terms supplied with the vehicle. Retain this invoice for service and warranty claims.</p>
            <p className="mt-5">Authorized signatory: Jay Ambe</p>
          </div>
        </section>
      </article>
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { display: block !important; background: white !important; color: #0f172a !important; }
          body > aside { display: none !important; }
          body > main { width: 100% !important; margin: 0 !important; }
          [data-sonner-toaster] { display: none !important; }
          .invoice-paper { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between border-b border-slate-200 px-4 py-2.5 text-sm last:border-0">
      <span>{label}</span>
      <span>{formatINR(value)}</span>
    </div>
  );
}
