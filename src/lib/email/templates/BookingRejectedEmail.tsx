import type { BookingRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function BookingRejectedEmail({ booking, siteUrl }: { booking: BookingRecord; siteUrl?: string }) {
  return (
    <BookingEmailLayout eyebrow="Yummi Art" title="Termin nije potvrđen">
      <p style={emailStyles.text}>
        Žao nam je, izabrani termin nije moguće potvrditi. Vrati se na sajt i izaberi neki drugi slobodan termin.
      </p>
      <BookingDetails booking={{ ...booking, status: "rejected" }} />
      {siteUrl ? (
        <a href={siteUrl} style={emailStyles.button}>
          Izaberi drugi termin
        </a>
      ) : null}
    </BookingEmailLayout>
  );
}
