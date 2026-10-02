import type { BookingInquiryRecord } from "@/lib/booking/types";
import { BookingDetails } from "@/lib/email/templates/BookingDetails";
import { BookingEmailLayout } from "@/lib/email/templates/BookingEmailLayout";
import { emailStyles } from "@/lib/email/templates/styles";

export function InquiryRejectedEmail({ inquiry }: { inquiry: BookingInquiryRecord }) {
  return (
    <BookingEmailLayout eyebrow="Yuumi Art" title="Upit nije prihvaćen">
      <p style={emailStyles.text}>Žao nam je, ovaj upit trenutno nije moguće prihvatiti.</p>
      <BookingDetails booking={{ ...inquiry, recordType: "inquiry", status: "rejected" }} />
    </BookingEmailLayout>
  );
}
