import type { BookingRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function BookingReceivedEmail({ booking }: { booking: BookingRecord }) {
  return (
    <BookingEmailLayout eyebrow="Yuumi Art" title="Primili smo tvoj zahtev">
      <p style={emailStyles.text}>
        Tvoj zahtev za termin je primljen, ali termin još nije potvrđen. Adriana će ga pregledati i potvrditi ili
        odbiti u skladu sa dostupnošću.
      </p>
      <BookingDetails booking={booking} />
    </BookingEmailLayout>
  );
}
