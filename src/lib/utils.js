import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import countries from "@/data/countries.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getFlagUrl = (code) => {
  const country = countries.find((c) => c.code === code);
  return country?.flag || `https://flagcdn.com/w40/${code.toLowerCase()}.png`; // fallback
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const shortName = (name, limit = 10) => {
  if (!name) return "Anonymous";
  return name.length > limit ? name.slice(0, limit) + ".." : name;
};

export const TOP_3_AVATARS = [
  "/images/winner1.png",
  "/images/winner2.png",
  "/images/winner3.png",
];
