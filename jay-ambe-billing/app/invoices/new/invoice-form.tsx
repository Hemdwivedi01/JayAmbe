"use client";

import { useMemo, useState } from "react";
import type { Customer, Financer, Vehicle, VehicleModel } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeGST, formatINR } from "@/lib/gst";
import { formatBatterySerials } from "@/lib/vehicle";
import { createInvoiceAction } from "../actions";

type VehicleWithModel = Vehicle & { model: VehicleModel };

type InvoiceFormProps = {
  customers: Customer[];
  vehicles: VehicleWithModel[];
  financers: Financer[];
  invoiceNumber: string;
};

const fieldClass =
  "w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "text-sm font-medium text-slate-400";
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function InvoiceForm({
  customers,
  vehicles,
  financers,
  invoiceNumber,
}: InvoiceFormProps) {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerState, setCustomerState] = useState("Uttar Pradesh");
  const [brand, setBrand] = useState("ALL");
  const [vehicleType, setVehicleType] = useState("ALL");
  const [vehicleId, setVehicleId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [previewInvoiceNumber, setPreviewInvoiceNumber] = useState(invoiceNumber);
  const [basePrice, setBasePrice] = useState(0);
  const [rto, setRto] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [accessories, setAccessories] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [financeAmount, setFinanceAmount] = useState(0);

  const brands = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.model.brand))].sort(),
    [vehicles],
  );
  const vehicleTypes = useMemo(
    () =>
      [
        ...new Set(
          vehicles
            .filter((vehicle) => brand === "ALL" || vehicle.model.brand === brand)
            .map((vehicle) => vehicle.model.vehicleType),
        ),
      ].sort(),
    [brand, vehicles],
  );
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (brand === "ALL" || vehicle.model.brand === brand) &&
      (vehicleType === "ALL" || vehicle.model.vehicleType === vehicleType),
  );
  const selectedVehicle = vehicles.find((vehicle) => String(vehicle.id) === vehicleId);
  const selectedCustomer = customers.find(
    (customer) => String(customer.id) === selectedCustomerId,
  );
  const tax = computeGST({
    exShowroomPrice: basePrice,
    rtoCharges: rto,
    insuranceCharges: insurance,
    accessoriesCharges: accessories,
    discount,
    gstRate: selectedVehicle?.model.gstRate ?? 5,
    customerState: isNewCustomer ? customerState : selectedCustomer?.state,
  });
  const paymentStatus =
    tax.grandTotal > 0 && downPayment + financeAmount >= tax.grandTotal
      ? "PAID"
      : downPayment + financeAmount > 0
        ? "PARTIAL"
        : "PENDING";

  function resetForm() {
    const parts = previewInvoiceNumber.split("/");
    const sequence = Number(parts.at(-1));
    if (Number.isInteger(sequence) && parts.length > 1) {
      parts[parts.length - 1] = String(sequence + 1).padStart(parts.at(-1)?.length ?? 3, "0");
      setPreviewInvoiceNumber(parts.join("/"));
    }
    setIsNewCustomer(false);
    setSelectedCustomerId("");
    setCustomerState("Uttar Pradesh");
    setBrand("ALL");
    setVehicleType("ALL");
    setVehicleId("");
    setInvoiceDate(today());
    setBasePrice(0);
    setRto(0);
    setInsurance(0);
    setAccessories(0);
    setDiscount(0);
    setDownPayment(0);
    setFinanceAmount(0);
  }

  return (
    <form
      action={createInvoiceAction}
      onReset={resetForm}
      className="space-y-6"
    >
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Invoice & Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className={labelClass} htmlFor="invoiceNumber">Invoice Number</label>
              <input id="invoiceNumber" name="invoiceNumber" value={previewInvoiceNumber} readOnly className={`${fieldClass} text-slate-400`} />
            </div>
            <div className="space-y-2">
              <label className={labelClass} htmlFor="invoiceDate">Purchase Date</label>
              <input id="invoiceDate" name="invoiceDate" type="date" required value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} className={fieldClass} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <h3 className="font-medium text-white">Buyer information</h3>
            <button type="button" onClick={() => setIsNewCustomer((value) => !value)} className="text-sm text-blue-400 hover:underline">
              {isNewCustomer ? "Choose saved customer" : "+ New customer"}
            </button>
          </div>

          {isNewCustomer ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="customerId" value="NEW" />
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClass} htmlFor="customerName">Customer Name</label>
                <input id="customerName" name="customerName" required autoComplete="name" className={fieldClass} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="customerPhone">Mobile Number</label>
                <input id="customerPhone" name="customerPhone" required inputMode="tel" autoComplete="tel" pattern="[0-9+() -]{7,20}" className={fieldClass} placeholder="Mobile number" />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="customerEmail">Email (optional)</label>
                <input id="customerEmail" name="customerEmail" type="email" autoComplete="email" className={fieldClass} placeholder="name@example.com" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClass} htmlFor="customerAddress">Full Address</label>
                <input id="customerAddress" name="customerAddress" required autoComplete="street-address" className={fieldClass} placeholder="Street, village or town" />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="customerState">State</label>
                <input id="customerState" name="customerState" required value={customerState} onChange={(event) => setCustomerState(event.target.value)} className={fieldClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="customerGstin">GSTIN (optional)</label>
                <input id="customerGstin" name="customerGstin" maxLength={15} className={fieldClass} placeholder="15-character GSTIN" />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="customerPan">PAN (optional)</label>
                <input id="customerPan" name="customerPan" maxLength={10} className={fieldClass} placeholder="PAN" />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClass} htmlFor="customerId">Select Customer</label>
                <select
                  id="customerId"
                  name="customerId"
                  required
                  value={selectedCustomerId}
                  onChange={(event) => setSelectedCustomerId(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">-- Choose customer --</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName} ({customer.phoneNumber})
                    </option>
                  ))}
                </select>
              </div>
              {selectedCustomer && (
                <div className="text-sm text-slate-400 sm:col-span-2">
                  {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}
                  {selectedCustomer.gstin ? ` · GSTIN ${selectedCustomer.gstin}` : ""}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader><CardTitle className="text-white">Vehicle & Technical Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass} htmlFor="brand">Brand</label>
                <select id="brand" value={brand} onChange={(event) => { setBrand(event.target.value); setVehicleType("ALL"); setVehicleId(""); setBasePrice(0); }} className={fieldClass}>
                  <option value="ALL">All brands</option>
                  {brands.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="vehicleType">Vehicle Type</label>
                <select id="vehicleType" value={vehicleType} onChange={(event) => { setVehicleType(event.target.value); setVehicleId(""); setBasePrice(0); }} className={fieldClass}>
                  <option value="ALL">All types</option>
                  {vehicleTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass} htmlFor="vehicleId">Available Model / Stock Unit</label>
              <select id="vehicleId" name="vehicleId" required value={vehicleId} onChange={(event) => {
                const vehicle = vehicles.find((item) => String(item.id) === event.target.value);
                setVehicleId(event.target.value);
                setBasePrice(vehicle?.model.basePrice ?? 0);
              }} className={fieldClass}>
                <option value="">-- Choose available vehicle --</option>
                {filteredVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.model.modelName.toLowerCase().startsWith(vehicle.model.brand.toLowerCase())
                      ? vehicle.model.modelName
                      : `${vehicle.model.brand} ${vehicle.model.modelName}`} · {vehicle.chassisNumber} · {vehicle.color}
                  </option>
                ))}
              </select>
              {filteredVehicles.length === 0 && (
                <p className="text-xs text-amber-400">No available stock matches these filters.</p>
              )}
            </div>
            {selectedVehicle && (
              <div className="grid gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm sm:grid-cols-2">
                <p><span className="text-slate-500">Chassis:</span> <span className="text-slate-200">{selectedVehicle.chassisNumber}</span></p>
                <p><span className="text-slate-500">Motor:</span> <span className="text-slate-200">{selectedVehicle.motorNumber}</span></p>
                <p><span className="text-slate-500">Battery:</span> <span className="text-slate-200">{selectedVehicle.batteryType ?? "Not specified"}{selectedVehicle.batteryBrand ? ` · ${selectedVehicle.batteryBrand}` : ""}</span></p>
                <p><span className="text-slate-500">Battery serials:</span> <span className="text-slate-200">{formatBatterySerials(selectedVehicle.batterySerials)}</span></p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader><CardTitle className="text-white">Price & GST Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PriceInput id="exShowroomPrice" name="exShowroomPrice" label="Base Vehicle Price (₹)" value={basePrice} onChange={setBasePrice} required />
              <PriceInput id="rtoCharges" name="rtoCharges" label="RTO Charges (₹)" value={rto} onChange={setRto} />
              <PriceInput id="insuranceCharges" name="insuranceCharges" label="Insurance (₹)" value={insurance} onChange={setInsurance} />
              <PriceInput id="accessoriesCharges" name="accessoriesCharges" label="Accessories (₹)" value={accessories} onChange={setAccessories} />
              <PriceInput id="discount" name="discount" label="Discount (₹)" value={discount} onChange={setDiscount} />
            </div>
            <div className="space-y-2 border-t border-slate-800 pt-4 text-sm">
              <Breakdown label="Taxable vehicle value" value={tax.taxableAmount} />
              {tax.igstAmount > 0 ? (
                <Breakdown label={`IGST (${tax.igstRate}%)`} value={tax.igstAmount} />
              ) : (
                <>
                  <Breakdown label={`CGST (${tax.cgstRate}%)`} value={tax.cgstAmount} />
                  <Breakdown label={`SGST (${tax.sgstRate}%)`} value={tax.sgstAmount} />
                </>
              )}
              <Breakdown label="RTO + insurance + accessories" value={rto + insurance + accessories} />
              <Breakdown label="Discount" value={discount} negative />
              <div className="flex justify-between border-t border-slate-700 pt-3 text-base font-semibold">
                <span className="text-slate-200">Grand Total</span>
                <span className="text-emerald-400">{formatINR(tax.grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader><CardTitle className="text-white">Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className={labelClass} htmlFor="paymentMode">Payment Mode</label>
              <select id="paymentMode" name="paymentMode" required className={fieldClass}>
                <option value="CASH">Cash</option><option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option><option value="FINANCE">Finance / Loan</option>
                <option value="HYBRID">Multiple modes</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <PriceInput id="downPayment" name="downPayment" label="Amount Received (₹)" value={downPayment} onChange={setDownPayment} />
              <PriceInput id="financeAmount" name="financeAmount" label="Finance Amount (₹)" value={financeAmount} onChange={setFinanceAmount} />
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClass} htmlFor="financerId">Financer (optional)</label>
                <select id="financerId" name="financerId" className={fieldClass}>
                  <option value="">-- Select financer --</option>
                  {financers.map((financer) => <option key={financer.id} value={financer.id}>{financer.financerName}</option>)}
                </select>
              </div>
            </div>
            <p className="text-sm text-slate-400">Balance due: <span className="font-medium text-white">{formatINR(Math.max(0, tax.grandTotal - downPayment - financeAmount))}</span> · {paymentStatus}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader><CardTitle className="text-white">Warranty & Terms</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <p>Warranty coverage is subject to the warranty card and manufacturer terms supplied with the vehicle.</p>
            <p>Vehicle, motor and battery serials shown above form part of this sale record. Please retain this invoice for service and warranty claims.</p>
            <p>Any applicable registration, insurance and accessory charges are shown separately in this invoice.</p>
            <div className="mt-8 border-t border-slate-700 pt-3 text-slate-500">Authorized signatory: Jay Ambe</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-5">
        <button type="reset" className="rounded-lg px-5 py-2.5 font-medium text-slate-300 transition-colors hover:bg-slate-800">
          New Bill / Reset
        </button>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg px-5 py-2.5 font-medium text-slate-300 transition-colors hover:bg-slate-800">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700">
          Generate & Save Bill
        </button>
      </div>
    </form>
  );
}

function PriceInput({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClass} htmlFor={id}>{label}</label>
      <input id={id} name={name} type="number" min="0" step="0.01" required={required} value={value} onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))} className={fieldClass} />
    </div>
  );
}

function Breakdown({ label, value, negative = false }: { label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-slate-400">
      <span>{label}</span>
      <span>{negative ? "−" : ""}{formatINR(value)}</span>
    </div>
  );
}
