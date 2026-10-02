import type { BookingRecord } from "@/lib/booking/types";
import { adminUrl, bookingAdminEmail, bookingSiteUrl, sendTransactionalEmail } from "@/lib/email/client";
import { BookingCancelledEmail } from "@/lib/email/templates/BookingCancelledEmail";
import { BookingConfirmedEmail } from "@/lib/email/templates/BookingConfirmedEmail";
import { BookingReceivedEmail } from "@/lib/email/templates/BookingReceivedEmail";
import { BookingRejectedEmail } from "@/lib/email/templates/BookingRejectedEmail";
import { NewBookingAdminEmail } from "@/lib/email/templates/NewBookingAdminEmail";

export async function notifyNewBookingRequest(booking: BookingRecord) {
  await safelySend("new booking request", async () => {
    const adminEmail = bookingAdminEmail();
    if (adminEmail) {
      await sendTransactionalEmail({
        to: adminEmail,
        subject: "Novi zahtev za termin - Yummi Art",
        react: <NewBookingAdminEmail booking={booking} adminUrl={adminUrl()} />,
        idempotencyKey: `new-booking/${booking.id}`,
      });
    }

    if (booking.email) {
      await sendTransactionalEmail({
        to: booking.email,
        subject: "Primili smo tvoj zahtev - Yummi Art",
        react: <BookingReceivedEmail booking={booking} />,
        idempotencyKey: `booking-received/${booking.id}`,
      });
    }
  });
}

export async function notifyBookingConfirmed(booking: BookingRecord) {
  if (!booking.email) return;
  await safelySend("booking confirmed", () =>
    sendTransactionalEmail({
      to: booking.email as string,
      subject: "Termin je potvrđen - Yummi Art",
      react: <BookingConfirmedEmail booking={booking} />,
      idempotencyKey: `booking-confirmed/${booking.id}`,
    }),
  );
}

export async function notifyBookingRejected(booking: BookingRecord) {
  if (!booking.email) return;
  await safelySend("booking rejected", () =>
    sendTransactionalEmail({
      to: booking.email as string,
      subject: "Termin nije potvrđen - Yummi Art",
      react: <BookingRejectedEmail booking={booking} siteUrl={bookingSiteUrl()} />,
      idempotencyKey: `booking-rejected/${booking.id}`,
    }),
  );
}

export async function notifyBookingCancelled(booking: BookingRecord) {
  if (!booking.email) return;
  await safelySend("booking cancelled", () =>
    sendTransactionalEmail({
      to: booking.email as string,
      subject: "Termin je otkazan - Yummi Art",
      react: <BookingCancelledEmail booking={booking} />,
      idempotencyKey: `booking-cancelled/${booking.id}`,
    }),
  );
}

async function safelySend(label: string, send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error(`Booking email failed: ${label}`, error);
  }
}
