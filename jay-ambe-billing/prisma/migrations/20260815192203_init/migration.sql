-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "aadhaarNumber" TEXT,
    "panNumber" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Mau',
    "state" TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    "pincode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelName" TEXT NOT NULL,
    "hsnSacCode" TEXT NOT NULL DEFAULT '8703',
    "basePrice" REAL NOT NULL,
    "gstRate" REAL NOT NULL DEFAULT 5.00,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelId" INTEGER NOT NULL,
    "chassisNumber" TEXT NOT NULL,
    "motorNumber" TEXT NOT NULL,
    "controllerNumber" TEXT,
    "color" TEXT NOT NULL,
    "batteryBrand" TEXT,
    "batterySerials" TEXT NOT NULL DEFAULT '[]',
    "chargerSerial" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vehicle_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Financer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "financerName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phoneNumber" TEXT
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "exShowroomPrice" REAL NOT NULL,
    "rtoCharges" REAL NOT NULL DEFAULT 0,
    "insuranceCharges" REAL NOT NULL DEFAULT 0,
    "accessoriesCharges" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "taxableAmount" REAL NOT NULL,
    "cgstRate" REAL NOT NULL DEFAULT 2.50,
    "cgstAmount" REAL NOT NULL,
    "sgstRate" REAL NOT NULL DEFAULT 2.50,
    "sgstAmount" REAL NOT NULL,
    "igstRate" REAL NOT NULL DEFAULT 0,
    "igstAmount" REAL NOT NULL DEFAULT 0,
    "grandTotal" REAL NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "downPayment" REAL NOT NULL DEFAULT 0,
    "financerId" INTEGER,
    "financeAmount" REAL NOT NULL DEFAULT 0,
    "loanApprovalNo" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_financerId_fkey" FOREIGN KEY ("financerId") REFERENCES "Financer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_aadhaarNumber_key" ON "Customer"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_chassisNumber_key" ON "Vehicle"("chassisNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_motorNumber_key" ON "Vehicle"("motorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_vehicleId_key" ON "Invoice"("vehicleId");
