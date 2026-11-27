"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createVehicleAction } from "./actions";

export type VehicleFormState = {
  status: "idle" | "success" | "error";
  message: string;
  resetKey: number;
};

const initialState: VehicleFormState = {
  status: "idle",
  message: "",
  resetKey: 0,
};

type VehicleModelOption = {
  id: number;
  brand: string;
  modelName: string;
  vehicleType: string;
};

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
const labelClass = "block space-y-2 text-sm text-slate-400";

export default function VehicleCreateForm({ models }: { models: VehicleModelOption[] }) {
  const [state, formAction, isPending] = useActionState(createVehicleAction, initialState);

  return (
    <form key={state.resetKey} action={formAction} className="space-y-5">
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-lg px-4 py-3 text-sm ${
            state.status === "error"
              ? "border border-red-500/30 bg-red-500/10 text-red-300"
              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {state.message}
        </p>
      )}

      {models.length === 0 ? (
        <p className="text-sm text-amber-300">
          No vehicle models are configured yet. Add a model before adding stock.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span>Vehicle model *</span>
              <select name="modelId" required defaultValue="" className={inputClass}>
                <option value="" disabled>Choose model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.brand} · {model.modelName} ({model.vehicleType})
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              <span>Color *</span>
              <input name="color" required maxLength={40} placeholder="e.g. Red" className={inputClass} />
            </label>
            <label className={labelClass}>
              <span>Chassis number *</span>
              <input name="chassisNumber" required maxLength={100} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span>Motor number *</span>
              <input name="motorNumber" required maxLength={100} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span>Controller number</span>
              <input name="controllerNumber" maxLength={100} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span>Battery type</span>
              <select name="batteryType" defaultValue="" className={inputClass}>
                <option value="">Not specified</option>
                <option value="Lead-Acid">Lead-Acid</option>
                <option value="Lithium-Ion">Lithium-Ion</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className={labelClass}>
              <span>Battery brand</span>
              <input name="batteryBrand" maxLength={100} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span>Charger serial</span>
              <input name="chargerSerial" maxLength={100} className={inputClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              <span>Battery serial numbers</span>
              <textarea name="batterySerials" rows={2} placeholder="Separate serials with commas or new lines" className={inputClass} />
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {isPending ? "Adding vehicle..." : "Add to inventory"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
