import type { BookingInquiryRecord, BookingRecord, BookingStatus } from "@/lib/booking/types";
import { adminUrl, bookingAdminEmail, bookingSiteUrl, sendTransactionalEmail } from "@/lib/email/client";
import { BookingCancelledEmail } from "@/lib/email/templates/BookingCancelledEmail";
import { BookingConfirmedEmail } from "@/lib/email/templates/BookingConfirmedEmail";
import { BookingReceivedEmail } from "@/lib/email/templates/BookingReceivedEmail";
import { BookingRejectedEmail } from "@/lib/email/templates/BookingRejectedEmail";
import { NewBookingAdminEmail } from "@/lib/email/templates/NewBookingAdminEmail";
import { InquiryConfirmedEmail } from "@/lib/email/templates/InquiryConfirmedEmail";
import { InquiryReceivedEmail } from "@/lib/email/templates/InquiryReceivedEmail";
import { InquiryRejectedEmail } from "@/lib/email/templates/InquiryRejectedEmail";

export async function notifyNewBookingRequest(booking: BookingRecord) {
  await safelySend("new booking request", async () => {
    const adminEmail = bookingAdminEmail();
    if (adminEmail) {
      await sendTransactionalEmail({
        to: adminEmail,
        subject: "Novi zahtev za termin - Yuumi Art",
        react: <NewBookingAdminEmail booking={booking} adminUrl={adminUrl()} />,
        idempotencyKey: `new-booking/${booking.id}`,
      });
    }

    if (booking.email) {
      await sendTransactionalEmail({
        to: booking.email,
        subject: "Primili smo tvoj zahtev - Yuumi Art",
        react: <BookingReceivedEmail booking={booking} />,
        idempotencyKey: `booking-received/${booking.id}`,
      });
    }
  });
}

export async function notifyNewInquiryRequest(inquiry: BookingInquiryRecord) {
  await safelySend("new inquiry request", async () => {
    const adminEmail = bookingAdminEmail();
    if (adminEmail) {
      await sendTransactionalEmail({
        to: adminEmail,
        subject: "Novi upit za edukaciju - Yuumi Art",
        react: <NewBookingAdminEmail booking={{ ...inquiry, recordType: "inquiry" }} adminUrl={adminUrl()} />,
        idempotencyKey: `new-inquiry/${inquiry.id}`,
      });
    }

    if (inquiry.email) {
      await sendTransactionalEmail({
        to: inquiry.email,
        subject: "Primili smo tvoj upit - Yuumi Art",
        react: <InquiryReceivedEmail inquiry={inquiry} />,
        idempotencyKey: `inquiry-received/${inquiry.id}`,
      });
    }
  });
}

export async function notifyBookingConfirmed(booking: BookingRecord) {
  if (!booking.email) return;
  await safelySend("booking confirmed", () =>
    sendTransactionalEmail({
      to: booking.email as string,
      subject: "Termin je potvrđen - Yuumi Art",
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
      subject: "Termin nije potvrđen - Yuumi Art",
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
      subject: "Termin je otkazan - Yuumi Art",
      react: <BookingCancelledEmail booking={booking} />,
      idempotencyKey: `booking-cancelled/${booking.id}`,
    }),
  );
}

export async function notifyBookingStatusTransition(previousStatus: BookingStatus, booking: BookingRecord) {
  if (previousStatus === booking.status) return;
  if (previousStatus === "pending" && booking.status === "confirmed") {
    await notifyBookingConfirmed(booking);
  }
  if (previousStatus === "pending" && booking.status === "rejected") {
    await notifyBookingRejected(booking);
  }
  if (previousStatus === "confirmed" && booking.status === "cancelled") {
    await notifyBookingCancelled(booking);
  }
}

export async function notifyInquiryStatusTransition(previousStatus: BookingStatus, inquiry: BookingInquiryRecord) {
  if (previousStatus === inquiry.status || !inquiry.email) return;
  if (previousStatus === "pending" && inquiry.status === "confirmed") {
    await safelySend("inquiry confirmed", () =>
      sendTransactionalEmail({
        to: inquiry.email as string,
        subject: "Upit je prihvaćen - Yuumi Art",
        react: <InquiryConfirmedEmail inquiry={inquiry} />,
        idempotencyKey: `inquiry-confirmed/${inquiry.id}`,
      }),
    );
  }
  if (previousStatus === "pending" && inquiry.status === "rejected") {
    await safelySend("inquiry rejected", () =>
      sendTransactionalEmail({
        to: inquiry.email as string,
        subject: "Upit nije prihvaćen - Yuumi Art",
        react: <InquiryRejectedEmail inquiry={inquiry} />,
        idempotencyKey: `inquiry-rejected/${inquiry.id}`,
      }),
    );
  }
}

async function safelySend(label: string, send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error(`Booking email failed: ${label}`, error);
  }
}
