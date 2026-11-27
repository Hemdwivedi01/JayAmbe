ALTER TABLE "Customer" ADD COLUMN "gstin" TEXT;

ALTER TABLE "VehicleModel" ADD COLUMN "brand" TEXT NOT NULL DEFAULT 'Jay Ambe';
ALTER TABLE "VehicleModel" ADD COLUMN "vehicleType" TEXT NOT NULL DEFAULT 'Passenger E-Rickshaw';

UPDATE "VehicleModel"
SET "vehicleType" = 'Loader / Cargo'
WHERE "modelName" LIKE '%Loader%' OR "modelName" LIKE '%Cargo%';

ALTER TABLE "Vehicle" ADD COLUMN "batteryType" TEXT;
