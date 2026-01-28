import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

interface QueryState<T> {
  data: T | null;
  error: PostgrestError | null;
  isLoading: boolean;
}

interface UseSupabaseQueryOptions {
  table: string;
  schema?: string;
  select?: string;
  filter?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  enabled?: boolean;
}

export function useSupabaseQuery<T = any>(options: UseSupabaseQueryOptions) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const {
    table,
    schema = 'public',
    select = '*',
    filter,
    order,
    limit,
    enabled = true,
  } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      let query = supabase.schema(schema).from(table).select(select);

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      setState({
        data: data as T,
        error,
        isLoading: false,
      });
    } catch (err) {
      setState({
        data: null,
        error: err as PostgrestError,
        isLoading: false,
      });
    }
  }, [table, schema, select, JSON.stringify(filter), order?.column, order?.ascending, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
