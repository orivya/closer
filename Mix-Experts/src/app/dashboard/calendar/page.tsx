'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter, Plus, Loader2, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// TypeScript types for calendar events
interface CalendarEvent {
    id: string;
    title: string;
    client: string;
    date: string;
    fullDate: Date;
    type: 'deadline' | 'delivery' | 'session';
    color: string;
    status: string;
}

export default function CalendarPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        async function fetchEvents() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        service_name,
                        status,
                        deadline,
                        profiles!orders_buyer_id_fkey(display_name)
                    `)
                    .eq('seller_id', user.id)
                    .not('deadline', 'is', null)
                    .neq('status', 'cancelled')
                    .neq('status', 'refunded')
                    .order('deadline', { ascending: true });

                if (error) {
                    console.error('Error fetching events:', error);
                    setEvents([]);
                    return;
                }

                // Transform orders to calendar events
                const transformedEvents: CalendarEvent[] = (data || []).map((order) => {
                    const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                    const deadline = new Date(order.deadline);

                    // Determine event type and color based on status
                    let type: CalendarEvent['type'] = 'deadline';
                    let color = 'bg-red-500';

                    if (order.status === 'completed' || order.status === 'pending_approval') {
                        type = 'delivery';
                        color = 'bg-green-500';
                    } else if (order.status === 'in_progress' || order.status === 'revision_in_progress') {
                        type = 'session';
                        color = 'bg-[var(--accent)]';
                    }

                    return {
                        id: order.id,
                        title: order.service_name || 'Untitled Project',
                        client: profile?.display_name || 'Unknown Client',
                        date: deadline.getDate().toString(),
                        fullDate: deadline,
                        type,
                        color,
                        status: order.status,
                    };
                });

                setEvents(transformedEvents);
            } catch (err) {
                console.error('Error:', err);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [user]);

    // Get events for current month
    const currentMonthEvents = events.filter(event => {
        const eventMonth = event.fullDate.getMonth();
        const eventYear = event.fullDate.getFullYear();
        return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
    });

    // Get upcoming deadlines
    const upcomingDeadlines = events.filter(e => e.type === 'deadline').slice(0, 5);
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Calendar</h1>
                    <p className="text-[var(--text-muted)]">Manage your sessions and deadlines.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--accent-light)] transition-colors shadow-[0_0_15px_var(--accent-glow)]">
                    <Plus className="w-4 h-4" />
                    Add Event
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!loading && events.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-6">
                        <CalendarDays className="w-10 h-10 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
                    <p className="text-[var(--text-gray)] mb-6 max-w-md">
                        When you receive orders with deadlines, they will appear here on your calendar.
                    </p>
                </div>
            )}

            {!loading && events.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Calendar Area */}
                    <div className="lg:col-span-3 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-white">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-[var(--bg-hover)] rounded"><ChevronLeft className="w-5 h-5 text-white" /></button>
                                    <button className="p-1 hover:bg-[var(--bg-hover)] rounded"><ChevronRight className="w-5 h-5 text-white" /></button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm bg-[var(--bg-card)] text-white rounded-md border border-[var(--border-dark)]">Month</button>
                                <button className="px-3 py-1 text-sm bg-transparent text-[var(--text-muted)] hover:text-white">Week</button>
                                <button className="px-3 py-1 text-sm bg-transparent text-[var(--text-muted)] hover:text-white">Day</button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 grid grid-cols-7 gap-px bg-[var(--border-dark)] border border-[var(--border-dark)] rounded-lg overflow-hidden">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-[var(--bg-elevated)] p-2 text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 35 }).map((_, i) => {
                                // Calculate the actual day of month for this cell
                                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                const firstDayOfWeek = firstDayOfMonth.getDay();
                                const day = i - firstDayOfWeek + 1;
                                const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                                const isCurrentMonth = day > 0 && day <= daysInMonth;
                                const today = new Date();
                                const isToday = isCurrentMonth &&
                                    day === today.getDate() &&
                                    currentDate.getMonth() === today.getMonth() &&
                                    currentDate.getFullYear() === today.getFullYear();

                                // Find events for this day
                                const dayEvents = currentMonthEvents.filter(e => parseInt(e.date) === day);

                                return (
                                    <div key={i} className={cn(
                                        "bg-[var(--bg-base)] p-2 min-h-[80px] hover:bg-[var(--bg-card)] transition-colors relative",
                                        !isCurrentMonth ? "text-[var(--text-faint)] bg-[var(--bg-card)]/50" : "text-[var(--text-gray)]"
                                    )}>
                                        <span className={cn(
                                            "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                            isToday ? "bg-[var(--accent)] text-white" : ""
                                        )}>
                                            {isCurrentMonth ? day : ''}
                                        </span>

                                        {dayEvents.map((event, idx) => (
                                            <div key={event.id} className={cn(
                                                "mt-2 text-[10px] font-bold text-white px-2 py-1 rounded truncate shadow-sm",
                                                event.color,
                                                idx > 0 ? "mt-1" : ""
                                            )}>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar: Upcoming */}
                    <div className="space-y-6">
                        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[var(--accent)]" />
                                Upcoming Deadlines
                            </h3>
                            <div className="space-y-4">
                                {upcomingDeadlines.length === 0 ? (
                                    <p className="text-sm text-[var(--text-muted)]">No upcoming deadlines</p>
                                ) : (
                                    upcomingDeadlines.map(e => (
                                        <div key={e.id} className="flex gap-3 items-start pb-3 border-b border-[var(--border-dark)] last:border-0 last:pb-0">
                                            <div className="flex-shrink-0 w-10 h-10 bg-[var(--bg-card)] rounded-lg flex flex-col items-center justify-center border border-[var(--border-dark)]">
                                                <span className="text-[10px] text-[var(--text-muted)] uppercase">
                                                    {e.fullDate.toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="text-sm font-bold text-white">{e.date}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{e.title}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{e.client}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
