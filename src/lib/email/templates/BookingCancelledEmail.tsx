import type { BookingRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function BookingCancelledEmail({ booking }: { booking: BookingRecord }) {
  return (
    <BookingEmailLayout eyebrow="Yummi Art" title="Termin je otkazan">
      <p style={emailStyles.text}>
        Tvoj prethodno potvrđen termin je otkazan. Za novi termin možeš ponovo poslati zahtev preko sajta.
      </p>
      <BookingDetails booking={{ ...booking, status: "cancelled" }} />
    </BookingEmailLayout>
  );
}
