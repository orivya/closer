'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ThreadSummary } from '@/types/messages';
import { useAuth } from '@/contexts/AuthContext';

export function useMessages() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchThreads = useCallback(async () => {
    if (!user) {
      setThreads([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all messages for the current user as recipient
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          thread_id,
          sender_id,
          recipient_id,
          sender_email,
          sender_name,
          subject,
          content,
          is_inquiry,
          inquiry_status,
          order_id,
          is_read,
          created_at
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      if (!messages || messages.length === 0) {
        setThreads([]);
        setLoading(false);
        return;
      }

      // Group messages by thread_id
      const threadMap = new Map<string, any[]>();
      messages.forEach((msg) => {
        if (!threadMap.has(msg.thread_id)) {
          threadMap.set(msg.thread_id, []);
        }
        threadMap.get(msg.thread_id)!.push(msg);
      });

      // Get unique sender IDs for profile fetching
      const senderIds = Array.from(
        new Set(
          messages
            .map((m) => m.sender_id)
            .filter((id): id is string => id !== null)
        )
      );

      // Fetch sender profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // Build thread summaries
      const threadSummaries: ThreadSummary[] = Array.from(threadMap.entries()).map(
        ([threadId, threadMessages]) => {
          const latestMessage = threadMessages[0];
          const firstMessage = threadMessages[threadMessages.length - 1];
          const unreadCount = threadMessages.filter((m) => !m.is_read).length;
          const senderProfile = latestMessage.sender_id
            ? profileMap.get(latestMessage.sender_id)
            : null;

          return {
            thread_id: threadId,
            recipient_id: latestMessage.recipient_id,
            sender_id: latestMessage.sender_id,
            sender_email: latestMessage.sender_email,
            sender_name: latestMessage.sender_name,
            subject: latestMessage.subject,
            is_inquiry: latestMessage.is_inquiry,
            inquiry_status: latestMessage.inquiry_status,
            order_id: latestMessage.order_id,
            latest_message: latestMessage.content,
            latest_message_at: latestMessage.created_at,
            unread_count: unreadCount,
            message_count: threadMessages.length,
            sender_username: senderProfile?.username || null,
            sender_display_name: senderProfile?.display_name || null,
            sender_avatar_url: senderProfile?.avatar_url || null,
            thread_started_at: firstMessage.created_at,
          };
        }
      );

      // Sort by latest message timestamp
      threadSummaries.sort(
        (a, b) =>
          new Date(b.latest_message_at).getTime() -
          new Date(a.latest_message_at).getTime()
      );

      setThreads(threadSummaries);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          // Refetch threads when messages change
          fetchThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchThreads]);

  const getTotalUnreadCount = useCallback(() => {
    return threads.reduce((total, thread) => total + thread.unread_count, 0);
  }, [threads]);

  const getInquiryCount = useCallback((status?: string) => {
    if (status) {
      return threads.filter(
        (t) => t.is_inquiry && t.inquiry_status === status
      ).length;
    }
    return threads.filter((t) => t.is_inquiry).length;
  }, [threads]);

  return {
    threads,
    loading,
    error,
    refetch: fetchThreads,
    getTotalUnreadCount,
    getInquiryCount,
  };
}
