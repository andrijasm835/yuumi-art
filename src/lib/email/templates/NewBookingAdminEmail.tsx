import type { AdminBookingItem } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function NewBookingAdminEmail({ booking, adminUrl }: { booking: AdminBookingItem; adminUrl: string }) {
  const isInquiry = booking.recordType === "inquiry";
  return (
    <BookingEmailLayout eyebrow="Yuumi Art booking" title={isInquiry ? "Novi upit za edukaciju" : "Novi zahtev za termin"}>
      <p style={emailStyles.text}>
        {isInquiry ? "Stigao je novi upit za edukaciju. Potrebno je javiti se radi dogovora." : "Stigao je novi zahtev za termin. Rezervacija još nije potvrđena."}
      </p>
      <BookingDetails booking={booking} includeCustomer />
      <a href={adminUrl} style={emailStyles.button}>
        Otvori admin
      </a>
    </BookingEmailLayout>
  );
}
