'use client';

import React, { useEffect, useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Calendar, Clock, Zap, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeSlotPicker } from './TimeSlotPicker';

interface TurnaroundOption {
    id: string;
    name: string;
    days: number;
    price_multiplier: number;
    is_default: boolean;
}

export const Step4Scheduling = () => {
    const { data, updateData, nextStep, prevStep } = useBooking();
    const [turnaroundOptions, setTurnaroundOptions] = useState<TurnaroundOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    // For recording sessions - date/time selection
    const [selectedDate, setSelectedDate] = useState<Date | null>(data.selectedDate);
    const [selectedTime, setSelectedTime] = useState<string | null>(data.selectedTime);

    const isRecordingSession = data.serviceType === 'recording';

    useEffect(() => {
        async function fetchTurnaroundOptions() {
            if (!data.selectedServiceId) return;

            // Skip fetching turnaround options for recording sessions
            if (isRecordingSession) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/services/${data.selectedServiceId}/options`);
                if (!response.ok) {
                    throw new Error('Failed to fetch turnaround options');
                }
                const result = await response.json();
                setTurnaroundOptions(result.turnaroundOptions || []);

                // Set default option
                const defaultOption = result.turnaroundOptions?.find((opt: TurnaroundOption) => opt.is_default);
                if (defaultOption) {
                    setSelectedOptionId(defaultOption.id);
                    updateData({ turnaroundOptionId: defaultOption.id });
                }
            } catch (err) {
                console.error('Error fetching turnaround options:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTurnaroundOptions();
    }, [data.selectedServiceId, isRecordingSession]);

    const handleSelectOption = (optionId: string) => {
        setSelectedOptionId(optionId);
        updateData({ turnaroundOptionId: optionId });
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        updateData({ selectedDate: date });
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        updateData({ selectedTime: time });
    };

    const calculateDeliveryDate = (days: number) => {
        const today = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(today.getDate() + days);
        return deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const canProceed = isRecordingSession
        ? (selectedDate !== null && selectedTime !== null)
        : selectedOptionId !== null;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {isRecordingSession ? 'Book Your Session' : 'Schedule Delivery'}
                </h2>
                <p className="text-[var(--text-gray)]">
                    {isRecordingSession
                        ? 'Select your preferred date and time for the recording session.'
                        : 'When do you need your project completed?'}
                </p>
            </div>

            {/* Recording Session - Date/Time Picker */}
            {isRecordingSession ? (
                <TimeSlotPicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateSelect={handleDateSelect}
                    onTimeSelect={handleTimeSelect}
                    sessionDuration={parseInt(data.sessionDuration || '2')}
                />
            ) : (
                /* Mixing/Mastering - Turnaround Options */
                <div className="grid md:grid-cols-2 gap-6">
                    {turnaroundOptions.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isRush = option.price_multiplier > 1;
                        const Icon = isRush ? Zap : Calendar;
                        const iconColor = isRush ? 'text-yellow-500' : 'text-[var(--accent)]';

                        return (
                            <div
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                className={cn(
                                    "relative p-6 rounded-2xl border cursor-pointer transition-all hover:bg-[var(--bg-elevated)] flex flex-col h-full",
                                    isSelected
                                        ? isRush
                                            ? "bg-[var(--bg-elevated)] border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                                            : "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                                        : "bg-[var(--bg-card)] border-[var(--border-dark)] opacity-60 hover:opacity-100"
                                )}
                            >
                                {isRush && (
                                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                        RUSH
                                    </div>
                                )}
                                {option.is_default && !isRush && (
                                    <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                        STANDARD
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-4">
                                    <Icon className={cn("w-6 h-6", iconColor)} />
                                    <h3 className="text-xl font-bold text-white">{option.name}</h3>
                                </div>
                                <p className="text-sm text-[var(--text-gray)] mb-6 leading-relaxed">
                                    {isRush
                                        ? 'Priority processing for faster delivery when you need it quickly.'
                                        : 'Standard delivery time with full attention to quality and detail.'}
                                </p>
                                <div className="mt-auto pt-6 border-t border-[var(--border-dark)] flex justify-between items-center">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Estimated</span>
                                    <span className="font-bold text-white">{calculateDeliveryDate(option.days)}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Fee</span>
                                    <span className={cn("font-bold", isRush ? "text-yellow-500" : "text-[var(--accent)]")}>
                                        {option.price_multiplier === 1
                                            ? 'Included'
                                            : `+${Math.round((option.price_multiplier - 1) * 100)}%`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Session Summary for Recording */}
            {isRecordingSession && selectedDate && selectedTime && (
                <div className="bg-[var(--bg-card)] border border-[var(--accent)]/30 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                        <Clock className="w-5 h-5 text-[var(--accent)]" />
                        <div>
                            <p className="text-white font-bold">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-[var(--text-muted)]">
                                {parseInt(selectedTime.split(':')[0]) % 12 || 12}:00 {parseInt(selectedTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                                {' - '}
                                {data.sessionDuration} hour{parseInt(data.sessionDuration || '1') > 1 ? 's' : ''} session
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-[var(--border-dark)]">
                <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-[var(--bg-card)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-elevated)] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex-1" />
                <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className="px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
