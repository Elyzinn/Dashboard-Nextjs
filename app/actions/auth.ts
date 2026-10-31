"use server";

import { redirect } from "next/navigation";
import {
  findUserByEmail,
  createUser,
} from "@/lib/database";
import { hashPassword, startSession, verifyPassword, endSession } from "@/lib/auth";

function getField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(formData: FormData): Promise<never> {
  const name = getField(formData, "name");
  const email = getField(formData, "email").toLowerCase();
  const password = formData.get("password");

  if (
    name.length < 2 ||
    name.length > 80 ||
    !isValidEmail(email) ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    redirect("/cadastro?erro=dados");
  }

  const userId = createUser(name, email, hashPassword(password));
  if (!userId) redirect("/cadastro?erro=email");

  await startSession(userId);
  redirect("/dashboard");
}

export async function login(formData: FormData): Promise<never> {
  const email = getField(formData, "email").toLowerCase();
  const password = formData.get("password");
  const user = isValidEmail(email) ? findUserByEmail(email) : null;

  if (
    !user ||
    typeof password !== "string" ||
    password.length > 128 ||
    !verifyPassword(password, user.passwordHash)
  ) {
    redirect("/?erro=credenciais");
  }

  await startSession(user.id);
  redirect("/dashboard");
}

export async function logout(): Promise<never> {
  await endSession();
  redirect("/");
}
