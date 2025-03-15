'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from './button';


interface Appointment {
  id: string;
  date: string;
  status: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
  stylist?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    phoneNumber?: string;
  };
}

interface CalendarProps {
  appointments: Appointment[];
  onDateClick?: (date: Date) => void;
}

export function Calendar({ appointments, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [daysWithAppointments, setDaysWithAppointments] = useState<Date[]>([]);

  useEffect(() => {
    // Extract dates from appointments and set them as days with appointments
    if (appointments && appointments.length > 0) {
      const appointmentDates = appointments.map(appointment => new Date(appointment.date));
      setDaysWithAppointments(appointmentDates);
    } else {
      setDaysWithAppointments([]);
    }
  }, [appointments]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onDateClickHandler = (day: Date) => {
    setSelectedDate(day);
    if (onDateClick) {
      onDateClick(day);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={prevMonth}
          variant="outline"
          className="p-2"
          aria-label="Mes anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
        <h2 className="text-lg font-medium text-foreground-title">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <Button 
          onClick={nextMonth}
          variant="outline"
          className="p-2"
          aria-label="Mes siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart;
    const endDate = monthEnd;

    const dateFormat = 'd';
    const rows = [];

    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });

    // Calculate empty cells before the first day of the month
    const firstDayOfMonth = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.
    const emptyCellsBefore = Array(firstDayOfMonth).fill(null);
    
    // Combine empty cells with actual days
    const allCells = [...emptyCellsBefore, ...days];

    // Calculate total rows needed
    const totalRows = Math.ceil(allCells.length / 7);

    // Add empty cells after the last day to complete the grid
    const emptyCellsAfter = Array(totalRows * 7 - allCells.length).fill(null);
    const completeCells = [...allCells, ...emptyCellsAfter];

    // Create rows
    for (let i = 0; i < totalRows; i++) {
      const row = completeCells.slice(i * 7, (i + 1) * 7);
      rows.push(row);
    }

    return (
      <div className="grid grid-cols-1 gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-1">
            {row.map((day, dayIndex) => {
              if (!day) {
                // Empty cell
                return <div key={dayIndex} className="h-12 p-1"></div>;
              }
              
              const formattedDate = format(day, dateFormat);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              
              // Check if this day has any appointments
              const hasAppointment = daysWithAppointments.some(appointmentDate => 
                isSameDay(appointmentDate, day)
              );
              
              return (
                <div
                  key={dayIndex}
                  className={`h-12 p-1 border rounded-md flex flex-col items-center justify-center cursor-pointer transition-all
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isSelected ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-200' : ''}
                    ${hasAppointment && !isSelected ? 'bg-primary-50' : ''}
                    hover:border-gray-300
                  `}
                  onClick={() => onDateClickHandler(day)}
                >
                  <span className={`text-sm font-medium ${hasAppointment ? 'text-primary-700' : ''}`}>
                    {formattedDate}
                  </span>
                  {hasAppointment && (
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}