import type { BookingInquiryRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function InquiryConfirmedEmail({ inquiry }: { inquiry: BookingInquiryRecord }) {
  return (
    <BookingEmailLayout eyebrow="Yuumi Art" title="Upit je prihvaćen">
      <p style={emailStyles.text}>Adriana će te kontaktirati radi dogovora termina.</p>
      <BookingDetails booking={{ ...inquiry, recordType: "inquiry", status: "confirmed" }} />
    </BookingEmailLayout>
  );
}
