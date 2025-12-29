'use client';

import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProfileData, ServiceDisplayData } from '@/lib/profile-data';

// Default booking options if no services provided
const DEFAULT_BOOKING_OPTIONS = [
    {
        id: 'recording-2hr',
        title: '2-Hour Recording Block',
        price: '$170',
        rate: '$85/hr',
        description: 'Standard session for vocal tracking or single instrument. Engineer included.'
    },
    {
        id: 'recording-4hr',
        title: 'Half-Day Session',
        price: '$300',
        rate: '$75/hr',
        description: '4 hours of intensive recording. Best for EP work or full band tracking.'
    },
    {
        id: 'recording-8hr',
        title: 'Full Day Lockout',
        price: '$550',
        rate: '$68/hr',
        description: '8 hours (10am - 6pm). The studio is yours. Lunch break included.'
    },
    {
        id: 'mixing-consult',
        title: 'Mixing Consultation',
        price: 'Free',
        rate: '30 mins',
        description: 'Discuss your project goals and file delivery before booking a mix.'
    }
];

interface BookingSectionProps {
    profile?: ProfileData;
    services?: ServiceDisplayData[];
}

export const BookingSection: React.FC<BookingSectionProps> = ({ profile, services }) => {
    // Convert services to booking options format if available
    const bookingOptions = services && services.length > 0
        ? services.map(s => ({
            id: s.id,
            title: s.title,
            price: s.price,
            rate: s.turnaround,
            description: s.description,
        }))
        : DEFAULT_BOOKING_OPTIONS;

    const [selectedService, setSelectedService] = useState(bookingOptions[0]?.id || '');
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState(() => new Date());

    // Get the number of days in the current month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get the day of the week the month starts on (0 = Sunday)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    // Check if a date is in the past
    const isPastDate = (day: number) => {
        const today = new Date();
        const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    // Get booking link - use profile username if available
    const bookingLink = profile?.username ? `/${profile.username}/book` : '/checkout';

    return (
        <section id="booking" className="py-32 bg-[var(--bg-elevated)] border-t border-[var(--border-dark)]">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-8 h-px bg-[var(--accent)] opacity-50"></span>
                        <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Studio Time</span>
                        <span className="w-8 h-px bg-[var(--accent)] opacity-50"></span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Book a Recording Session</h2>
                    <p className="text-[var(--text-gray)] max-w-lg mx-auto">
                        Professional environment, top-tier gear, and an engineer who cares about your sound.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Service Selection */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center">1</span>
                            Select Duration
                        </h3>

                        {bookingOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedService(option.id)}
                                className={cn(
                                    "w-full p-6 rounded-2xl border text-left transition-all duration-300 group flex items-start gap-4",
                                    selectedService === option.id
                                        ? "bg-[var(--bg-card)] border-[var(--accent)] shadow-[0_0_20px_var(--accent-subtle)]"
                                        : "bg-[var(--bg-base)] border-[var(--border-dark)] hover:border-[var(--border-dark-strong)] hover:bg-[var(--bg-card)]"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full border flex items-center justify-center mt-1 transition-colors",
                                    selectedService === option.id
                                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                        : "border-[var(--text-muted)] group-hover:border-[var(--text-gray)]"
                                )}>
                                    {selectedService === option.id && <Check className="w-3 h-3" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-white">{option.title}</span>
                                        <div className="text-right">
                                            <span className="block text-[var(--accent)] font-semibold">{option.price}</span>
                                            <span className="block text-xs text-[var(--text-gray)]">{option.rate}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[var(--text-gray)] leading-relaxed">
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Calendar & Confirmation */}
                    <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-3xl p-8 h-fit">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center">2</span>
                            Availability
                        </h3>

                        <div className="mb-8">
                            <div className="flex items-center justify-between text-white font-bold mb-4">
                                <span>{monthName} {year}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={goToPreviousMonth}
                                        className="p-1 hover:text-[var(--accent)] transition-colors"
                                        aria-label="Previous month"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={goToNextMonth}
                                        className="p-1 hover:text-[var(--accent)] transition-colors"
                                        aria-label="Next month"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-[var(--text-muted)] font-medium">
                                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
                                {dates.map((date) => {
                                    const isDisabled = isPastDate(date);
                                    return (
                                        <button
                                            key={date}
                                            disabled={isDisabled}
                                            onClick={() => setSelectedDate(date)}
                                            className={cn(
                                                "aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                                                selectedDate === date
                                                    ? "bg-[var(--accent)] text-white shadow-lg scale-110"
                                                    : isDisabled
                                                        ? "text-[var(--text-faint)] cursor-not-allowed decoration-slice line-through opacity-30"
                                                        : "text-[var(--text-gray)] hover:bg-[var(--bg-hover)] hover:text-white"
                                            )}
                                        >
                                            {date}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--border-dark)]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-sm text-[var(--text-gray)]">
                                    <Clock className="w-4 h-4" />
                                    <span>Turnaround: 3-5 Days</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[var(--text-gray)]">
                                    <Calendar className="w-4 h-4" />
                                    <span>Start: {selectedDate ? `${monthName.slice(0, 3)} ${selectedDate}` : 'Select Date'}</span>
                                </div>
                            </div>

                            <div className="w-full">
                                <Link href={bookingLink}>
                                    <button
                                        disabled={!selectedDate}
                                        className="w-full py-4 bg-white text-[var(--bg-base)] font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        Confirm Appointment
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
