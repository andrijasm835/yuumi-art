import { NextResponse } from "next/server";
import { bookingServices } from "@/lib/booking/services";

export function GET() {
  return NextResponse.json({ services: bookingServices.filter((service) => service.active) });
}
