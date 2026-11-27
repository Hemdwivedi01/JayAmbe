import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, IndianRupee, CarFront } from "lucide-react";

export default function Dashboard() {
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
            <div className="text-2xl font-bold text-white">₹45,231.89</div>
            <p className="text-xs text-emerald-500 mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Invoices Issued</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+245</div>
            <p className="text-xs text-blue-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+1,204</div>
            <p className="text-xs text-purple-500 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Vehicles in Stock</CardTitle>
            <CarFront className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">32</div>
            <p className="text-xs text-slate-500 mt-1">4 pending delivery</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Dummy Data for now */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                      INV
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">INV-2026-00{i}</p>
                      <p className="text-xs text-slate-400">Jane Doe • Today, 12:00 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">₹1,15,000</p>
                    <p className="text-xs text-emerald-400 font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full mt-1">Paid</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Available Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Jay Ambe Standard E-Rickshaw", qty: 12, color: "Red" },
                { name: "Jay Ambe Deluxe E-Rickshaw", qty: 8, color: "Blue" },
                { name: "Jay Ambe E-Loader", qty: 12, color: "Green" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">Color: {item.color}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{item.qty} in stock</p>
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
