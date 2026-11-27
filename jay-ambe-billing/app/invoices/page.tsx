import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { customer: true, vehicle: { include: { model: true } } },
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
        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <p>No invoices found. Create your first invoice!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-400">{inv.customer.fullName} • {new Date(inv.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">₹{inv.grandTotal.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-emerald-400 font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full mt-1">{inv.paymentStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
