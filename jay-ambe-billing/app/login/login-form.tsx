"use client";

import { useActionState } from "react";
import { ArrowRight, CarFront } from "lucide-react";
import { loginAction, type LoginFormState } from "./actions";

const initialState: LoginFormState = { error: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-slate-300">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          placeholder="Enter your username"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          placeholder="Enter your password"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
        {!isPending && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
      </button>
    </form>
  );
}

export function LoginBrand() {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
        <CarFront aria-hidden="true" className="h-7 w-7" />
      </span>
      <span className="text-left">
        <span className="block text-xl font-bold tracking-wide text-white">Jay Ambe</span>
        <span className="block text-xs text-slate-400">E-Rickshaw Billing</span>
      </span>
    </div>
  );
}
