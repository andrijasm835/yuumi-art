import type { BookingSchedulingMode } from "@/lib/booking/types";

export const appointmentSteps = ["USLUGA", "DATUM", "VREME", "PODACI", "POTVRDA"] as const;
export const inquirySteps = ["USLUGA", "PODACI", "POTVRDA"] as const;

export function stepsForSchedulingMode(mode: BookingSchedulingMode | undefined) {
  return mode === "inquiry" ? inquirySteps : appointmentSteps;
}

export function nextSelectionState(previousMode: BookingSchedulingMode | undefined, nextMode: BookingSchedulingMode) {
  return {
    shouldClearAppointmentFields: previousMode === "appointment" && nextMode === "inquiry",
    step: 0,
  };
}
