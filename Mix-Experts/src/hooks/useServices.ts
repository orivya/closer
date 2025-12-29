'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ServiceWithDetails } from '@/lib/database.types';
import { useAuth } from '@/contexts/AuthContext';

export function useServices() {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async () => {
    if (!user) {
      setServices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch services with their addons and turnaround options
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('engineer_id', user.id)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      if (!servicesData || servicesData.length === 0) {
        setServices([]);
        setLoading(false);
        return;
      }

      // Fetch addons for all services
      const { data: addonsData, error: addonsError } = await supabase
        .from('service_addons')
        .select('*')
        .in('service_id', servicesData.map(s => s.id));

      if (addonsError) throw addonsError;

      // Fetch turnaround options for all services
      const { data: turnaroundData, error: turnaroundError } = await supabase
        .from('turnaround_options')
        .select('*')
        .in('service_id', servicesData.map(s => s.id))
        .order('days', { ascending: true });

      if (turnaroundError) throw turnaroundError;

      // Combine the data
      const servicesWithDetails: ServiceWithDetails[] = servicesData.map(service => ({
        ...service,
        addons: addonsData?.filter(addon => addon.service_id === service.id) || [],
        turnaround_options: turnaroundData?.filter(option => option.service_id === service.id) || [],
      }));

      setServices(servicesWithDetails);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch services'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}

// Hook to fetch a single service by slug
export function useServiceBySlug(username: string, slug: string) {
  const [service, setService] = useState<ServiceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        setError(null);

        // First, get the engineer's profile by username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error('Engineer not found');

        // Fetch the service
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('engineer_id', profileData.id)
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (serviceError) throw serviceError;
        if (!serviceData) throw new Error('Service not found');

        // Fetch addons
        const { data: addonsData, error: addonsError } = await supabase
          .from('service_addons')
          .select('*')
          .eq('service_id', serviceData.id);

        if (addonsError) throw addonsError;

        // Fetch turnaround options
        const { data: turnaroundData, error: turnaroundError } = await supabase
          .from('turnaround_options')
          .select('*')
          .eq('service_id', serviceData.id)
          .order('days', { ascending: true });

        if (turnaroundError) throw turnaroundError;

        setService({
          ...serviceData,
          addons: addonsData || [],
          turnaround_options: turnaroundData || [],
        });
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch service'));
      } finally {
        setLoading(false);
      }
    }

    if (username && slug) {
      fetchService();
    }
  }, [username, slug]);

  return {
    service,
    loading,
    error,
  };
}
