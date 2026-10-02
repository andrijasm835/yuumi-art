export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

export type BookingService = {
  id: string;
  name: string;
  durationMinutes: number;
  active: boolean;
  description?: string;
  price?: number;
};

export type BookingRecord = {
  id?: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  customer_name?: string;
  phone?: string;
  email?: string | null;
  instagram?: string | null;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type WeeklyAvailability = {
  id?: string;
  weekday: number;
  start_time: string;
  end_time: string;
  active: boolean;
};

export type AvailabilityExceptionType = "blocked_day" | "blocked_interval" | "custom_availability";

export type AvailabilityException = {
  id?: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  type: AvailabilityExceptionType;
  reason?: string | null;
};

export type TimeInterval = {
  start: string;
  end: string;
};

export type CustomerDetails = {
  fullName: string;
  phone: string;
  email?: string;
  instagram?: string;
  note?: string;
};
