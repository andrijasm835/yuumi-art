import type { ReactNode } from "react";
import { emailStyles } from "@/lib/email/templates/styles";

type BookingEmailLayoutProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: string;
};

export function BookingEmailLayout({ eyebrow, title, children, footer }: BookingEmailLayoutProps) {
  return (
    <html lang="sr">
      <body style={emailStyles.body}>
        <div style={emailStyles.shell}>
          <div style={emailStyles.card}>
            <p style={emailStyles.eyebrow}>{eyebrow}</p>
            <h1 style={emailStyles.heading}>{title}</h1>
            {children}
          </div>
          <p style={emailStyles.footer}>{footer ?? "Yummi Art · Adriana · Lebane"}</p>
        </div>
      </body>
    </html>
  );
}
