"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoiceAction(formData: FormData) {
  let customerId = parseInt(formData.get("customerId") as string);
  
  // Create new customer if "NEW" was selected
  if (formData.get("customerId") === "NEW") {
    const fullName = formData.get("customerName") as string;
    const phoneNumber = formData.get("customerPhone") as string;
    const address = formData.get("customerAddress") as string;
    
    const newCustomer = await prisma.customer.create({
      data: {
        fullName,
        phoneNumber,
        address,
      }
    });
    customerId = newCustomer.id;
  }

  const vehicleId = parseInt(formData.get("vehicleId") as string);
  const financerIdStr = formData.get("financerId") as string;
  const financerId = financerIdStr ? parseInt(financerIdStr) : null;
  
  const exShowroomPrice = parseFloat(formData.get("exShowroomPrice") as string) || 0;
  const rtoCharges = parseFloat(formData.get("rtoCharges") as string) || 0;
  const insuranceCharges = parseFloat(formData.get("insuranceCharges") as string) || 0;
  const accessoriesCharges = parseFloat(formData.get("accessoriesCharges") as string) || 0;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  
  const taxableAmount = exShowroomPrice / 1.05;
  const cgstAmount = taxableAmount * 0.025;
  const sgstAmount = taxableAmount * 0.025;
  const igstAmount = 0;
  
  const grandTotal = exShowroomPrice + rtoCharges + insuranceCharges + accessoriesCharges - discount;

  const paymentMode = formData.get("paymentMode") as string || "CASH";
  const downPayment = parseFloat(formData.get("downPayment") as string) || 0;
  const financeAmount = parseFloat(formData.get("financeAmount") as string) || 0;

  const count = await prisma.invoice.count();
  const invoiceNumber = `INV-2026-${String(count + 1).padStart(4, '0')}`;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId,
      vehicleId,
      exShowroomPrice,
      rtoCharges,
      insuranceCharges,
      accessoriesCharges,
      discount,
      taxableAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal,
      paymentMode,
      downPayment,
      financerId,
      financeAmount,
      paymentStatus: "PAID",
    }
  });

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status: "SOLD" }
  });

  revalidatePath("/invoices");
  revalidatePath("/customers");
  revalidatePath("/vehicles");
  revalidatePath("/");
  
  redirect("/invoices");
}
