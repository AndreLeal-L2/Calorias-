"use server";

import { createSessionCookie, getAppSecret, isValidSecretCode } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const code = String(formData.get("code") ?? "");

  if (!isValidSecretCode(code, getAppSecret())) {
    return { error: "Codigo incorreto." };
  }

  await createSessionCookie();
  redirect("/");
}
