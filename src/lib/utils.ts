import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomCode = (length: number, prefix: string) => {
  let generatedString = prefix;
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randombytes = randomBytes(length)
  for (const byte of randombytes) {
      const randomIndex = byte % charset.length;
      generatedString += charset[randomIndex];
  }
  return generatedString.slice(0, length)
}