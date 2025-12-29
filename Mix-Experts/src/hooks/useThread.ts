'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageWithProfile, InquiryStatus } from '@/types/messages';
import { useAuth } from '@/contexts/AuthContext';

export function useThread(threadId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchThread = useCallback(async () => {
    if (!user || !threadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all messages in the thread
      const { data: threadMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (!threadMessages || threadMessages.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs (both senders and recipients)
      const userIds = Array.from(
        new Set([
          ...threadMessages.map((m) => m.sender_id).filter((id): id is string => id !== null),
          ...threadMessages.map((m) => m.recipient_id),
        ])
      );

      // Fetch all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // Combine messages with profile data
      const messagesWithProfiles: MessageWithProfile[] = threadMessages.map((msg) => ({
        ...msg,
        sender_profile: msg.sender_id ? profileMap.get(msg.sender_id) : undefined,
        recipient_profile: profileMap.get(msg.recipient_id),
      }));

      setMessages(messagesWithProfiles);

      // Mark messages as read if user is the recipient
      await markAsRead();
    } catch (err) {
      console.error('Error fetching thread:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch thread'));
    } finally {
      setLoading(false);
    }
  }, [user, threadId]);

  const markAsRead = useCallback(async () => {
    if (!user || !threadId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('thread_id', threadId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update inquiry status from 'new' to 'read' if applicable
      const { error: statusError } = await supabase
        .from('messages')
        .update({ inquiry_status: 'read' })
        .eq('thread_id', threadId)
        .eq('is_inquiry', true)
        .eq('inquiry_status', 'new');

      if (statusError) console.error('Error updating inquiry status:', statusError);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [user, threadId]);

  const updateInquiryStatus = useCallback(
    async (status: InquiryStatus) => {
      if (!user || !threadId) return;

      try {
        const { error } = await supabase
          .from('messages')
          .update({ inquiry_status: status })
          .eq('thread_id', threadId)
          .eq('is_inquiry', true);

        if (error) throw error;

        // Refetch to update local state
        await fetchThread();
      } catch (err) {
        console.error('Error updating inquiry status:', err);
        throw err;
      }
    },
    [user, threadId, fetchThread]
  );

  const archiveThread = useCallback(async () => {
    if (!user || !threadId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_archived: true })
        .eq('thread_id', threadId)
        .eq('recipient_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error archiving thread:', err);
      throw err;
    }
  }, [user, threadId]);

  const deleteThread = useCallback(async () => {
    if (!user || !threadId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('thread_id', threadId)
        .eq('recipient_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting thread:', err);
      throw err;
    }
  }, [user, threadId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !threadId) return;

    const channel = supabase
      .channel(`thread-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        () => {
          // Refetch thread when messages change
          fetchThread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, threadId, fetchThread]);

  return {
    messages,
    loading,
    error,
    refetch: fetchThread,
    markAsRead,
    updateInquiryStatus,
    archiveThread,
    deleteThread,
  };
}
