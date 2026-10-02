import type { ReactNode } from "react";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

const resend = apiKey ? new Resend(apiKey) : null;

export function bookingAdminEmail() {
  return process.env.BOOKING_ADMIN_EMAIL;
}

export function bookingSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
}

export function adminUrl() {
  const siteUrl = bookingSiteUrl();
  return siteUrl ? `${siteUrl.replace(/\/$/, "")}/admin` : "/admin";
}

export type SendEmailInput = {
  to: string;
  subject: string;
  react: ReactNode;
  idempotencyKey: string;
};

let testSender: ((input: SendEmailInput) => Promise<void>) | undefined;

export function setEmailSenderForTests(sender?: (input: SendEmailInput) => Promise<void>) {
  testSender = sender;
}

export async function sendTransactionalEmail(input: SendEmailInput) {
  if (testSender) {
    await testSender(input);
    return;
  }

  const from = process.env.BOOKING_FROM_EMAIL;
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
