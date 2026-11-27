"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { VehicleFormState } from "./vehicle-create-form";

export async function createVehicleAction(
  previousState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  const modelId = Number(formData.get("modelId"));
  const chassisNumber = String(formData.get("chassisNumber") ?? "").trim();
  const motorNumber = String(formData.get("motorNumber") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();

  if (!Number.isInteger(modelId) || modelId < 1) {
    return { ...previousState, status: "error", message: "Choose a vehicle model." };
  }
  if (!chassisNumber || !motorNumber || !color) {
    return { ...previousState, status: "error", message: "Chassis number, motor number, and color are required." };
  }

  const model = await prisma.vehicleModel.findUnique({
    where: { id: modelId },
    select: { id: true },
  });
  if (!model) {
    return { ...previousState, status: "error", message: "The selected model was not found." };
  }

  const optionalText = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() ? value.trim() : null;
  };
  const batterySerials = String(formData.get("batterySerials") ?? "")
    .split(/[,\n]/)
    .map((serial) => serial.trim())
    .filter(Boolean);

  try {
    await prisma.vehicle.create({
      data: {
        modelId,
        chassisNumber,
        motorNumber,
        color,
        controllerNumber: optionalText("controllerNumber"),
        batteryBrand: optionalText("batteryBrand"),
        batteryType: optionalText("batteryType"),
        batterySerials: JSON.stringify(batterySerials),
        chargerSerial: optionalText("chargerSerial"),
        status: "AVAILABLE",
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        ...previousState,
        status: "error",
        message: "A vehicle with that chassis or motor number already exists.",
      };
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/vehicles");
  revalidatePath("/invoices/new");

  return {
    status: "success",
    message: "Vehicle added to available inventory.",
    resetKey: previousState.resetKey + 1,
  };
}
