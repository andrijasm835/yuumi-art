import type { BookingRecord } from "@/lib/booking/types";
import { getBookingService } from "@/lib/booking/services";
import { emailStyles } from "@/lib/email/templates/styles";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <p style={emailStyles.row}>
      <span style={emailStyles.label}>{label}</span>
      <span>{value}</span>
    </p>
  );
}

export function BookingDetails({ booking, includeCustomer = false }: { booking: BookingRecord; includeCustomer?: boolean }) {
  const service = getBookingService(booking.service_id);

  return (
    <div style={emailStyles.details}>
      {includeCustomer ? <Row label="Ime" value={booking.customer_name} /> : null}
      {includeCustomer ? <Row label="Telefon" value={booking.phone} /> : null}
      {includeCustomer ? <Row label="Email" value={booking.email} /> : null}
      {includeCustomer ? <Row label="Instagram" value={booking.instagram} /> : null}
      <Row label="Usluga" value={service?.name ?? booking.service_id} />
      <Row label="Datum" value={booking.booking_date} />
      <Row label="Vreme" value={`${booking.start_time.slice(0, 5)}-${booking.end_time.slice(0, 5)}`} />
      <Row label="Status" value={booking.status.toUpperCase()} />
      {includeCustomer ? <Row label="Napomena" value={booking.note} /> : null}
    </div>
  );
}
