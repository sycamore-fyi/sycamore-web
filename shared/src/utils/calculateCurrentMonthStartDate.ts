import { addMonths, isBefore, startOfDay, startOfToday } from "date-fns";

export function calculateCurrentMonthStartDate(joinDate: Date): Date {
  const currentDate = startOfToday();

  let currentMonthStartDate = startOfDay(joinDate);

  while (isBefore(addMonths(currentMonthStartDate, 1), currentDate)) {
    currentMonthStartDate = addMonths(currentMonthStartDate, 1);
  }

  return currentMonthStartDate;
}