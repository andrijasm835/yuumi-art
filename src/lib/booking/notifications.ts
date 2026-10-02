import type { BookingRecord } from "@/lib/booking/types";

export async function notifyNewBookingRequest(booking: BookingRecord) {
  void booking;
  // Email/SMS provider intentionally not configured yet.
}

export async function notifyBookingConfirmed(booking: BookingRecord) {
  void booking;
  // Hook reserved for customer notification integration.
}

export async function notifyBookingRejected(booking: BookingRecord) {
  void booking;
  // Hook reserved for customer notification integration.
}
