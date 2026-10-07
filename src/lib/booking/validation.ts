import type { CustomerDetails } from "@/lib/booking/types";

type CustomerValidationOptions = {
  requireEmail?: boolean;
};

export function validateCustomerDetails(details: CustomerDetails, options: CustomerValidationOptions = {}) {
  const errors: Partial<Record<keyof CustomerDetails, string>> = {};
  const requireEmail = options.requireEmail ?? true;
  const fullName = details.fullName.trim();
  const phone = details.phone?.trim() ?? "";
  const email = details.email.trim();
  const instagram = details.instagram?.trim() ?? "";
  const note = details.note?.trim() ?? "";

  if (!fullName) errors.fullName = "Ime i prezime je obavezno.";
  if (fullName.length > 120) errors.fullName = "Ime je predugačko.";
  if (phone && !/^[+()\d\s-]{6,24}$/.test(phone)) errors.phone = "Unesi ispravan broj telefona.";
  if (requireEmail && !email) errors.email = "Email je obavezan.";
  if (email.length > 160) errors.email = "Email je predugačak.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Unesi ispravnu email adresu.";
  if (instagram.length > 80) errors.instagram = "Instagram korisničko ime je predugačko.";
  if (instagram && !/^@?[A-Za-z0-9._]{1,80}$/.test(instagram)) errors.instagram = "Unesi ispravan Instagram profil.";
  if (note.length > 800) errors.note = "Napomena može imati najviše 800 karaktera.";

  return errors;
}

export function hasValidationErrors(errors: Record<string, unknown>) {
  return Object.values(errors).some(Boolean);
}
