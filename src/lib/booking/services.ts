import type { BookingService } from "@/lib/booking/types";

export const bookingServices = [
  {
    id: "professional-makeup",
    name: "Profesionalno šminkanje",
    durationMinutes: 60,
    durationLabel: "60 MIN",
    schedulingMode: "appointment",
    active: true,
    description:
      "Šminka prilagođena licu, stilu i prilici, sa fokusom na dugotrajnost i osećaj da i dalje izgledaš kao ti.",
  },
  {
    id: "self-makeup-course",
    name: "Našminkaj se sama",
    durationMinutes: 180,
    durationLabel: "3 ČASA",
    schedulingMode: "inquiry",
    active: true,
    description:
      "Individualni kurs za sve koji žele da nauče kako da pravilno našminkaju sebe i steknu sigurnost u svakodnevnom šminkanju.",
  },
  {
    id: "basic-course",
    name: "Bazni kurs za početnike",
    durationMinutes: 420,
    durationLabel: "7 ČASOVA",
    schedulingMode: "inquiry",
    active: true,
    description:
      "Kurs za početnike koji žele da naprave prve ozbiljne korake u svetu profesionalnog šminkanja.",
  },
  {
    id: "advanced-training",
    name: "Usavršavanje za šminkere",
    durationMinutes: 180,
    durationLabel: "3 ČASA",
    schedulingMode: "inquiry",
    active: true,
    description:
      "Napredniji rad namenjen šminkerima koji već imaju osnovu i žele da unaprede tehniku, preciznost i pristup profesionalnom radu.",
  },
] satisfies BookingService[];

export function getBookingService(serviceId: string) {
  return bookingServices.find((service) => service.id === serviceId && service.active);
}
