import type { ReactNode } from "react";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.BOOKING_FROM_EMAIL;
const adminEmail = process.env.BOOKING_ADMIN_EMAIL;
const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const siteUrl = publicSiteUrl ?? vercelUrl;

const resend = apiKey ? new Resend(apiKey) : null;

export function bookingAdminEmail() {
  return adminEmail;
}

export function bookingSiteUrl() {
  return siteUrl;
}

export function adminUrl() {
  return siteUrl ? `${siteUrl.replace(/\/$/, "")}/admin` : "/admin";
}

type SendEmailInput = {
  to: string;
  subject: string;
  react: ReactNode;
  idempotencyKey: string;
};

export async function sendTransactionalEmail(input: SendEmailInput) {
  if (!resend || !from) {
    console.warn("Booking email skipped: RESEND_API_KEY or BOOKING_FROM_EMAIL is not configured.");
    return;
  }

  const result = await resend.emails.send(
    {
      from,
      to: input.to,
      subject: input.subject,
      react: input.react,
    },
    { idempotencyKey: input.idempotencyKey },
  );

  if (result.error) throw new Error(result.error.message);
}
