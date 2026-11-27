"use server";

import { prisma } from "@/lib/prisma";
import { computeGST } from "@/lib/gst";
import { generateInvoiceNumber } from "@/lib/invoice-number";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readAmount(formData: FormData, key: string): number {
  const raw = formData.get(key);
  const value = raw === null || raw === "" ? 0 : Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid amount for ${key}.`);
  }
  return value;
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }
  return value.trim();
}

export async function createInvoiceAction(formData: FormData) {
  const customerIdValue = formData.get("customerId");
  let customerId: number | null = null;
  let customerState: string;
  let newCustomerData: {
    fullName: string;
    phoneNumber: string;
    address: string;
    state: string;
    email: string | null;
    gstin: string | null;
    panNumber: string | null;
  } | null = null;

  if (customerIdValue === "NEW") {
    const fullName = readText(formData, "customerName");
    const phoneNumber = readText(formData, "customerPhone");
    if (!/^[0-9+() -]{7,20}$/.test(phoneNumber)) {
      throw new Error("Enter a valid customer mobile number.");
    }
    const address = readText(formData, "customerAddress");
    customerState = readText(formData, "customerState");
    const emailValue = formData.get("customerEmail");
    const gstinValue = formData.get("customerGstin");
    const panValue = formData.get("customerPan");
    const email = typeof emailValue === "string" && emailValue.trim() ? emailValue.trim() : null;
    const gstin = typeof gstinValue === "string" && gstinValue.trim()
      ? gstinValue.trim().toUpperCase()
      : null;
    const panNumber = typeof panValue === "string" && panValue.trim()
      ? panValue.trim().toUpperCase()
      : null;

    if (gstin && !/^[0-9A-Z]{15}$/.test(gstin)) {
      throw new Error("GSTIN must be 15 letters and numbers.");
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      throw new Error("Enter a valid PAN or leave the field blank.");
    }

    newCustomerData = {
      fullName,
      phoneNumber,
      address,
      state: customerState,
      email,
      gstin,
      panNumber,
    };
  } else {
    customerId = Number(customerIdValue);
    if (!Number.isInteger(customerId) || customerId < 1) {
      throw new Error("Select a valid customer.");
    }
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { state: true },
    });
    if (!customer) throw new Error("The selected customer was not found.");
    customerState = customer.state;
  }

  const vehicleId = Number(formData.get("vehicleId"));
  if (!Number.isInteger(vehicleId) || vehicleId < 1) {
    throw new Error("Select a valid vehicle.");
  }
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { status: true, model: { select: { gstRate: true } } },
  });
  if (!vehicle || vehicle.status !== "AVAILABLE") {
    throw new Error("The selected vehicle is no longer available.");
  }

  const exShowroomPrice = readAmount(formData, "exShowroomPrice");
  const rtoCharges = readAmount(formData, "rtoCharges");
  const insuranceCharges = readAmount(formData, "insuranceCharges");
  const accessoriesCharges = readAmount(formData, "accessoriesCharges");
  const discount = readAmount(formData, "discount");
  if (exShowroomPrice <= 0) throw new Error("Base vehicle price must be greater than zero.");
  if (discount > exShowroomPrice) throw new Error("Discount cannot exceed the vehicle price.");

  const tax = computeGST({
    exShowroomPrice,
    rtoCharges,
    insuranceCharges,
    accessoriesCharges,
    discount,
    gstRate: vehicle.model.gstRate,
    customerState,
  });
  const downPayment = readAmount(formData, "downPayment");
  const financeAmount = readAmount(formData, "financeAmount");
  if (downPayment + financeAmount > tax.grandTotal) {
    throw new Error("Received and financed amounts cannot exceed the invoice total.");
  }

  const paymentMode = readText(formData, "paymentMode");
  if (!["CASH", "UPI", "BANK_TRANSFER", "FINANCE", "HYBRID"].includes(paymentMode)) {
    throw new Error("Select a valid payment mode.");
  }
  const financerValue = formData.get("financerId");
  const financerId = financerValue ? Number(financerValue) : null;
  if (financerId !== null && (!Number.isInteger(financerId) || financerId < 1)) {
    throw new Error("Select a valid financer.");
  }
  if (financerId !== null && !(await prisma.financer.findUnique({ where: { id: financerId } }))) {
    throw new Error("The selected financer was not found.");
  }

  const invoiceDateValue = readText(formData, "invoiceDate");
  const invoiceDate = new Date(`${invoiceDateValue}T12:00:00`);
  if (Number.isNaN(invoiceDate.getTime())) throw new Error("Enter a valid purchase date.");

  const invoiceNumber = readText(formData, "invoiceNumber");
  if (!/^JA\/\d{4}-\d{2}\/\d{3,6}$/.test(invoiceNumber)) {
    throw new Error("The invoice number is invalid. Refresh the form and try again.");
  }
  const nextInvoiceNumber = await generateInvoiceNumber();
  const invoicePrefix = invoiceNumber.slice(0, invoiceNumber.lastIndexOf("/") + 1);
  const nextPrefix = nextInvoiceNumber.slice(0, nextInvoiceNumber.lastIndexOf("/") + 1);
  const requestedSequence = Number(invoiceNumber.slice(invoiceNumber.lastIndexOf("/") + 1));
  const nextSequence = Number(nextInvoiceNumber.slice(nextInvoiceNumber.lastIndexOf("/") + 1));
  if (invoicePrefix !== nextPrefix || requestedSequence < nextSequence) {
    throw new Error("This invoice number is no longer available. Refresh the form to get the next number.");
  }
  if (await prisma.invoice.findUnique({ where: { invoiceNumber } })) {
    throw new Error("This invoice number has already been used. Refresh the form to get the next number.");
  }
  const paymentStatus =
    tax.grandTotal > 0 && downPayment + financeAmount >= tax.grandTotal
      ? "PAID"
      : downPayment + financeAmount > 0
        ? "PARTIAL"
        : "PENDING";

  if (newCustomerData) {
    const newCustomer = await prisma.customer.create({ data: newCustomerData });
    customerId = newCustomer.id;
  }
  if (customerId === null) throw new Error("Select or enter a customer.");

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      invoiceDate,
      customerId,
      vehicleId,
      exShowroomPrice,
      rtoCharges,
      insuranceCharges,
      accessoriesCharges,
      discount,
      taxableAmount: tax.taxableAmount,
      cgstRate: tax.cgstRate,
      cgstAmount: tax.cgstAmount,
      sgstRate: tax.sgstRate,
      sgstAmount: tax.sgstAmount,
      igstRate: tax.igstRate,
      igstAmount: tax.igstAmount,
      grandTotal: tax.grandTotal,
      paymentMode,
      downPayment,
      financerId,
      financeAmount,
      paymentStatus,
    },
  });

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: "SOLD" },
  });

  revalidatePath("/invoices");
  revalidatePath("/customers");
  revalidatePath("/vehicles");
  revalidatePath("/");

  redirect(`/invoices/${invoice.id}`);
}
