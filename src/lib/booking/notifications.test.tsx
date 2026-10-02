import test, { afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import type { SendEmailInput } from "@/lib/email/client";
import { setEmailSenderForTests } from "@/lib/email/client";
import type { BookingInquiryRecord, BookingRecord } from "@/lib/booking/types";
import {
  notifyBookingStatusTransition,
  notifyInquiryStatusTransition,
  notifyNewBookingRequest,
  notifyNewInquiryRequest,
} from "@/lib/booking/notifications";

const booking: BookingRecord = {
  id: "booking-123",
  service_id: "professional-makeup",
  booking_date: "2026-10-05",
  start_time: "10:00",
  end_time: "11:00",
  status: "pending",
  customer_name: "Ana Markovic",
  phone: "+38160111222",
  email: "ana@example.com",
  instagram: "@ana",
  note: "Test note",
};

const inquiry: BookingInquiryRecord = {
  id: "inquiry-123",
  service_id: "basic-course",
  status: "pending",
  customer_name: "Mila Petrovic",
  phone: "+38160111223",
  email: "mila@example.com",
  instagram: "@mila",
  note: "Želim termin tokom novembra.",
};

let sent: SendEmailInput[] = [];
let consoleError: typeof console.error;

beforeEach(() => {
  process.env.BOOKING_ADMIN_EMAIL = "adriana@example.com";
  sent = [];
  setEmailSenderForTests(async (input) => {
    sent.push(input);
  });
  consoleError = console.error;
  console.error = () => {};
});

afterEach(() => {
  setEmailSenderForTests(undefined);
  delete process.env.BOOKING_ADMIN_EMAIL;
  console.error = consoleError;
});

test("new booking triggers admin email", async () => {
  await notifyNewBookingRequest(booking);

  assert.equal(sent[0].to, "adriana@example.com");
  assert.equal(sent[0].subject, "Novi zahtev za termin - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "new-booking/booking-123");
});

test("new booking with customer email triggers received email", async () => {
  await notifyNewBookingRequest(booking);

  assert.equal(sent.length, 2);
  assert.equal(sent[1].to, "ana@example.com");
  assert.equal(sent[1].subject, "Primili smo tvoj zahtev - Yuumi Art");
  assert.equal(sent[1].idempotencyKey, "booking-received/booking-123");
});

test("missing customer email skips customer email", async () => {
  await notifyNewBookingRequest({ ...booking, email: null });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "adriana@example.com");
});

test("pending to confirmed triggers confirmation email", async () => {
  await notifyBookingStatusTransition("pending", { ...booking, status: "confirmed" });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "ana@example.com");
  assert.equal(sent[0].subject, "Termin je potvrđen - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "booking-confirmed/booking-123");
});

test("pending to rejected triggers rejection email", async () => {
  await notifyBookingStatusTransition("pending", { ...booking, status: "rejected" });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, "Termin nije potvrđen - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "booking-rejected/booking-123");
});

test("confirmed to cancelled triggers cancellation email", async () => {
  await notifyBookingStatusTransition("confirmed", { ...booking, status: "cancelled" });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, "Termin je otkazan - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "booking-cancelled/booking-123");
});

test("confirmed to confirmed does not resend", async () => {
  await notifyBookingStatusTransition("confirmed", { ...booking, status: "confirmed" });

  assert.equal(sent.length, 0);
});

test("provider failure does not break booking persistence notification path", async () => {
  setEmailSenderForTests(async () => {
    throw new Error("provider unavailable");
  });

  await assert.doesNotReject(() => notifyNewBookingRequest(booking));
});

test("provider failure does not break status update notification path", async () => {
  setEmailSenderForTests(async () => {
    throw new Error("provider unavailable");
  });

  await assert.doesNotReject(() => notifyBookingStatusTransition("pending", { ...booking, status: "confirmed" }));
});

test("deterministic idempotency keys are used for all email types", async () => {
  await notifyNewBookingRequest(booking);
  await notifyBookingStatusTransition("pending", { ...booking, status: "confirmed" });
  await notifyBookingStatusTransition("pending", { ...booking, status: "rejected" });
  await notifyBookingStatusTransition("confirmed", { ...booking, status: "cancelled" });

  assert.deepEqual(sent.map((email) => email.idempotencyKey), [
    "new-booking/booking-123",
    "booking-received/booking-123",
    "booking-confirmed/booking-123",
    "booking-rejected/booking-123",
    "booking-cancelled/booking-123",
  ]);
});

test("new education inquiry uses inquiry email copy path", async () => {
  await notifyNewInquiryRequest(inquiry);

  assert.equal(sent.length, 2);
  assert.equal(sent[0].subject, "Novi upit za edukaciju - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "new-inquiry/inquiry-123");
  assert.equal(sent[1].subject, "Primili smo tvoj upit - Yuumi Art");
  assert.equal(sent[1].idempotencyKey, "inquiry-received/inquiry-123");
});

test("pending education inquiry to confirmed triggers accepted email", async () => {
  await notifyInquiryStatusTransition("pending", { ...inquiry, status: "confirmed" });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, "Upit je prihvaćen - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "inquiry-confirmed/inquiry-123");
});

test("pending education inquiry to rejected triggers rejected email", async () => {
  await notifyInquiryStatusTransition("pending", { ...inquiry, status: "rejected" });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, "Upit nije prihvaćen - Yuumi Art");
  assert.equal(sent[0].idempotencyKey, "inquiry-rejected/inquiry-123");
});

test("confirmed education inquiry to cancelled does not send appointment cancellation email", async () => {
  await notifyInquiryStatusTransition("confirmed", { ...inquiry, status: "cancelled" });

  assert.equal(sent.length, 0);
});
