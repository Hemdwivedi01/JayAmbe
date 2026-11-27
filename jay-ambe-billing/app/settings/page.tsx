import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Configure dealership details and preferences.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Dealership Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-slate-300">
            <div className="grid grid-cols-3 gap-4 border-b border-slate-800 py-4">
              <div className="font-medium">Dealership Name</div>
              <div className="col-span-2 text-slate-400">Jay Ambe E-Rickshaw</div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-slate-800 py-4">
              <div className="font-medium">GSTIN</div>
              <div className="col-span-2 text-slate-400">09XXXXXXXXXXXXX</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="font-medium">Address</div>
              <div className="col-span-2 text-slate-400">Main Market, Mau, Uttar Pradesh - 275101</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
