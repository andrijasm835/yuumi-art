import type { BookingRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function BookingConfirmedEmail({ booking }: { booking: BookingRecord }) {
  return (
    <BookingEmailLayout eyebrow="Yummi Art" title="Termin je potvrđen">
      <p style={emailStyles.text}>
        {booking.customer_name ? `${booking.customer_name}, t` : "T"}voj termin je potvrđen. Vidimo se u izabranom
        terminu.
      </p>
      <BookingDetails booking={{ ...booking, status: "confirmed" }} />
    </BookingEmailLayout>
  );
}
