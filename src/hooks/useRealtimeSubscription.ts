import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';

type PostgresChanges = RealtimePostgresChangesPayload<{ [key: string]: any }>;

interface UseRealtimeOptions {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

export function useRealtimeSubscription(
  options: UseRealtimeOptions,
  callback: (payload: PostgresChanges) => void
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { table, schema = 'public', event = '*', filter } = options;

  // Store callback in ref to avoid re-subscribing on every render
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const channelName = `${schema}:${table}:${event}`;

    const newChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema,
          table,
          filter,
        },
        (payload: any) => {
          callbackRef.current(payload as PostgresChanges);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          setError(new Error(`Channel error: ${channelName}`));
        }
      });

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [table, schema, event, filter]); // callback removed from deps, using ref instead

  const unsubscribe = useCallback(() => {
    channel?.unsubscribe();
    setIsConnected(false);
  }, [channel]);

  return { isConnected, error, unsubscribe };
}
