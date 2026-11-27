import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created (username: admin, password: admin123)");

  // 2. Create vehicle models
  const models = [
    {
      modelName: "Jay Ambe Standard E-Rickshaw",
      hsnSacCode: "8703",
      basePrice: 95000,
      gstRate: 5.0,
    },
    {
      modelName: "Jay Ambe Deluxe E-Rickshaw",
      hsnSacCode: "8703",
      basePrice: 110000,
      gstRate: 5.0,
    },
    {
      modelName: "Jay Ambe E-Loader (Cargo)",
      hsnSacCode: "8704",
      basePrice: 105000,
      gstRate: 5.0,
    },
  ];

  for (const model of models) {
    await prisma.vehicleModel.upsert({
      where: { id: models.indexOf(model) + 1 },
      update: {},
      create: model,
    });
  }
  console.log("✓ 3 vehicle models created");

  // 3. Create financers
  const financers = [
    {
      financerName: "Mahindra Finance",
      contactPerson: "Ramesh Kumar",
      phoneNumber: "9876543210",
    },
    {
      financerName: "Bajaj Finance",
      contactPerson: "Suresh Verma",
      phoneNumber: "9871234567",
    },
    {
      financerName: "HDB Financial Services",
      contactPerson: "Priya Singh",
      phoneNumber: "9812345678",
    },
    {
      financerName: "Muthoot Finance",
      contactPerson: "Anil Sharma",
      phoneNumber: "9823456789",
    },
  ];

  for (const financer of financers) {
    await prisma.financer.upsert({
      where: { id: financers.indexOf(financer) + 1 },
      update: {},
      create: financer,
    });
  }
  console.log("✓ 4 financers created");

  // 4. Sample vehicles
  await prisma.vehicle.upsert({
    where: { chassisNumber: "JA2026001" },
    update: {},
    create: {
      modelId: 1,
      chassisNumber: "JA2026001",
      motorNumber: "MT2026001",
      controllerNumber: "CT2026001",
      color: "Red",
      batteryBrand: "Amara Raja",
      batterySerials: JSON.stringify(["AR001", "AR002", "AR003", "AR004"]),
      chargerSerial: "CHG2026001",
      status: "AVAILABLE",
    },
  });

  await prisma.vehicle.upsert({
    where: { chassisNumber: "JA2026002" },
    update: {},
    create: {
      modelId: 2,
      chassisNumber: "JA2026002",
      motorNumber: "MT2026002",
      controllerNumber: "CT2026002",
      color: "Blue",
      batteryBrand: "Exide",
      batterySerials: JSON.stringify(["EX001", "EX002", "EX003", "EX004"]),
      chargerSerial: "CHG2026002",
      status: "AVAILABLE",
    },
  });
  console.log("✓ 2 sample vehicles added");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
