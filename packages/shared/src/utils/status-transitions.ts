import { BookingStatus } from '../constants/booking-status';

export const VALID_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.BOOKING_CREATED]: [BookingStatus.PAYMENT_PENDING],
  [BookingStatus.PAYMENT_PENDING]: [BookingStatus.PAYMENT_CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.PAYMENT_CONFIRMED]: [BookingStatus.WAITING_FOR_SERVICE],
  [BookingStatus.WAITING_FOR_SERVICE]: [BookingStatus.STAFF_ASSIGNED, BookingStatus.CANCELLED],
  [BookingStatus.STAFF_ASSIGNED]: [BookingStatus.STAFF_ON_THE_WAY, BookingStatus.CANCELLED],
  [BookingStatus.STAFF_ON_THE_WAY]: [BookingStatus.ARRIVED],
  [BookingStatus.ARRIVED]: [BookingStatus.VEHICLE_RECEIVED],
  [BookingStatus.VEHICLE_RECEIVED]: [BookingStatus.VEHICLE_INSPECTION],
  [BookingStatus.VEHICLE_INSPECTION]: [BookingStatus.WASHING, BookingStatus.ISSUE_REPORTED],
  [BookingStatus.WASHING]: [BookingStatus.DETAILING, BookingStatus.ISSUE_REPORTED],
  [BookingStatus.DETAILING]: [BookingStatus.FINAL_INSPECTION],
  [BookingStatus.FINAL_INSPECTION]: [BookingStatus.WAITING_FOR_CUSTOMER_CONFIRMATION],
  [BookingStatus.WAITING_FOR_CUSTOMER_CONFIRMATION]: [BookingStatus.COMPLETED, BookingStatus.PAYMENT_REMAINING],
  [BookingStatus.PAYMENT_REMAINING]: [BookingStatus.COMPLETED],
  [BookingStatus.ISSUE_REPORTED]: [BookingStatus.WASHING, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: []
};

export function isValidTransition(from: BookingStatus, to: BookingStatus): boolean {
  const allowedTransitions = VALID_STATUS_TRANSITIONS[from];
  return allowedTransitions ? allowedTransitions.includes(to) : false;
}
