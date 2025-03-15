/**
 * Service for date-related utility functions
 */

import { format, addDays, startOfDay, addHours, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Generates available dates for the next 14 days, excluding Sundays
 */
export function generateAvailableDates(): Date[] {
  // Generate dates for the next 14 days
  const dates = [];
  const today = startOfDay(new Date());
  
  for (let i = 1; i <= 14; i++) {
    const date = addDays(today, i);
    // Exclude Sundays (0 is Sunday in JavaScript)
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  
  return dates;
}

/**
 * Generates basic time slots for a given date
 */
export function generateBasicTimeSlots(date: Date): string[] {
  // Generate time slots from 9 AM to 6 PM
  const times = [];
  const startTime = addHours(startOfDay(date), 9); // 9 AM
  const endTime = addHours(startOfDay(date), 18); // 6 PM
  const now = new Date();
  
  // Time slots every 30 minutes
  for (let time = startTime; time < endTime; time = addHours(time, 0.5)) {
    // Skip times in the past for today
    if (isBefore(time, now) && date.getDate() === now.getDate()) {
      continue;
    }
    times.push(format(time, 'HH:mm'));
  }
  
  return times;
}

/**
 * Formats a date in Spanish locale
 */
export function formatDateToSpanish(date: Date, formatString: string): string {
  return format(date, formatString, { locale: es });
}