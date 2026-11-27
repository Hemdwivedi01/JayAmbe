"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginFormState = {
  error: string;
};

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    return { error: "Enter your username and password." };
  }

  try {
    await signIn("credentials", {
      username: username.trim(),
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Incorrect username or password." };
      }
      return { error: "Unable to sign in right now. Please try again." };
    }
    throw error;
  }

  return { error: "Unable to sign in right now. Please try again." };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
