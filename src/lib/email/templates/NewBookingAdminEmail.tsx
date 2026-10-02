import type { BookingRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function NewBookingAdminEmail({ booking, adminUrl }: { booking: BookingRecord; adminUrl: string }) {
  return (
    <BookingEmailLayout eyebrow="Yuumi Art booking" title="Novi zahtev za termin">
      <p style={emailStyles.text}>Stigao je novi zahtev za termin. Rezervacija još nije potvrđena.</p>
      <BookingDetails booking={booking} includeCustomer />
      <a href={adminUrl} style={emailStyles.button}>
        Otvori admin
      </a>
    </BookingEmailLayout>
  );
}
