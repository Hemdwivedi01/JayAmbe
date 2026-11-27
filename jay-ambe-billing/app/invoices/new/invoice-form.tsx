"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createInvoiceAction } from "../actions";

export default function InvoiceForm({ customers, vehicles, financers }: { customers: any[], vehicles: any[], financers: any[] }) {
  const [exShowroom, setExShowroom] = useState(105000);
  const [rto, setRto] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [discount, setDiscount] = useState(0);
  
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const grandTotal = exShowroom + rto + insurance - discount;

  return (
    <form action={createInvoiceAction} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customer Details */}
        <Card className="bg-slate-900 border-slate-800 relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Customer Details</CardTitle>
            <button 
              type="button"
              onClick={() => setIsNewCustomer(!isNewCustomer)}
              className="text-xs text-blue-500 hover:underline"
            >
              {isNewCustomer ? "Select Existing Customer" : "+ Add New Customer"}
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isNewCustomer ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <input type="hidden" name="customerId" value="NEW" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <input 
                    type="text" name="customerName" required
                    className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Mobile Number</label>
                    <input 
                      type="text" name="customerPhone" required
                      className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      placeholder="10 digit number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Address / Village</label>
                    <input 
                      type="text" name="customerAddress" required
                      className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      placeholder="Full Address"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-slate-400">Select Customer</label>
                <select 
                  name="customerId" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phoneNumber})</option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Select Vehicle</label>
              <select 
                name="vehicleId" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  const v = vehicles.find(x => String(x.id) === e.target.value);
                  if (v) setExShowroom(v.model.basePrice * 1.05); // Assuming basePrice is without GST, so ExShowroom = basePrice + 5% GST
                }}
              >
                <option value="">-- Choose Available Vehicle --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.model.modelName} - {v.chassisNumber} ({v.color})</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Pricing Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Ex-Showroom Price (₹)</label>
                <input 
                  type="number" name="exShowroomPrice" required
                  value={exShowroom} onChange={(e) => setExShowroom(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">RTO Charges (₹)</label>
                <input 
                  type="number" name="rtoCharges" 
                  value={rto} onChange={(e) => setRto(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Insurance (₹)</label>
                <input 
                  type="number" name="insuranceCharges" 
                  value={insurance} onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Discount (₹)</label>
                <input 
                  type="number" name="discount" 
                  value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-lg font-medium text-slate-300">Grand Total</span>
              <span className="text-2xl font-bold text-emerald-500">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Payment Mode</label>
              <select 
                name="paymentMode" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="FINANCE">Finance / Loan</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Down Payment (₹)</label>
                <input 
                  type="number" name="downPayment" defaultValue={grandTotal}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Financer</label>
                <select 
                  name="financerId" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- None --</option>
                  {financers.map(f => (
                    <option key={f.id} value={f.id}>{f.financerName}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button type="button" onClick={() => window.history.back()} className="px-6 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Generate Invoice
        </button>
      </div>
    </form>
  );
}
