import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm, { LoginBrand } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/50 via-slate-950 to-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 sm:p-10">
        <LoginBrand />
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to your billing dashboard.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
