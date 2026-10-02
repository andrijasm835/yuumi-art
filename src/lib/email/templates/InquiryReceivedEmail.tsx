import type { BookingInquiryRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function InquiryReceivedEmail({ inquiry }: { inquiry: BookingInquiryRecord }) {
  return (
    <BookingEmailLayout eyebrow="Yuumi Art" title="Primili smo tvoj upit">
      <p style={emailStyles.text}>
        Tvoj upit je primljen. Adriana će ti se javiti radi dogovora termina i organizacije.
      </p>
      <BookingDetails booking={{ ...inquiry, recordType: "inquiry" }} />
    </BookingEmailLayout>
  );
}
