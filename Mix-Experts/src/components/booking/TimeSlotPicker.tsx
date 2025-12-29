'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TimeSlotPickerProps {
    selectedDate: Date | null;
    selectedTime: string | null;
    onDateSelect: (date: Date) => void;
    onTimeSelect: (time: string) => void;
    availableSlots?: string[]; // e.g., ['09:00', '10:00', '14:00', '15:00']
    unavailableSlots?: string[]; // Slots that are booked (from database)
    sessionDuration?: number; // in hours
}

// Default available time slots
const DEFAULT_TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
];

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    selectedDate,
    selectedTime,
    onDateSelect,
    onTimeSelect,
    availableSlots = DEFAULT_TIME_SLOTS,
    unavailableSlots = [], // Empty by default - no slots blocked
    sessionDuration = 1
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Start from Sunday of the week containing the first day
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const days: Date[] = [];
        const current = new Date(startDate);

        // Generate 6 weeks of days
        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    }, [currentMonth]);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const isSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString();
    };

    // Weekend handling - for demo, weekends are available
    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const previousMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const nextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };

    const formatTime = (time: string) => {
        const [hours] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:00 ${period}`;
    };

    const isSlotAvailable = (time: string) => {
        return !unavailableSlots.includes(time);
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6">
            {/* Calendar Section */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-[var(--accent)]" />
                    <h3 className="font-bold text-white">Select a Date</h3>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={previousMonth}
                        className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-[var(--text-muted)] hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-white">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-[var(--text-muted)] hover:text-white"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-[var(--text-muted)] py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                        const disabled = isPast(date);
                        const current = isCurrentMonth(date);
                        const selected = isSelected(date);
                        const today = isToday(date);

                        return (
                            <button
                                key={index}
                                onClick={() => !disabled && current && onDateSelect(date)}
                                disabled={disabled || !current}
                                className={cn(
                                    "aspect-square rounded-lg text-sm font-medium transition-all relative",
                                    !current && "opacity-30",
                                    disabled && "opacity-30 cursor-not-allowed",
                                    !disabled && current && !selected && "hover:bg-[var(--bg-card)] text-[var(--text-gray)]",
                                    selected && "bg-[var(--accent)] text-white",
                                    today && !selected && "ring-1 ring-[var(--accent)]"
                                )}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots Section */}
            {selectedDate && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-[var(--accent)]" />
                        <h3 className="font-bold text-white">Select a Time</h3>
                        <span className="text-sm text-[var(--text-muted)] ml-auto">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {availableSlots.map((time) => {
                            const available = isSlotAvailable(time);
                            const selected = selectedTime === time;

                            return (
                                <button
                                    key={time}
                                    onClick={() => available && onTimeSelect(time)}
                                    disabled={!available}
                                    className={cn(
                                        "py-3 px-4 rounded-xl text-sm font-medium transition-all",
                                        !available && "opacity-30 cursor-not-allowed line-through",
                                        available && !selected && "bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white",
                                        selected && "bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent-glow)]"
                                    )}
                                >
                                    {formatTime(time)}
                                </button>
                            );
                        })}
                    </div>

                    {sessionDuration > 1 && selectedTime && (
                        <div className="mt-4 p-3 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl">
                            <p className="text-sm text-[var(--text-muted)]">
                                <span className="text-white font-medium">Session time:</span>{' '}
                                {formatTime(selectedTime)} - {formatTime(`${parseInt(selectedTime.split(':')[0]) + sessionDuration}:00`)}
                            </p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};
