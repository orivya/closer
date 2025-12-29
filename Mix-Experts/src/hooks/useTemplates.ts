'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageTemplate, CreateTemplateRequest, UpdateTemplateRequest } from '@/types/messages';
import { useAuth } from '@/contexts/AuthContext';

export function useTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: templatesError } = await supabase
        .from('message_templates')
        .select('*')
        .eq('profile_id', user.id)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTemplate = useCallback(
    async (template: CreateTemplateRequest) => {
      if (!user) throw new Error('Not authenticated');

      try {
        const { data, error } = await supabase
          .from('message_templates')
          .insert({
            profile_id: user.id,
            name: template.name,
            subject: template.subject || null,
            body: template.body,
            category: template.category || null,
          })
          .select()
          .single();

        if (error) throw error;

        await fetchTemplates();
        return data;
      } catch (err) {
        console.error('Error creating template:', err);
        throw err;
      }
    },
    [user, fetchTemplates]
  );

  const updateTemplate = useCallback(
    async (templateId: string, updates: UpdateTemplateRequest) => {
      if (!user) throw new Error('Not authenticated');

      try {
        const { data, error } = await supabase
          .from('message_templates')
          .update(updates)
          .eq('id', templateId)
          .eq('profile_id', user.id)
          .select()
          .single();

        if (error) throw error;

        await fetchTemplates();
        return data;
      } catch (err) {
        console.error('Error updating template:', err);
        throw err;
      }
    },
    [user, fetchTemplates]
  );

  const deleteTemplate = useCallback(
    async (templateId: string) => {
      if (!user) throw new Error('Not authenticated');

      try {
        const { error } = await supabase
          .from('message_templates')
          .delete()
          .eq('id', templateId)
          .eq('profile_id', user.id);

        if (error) throw error;

        await fetchTemplates();
      } catch (err) {
        console.error('Error deleting template:', err);
        throw err;
      }
    },
    [user, fetchTemplates]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const getActiveTemplates = useCallback(() => {
    return templates.filter((t) => t.is_active);
  }, [templates]);

  const getTemplatesByCategory = useCallback(
    (category: string) => {
      return templates.filter((t) => t.category === category && t.is_active);
    },
    [templates]
  );

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getActiveTemplates,
    getTemplatesByCategory,
  };
}
