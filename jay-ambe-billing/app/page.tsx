import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, IndianRupee, CarFront } from "lucide-react";
import { prisma } from "@/lib/prisma";
import VehicleCreateForm from "@/app/vehicles/vehicle-create-form";

export default async function Dashboard() {
  const [invoiceCount, revenue, customerCount, availableVehicles, vehicleModels] = await Promise.all([
    prisma.invoice.count(),
    prisma.invoice.aggregate({ _sum: { grandTotal: true } }),
    prisma.customer.count(),
    prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      select: { color: true, model: { select: { modelName: true } } },
      orderBy: [{ model: { modelName: "asc" } }, { color: "asc" }],
    }),
    prisma.vehicleModel.findMany({
      select: { id: true, brand: true, modelName: true, vehicleType: true },
      orderBy: [{ brand: "asc" }, { modelName: "asc" }],
    }),
  ]);

  const inventory = availableVehicles.reduce<
    { name: string; color: string; quantity: number }[]
  >((groups, vehicle) => {
    const existing = groups.find(
      (group) => group.name === vehicle.model.modelName && group.color === vehicle.color,
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      groups.push({
        name: vehicle.model.modelName,
        color: vehicle.color,
        quantity: 1,
      });
    }
    return groups;
  }, []);

  const totalRevenue = revenue._sum.grandTotal ?? 0;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome back to the Jay Ambe E-Rickshaw billing portal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total value of saved invoices</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Invoices Issued</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{invoiceCount.toLocaleString("en-IN")}</div>
            <p className="text-xs text-slate-500 mt-1">Invoices saved</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{customerCount.toLocaleString("en-IN")}</div>
            <p className="text-xs text-slate-500 mt-1">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Vehicles in Stock</CardTitle>
            <CarFront className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{availableVehicles.length.toLocaleString("en-IN")}</div>
            <p className="text-xs text-slate-500 mt-1">Available vehicles</p>
          </CardContent>
        </Card>
      </div>

      <Card id="add-vehicle" className="scroll-mt-6 border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Add Vehicle to Inventory</CardTitle>
          <p className="text-sm text-slate-400">
            Register a vehicle using an existing model. It will be available for invoicing immediately.
          </p>
        </CardHeader>
        <CardContent>
          <VehicleCreateForm models={vehicleModels} />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Available Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventory.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No vehicles are currently available.</p>
              ) : inventory.map((item) => (
                <div key={`${item.name}-${item.color}`} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">Color: {item.color}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{item.quantity} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
