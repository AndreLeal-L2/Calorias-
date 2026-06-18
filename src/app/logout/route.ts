import { clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  await clearSessionCookie();
  redirect("/login");
}
