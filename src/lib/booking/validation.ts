import type { CustomerDetails } from "@/lib/booking/types";

export function validateCustomerDetails(details: CustomerDetails) {
  const errors: Partial<Record<keyof CustomerDetails, string>> = {};

  if (!details.fullName.trim()) errors.fullName = "Ime i prezime je obavezno.";
  if (details.fullName.trim().length > 120) errors.fullName = "Ime je predugačko.";
  if (!details.phone.trim()) errors.phone = "Telefon je obavezan.";
  if (details.phone.trim() && !/^[+()\d\s-]{6,24}$/.test(details.phone.trim())) errors.phone = "Unesi ispravan broj telefona.";
  if (details.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.email = "Unesi ispravnu email adresu.";
  if (details.instagram && details.instagram.length > 80) errors.instagram = "Instagram korisničko ime je predugačko.";
  if (details.note && details.note.length > 800) errors.note = "Napomena može imati najviše 800 karaktera.";

  return errors;
}

export function hasValidationErrors(errors: Record<string, unknown>) {
  return Object.values(errors).some(Boolean);
}
