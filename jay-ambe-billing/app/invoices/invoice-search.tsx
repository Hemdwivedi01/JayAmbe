"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { CardContent } from "@/components/ui/card";

type InvoiceSearchItem = {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDateLabel: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  grandTotal: number;
  paymentStatus: string;
};

export default function InvoiceSearch({ invoices }: { invoices: InvoiceSearchItem[] }) {
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate);
      const dateParts = dateFormatter.formatToParts(invoiceDate);
      const localDate = `${dateParts.find((part) => part.type === "year")?.value}-${dateParts.find((part) => part.type === "month")?.value}-${dateParts.find((part) => part.type === "day")?.value}`;
      const matchesQuery =
        !normalizedQuery ||
        [
          invoice.invoiceNumber,
          invoice.customerName,
          invoice.customerPhone,
          invoice.customerAddress,
        ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));

      return (
        matchesQuery &&
        (!dateFrom || localDate >= dateFrom) &&
        (!dateTo || localDate <= dateTo)
      );
    });
  }, [dateFrom, dateTo, invoices, query]);

  const hasFilters = Boolean(query || dateFrom || dateTo);
  function clearFilters() {
    setQuery("");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <CardContent className="space-y-5">
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search invoice number, customer, mobile, or address"
          aria-label="Search invoices"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear invoice search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-400">
          <span>Invoice date from</span>
          <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
        </label>
        <label className="space-y-2 text-sm text-slate-400">
          <span>Invoice date to</span>
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="text-blue-400 hover:text-blue-300">
            Clear filters
          </button>
        )}
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          {invoices.length === 0
            ? "No invoices found. Create your first invoice!"
            : "No invoices match the selected search and filters."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <Link href={`/invoices/${invoice.id}`} className="min-w-0">
                <p className="text-sm font-medium text-white">{invoice.invoiceNumber}</p>
                <p className="text-xs text-slate-400">
                  {invoice.customerName} · {invoice.customerPhone} · {invoice.invoiceDateLabel}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">{invoice.customerAddress}</p>
                <p className="mt-1 text-xs text-blue-400">View / Print invoice</p>
              </Link>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-white">₹{invoice.grandTotal.toLocaleString("en-IN")}</p>
                <p className="mt-1 inline-block rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  {invoice.paymentStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}
