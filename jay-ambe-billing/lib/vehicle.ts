export function formatBatterySerials(value: string): string {
  try {
    const serials: unknown = JSON.parse(value);
    if (Array.isArray(serials) && serials.every((serial) => typeof serial === "string")) {
      return serials.join(", ") || "Not specified";
    }
  } catch {
    return value || "Not specified";
  }
  return value || "Not specified";
}
