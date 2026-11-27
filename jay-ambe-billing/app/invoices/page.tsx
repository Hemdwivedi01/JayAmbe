import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InvoiceSearch from "./invoice-search";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: {
        select: {
          fullName: true,
          phoneNumber: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Invoices</h1>
          <p className="text-slate-400 mt-2">Manage billing and invoice generation.</p>
        </div>
        <Link href="/invoices/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Invoices</CardTitle>
        </CardHeader>
        <InvoiceSearch
          invoices={invoices.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate.toISOString(),
            invoiceDateLabel: new Intl.DateTimeFormat("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            }).format(invoice.invoiceDate),
            customerName: invoice.customer.fullName,
            customerPhone: invoice.customer.phoneNumber,
            customerAddress: [
              invoice.customer.address,
              invoice.customer.city,
              invoice.customer.state,
              invoice.customer.pincode,
            ].filter(Boolean).join(", "),
            grandTotal: invoice.grandTotal,
            paymentStatus: invoice.paymentStatus,
          }))}
        />
      </Card>
    </div>
  );
}
