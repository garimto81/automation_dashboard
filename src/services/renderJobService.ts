/**
 * Render Job Service
 *
 * Supabase render_queue 테이블과 연동하는 서비스
 * - 렌더 작업 생성/조회/업데이트
 * - 실시간 구독 기능
 */

import { supabase } from '../lib/supabase/client';

/**
 * 렌더 작업 생성 파라미터
 */
export interface RenderJobCreateParams {
  /** 컴포지션 이름 */
  compositionName: string;
  /** GFX 데이터 (JSON) */
  gfxData: Record<string, any>;
  /** 우선순위 (0=낮음, 기본값) */
  priority?: number;
  /** 요청자 */
  requestedBy?: string;
}

/**
 * 렌더 작업 (DB 스키마 매칭)
 */
export interface RenderJob {
  /** 작업 ID (UUID) */
  id: string;
  /** 컴포지션 이름 */
  composition_name: string;
  /** GFX 데이터 (JSONB) */
  gfx_data: Record<string, any>;
  /** 작업 상태 */
  status: 'pending' | 'processing' | 'completed' | 'failed';
  /** 우선순위 */
  priority: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 생성 시간 */
  created_at: string;
  /** 시작 시간 */
  started_at?: string;
  /** 완료 시간 */
  completed_at?: string;
  /** 출력 경로 */
  output_path?: string;
  /** 에러 메시지 */
  error_message?: string;
}

/**
 * 렌더 작업 서비스
 */
export const renderJobService = {
  /**
   * 렌더 작업 생성
   */
  async create(params: RenderJobCreateParams): Promise<RenderJob> {
    const { data, error } = await supabase
      .schema('ae')
      .from('render_queue')
      .insert({
        composition_name: params.compositionName,
        gfx_data: params.gfxData,
        priority: params.priority ?? 0,
        status: 'pending',
        progress: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 모든 렌더 작업 조회
   */
  async getAll(): Promise<RenderJob[]> {
    const { data, error } = await supabase
      .schema('ae')
      .from('render_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /**
   * 특정 렌더 작업 조회
   */
  async getById(id: string): Promise<RenderJob | null> {
    const { data, error } = await supabase
      .schema('ae')
      .from('render_queue')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  /**
   * 렌더 작업 상태 업데이트
   */
  async updateStatus(
    id: string,
    status: RenderJob['status'],
    progress?: number
  ): Promise<void> {
    const updates: Partial<RenderJob> = { status };
    if (progress !== undefined) updates.progress = progress;
    if (status === 'processing') updates.started_at = new Date().toISOString();
    if (status === 'completed' || status === 'failed')
      updates.completed_at = new Date().toISOString();

    const { error } = await supabase
      .schema('ae')
      .from('render_queue')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * 렌더 작업 취소
   */
  async cancel(id: string): Promise<void> {
    await this.updateStatus(id, 'failed');
  },

  /**
   * 출력 경로 업데이트
   */
  async updateOutputPath(id: string, outputPath: string): Promise<void> {
    const { error } = await supabase
      .schema('ae')
      .from('render_queue')
      .update({ output_path: outputPath })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * 에러 메시지 업데이트
   */
  async updateError(id: string, errorMessage: string): Promise<void> {
    const { error } = await supabase
      .schema('ae')
      .from('render_queue')
      .update({ error_message: errorMessage, status: 'failed' })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * 실시간 변경 구독
   */
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('render_queue_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'ae',
          table: 'render_queue',
        },
        callback
      )
      .subscribe();
  },

  /**
   * 완료된 작업 삭제
   */
  async clearCompleted(): Promise<void> {
    const { error } = await supabase
      .schema('ae')
      .from('render_queue')
      .delete()
      .eq('status', 'completed');

    if (error) throw error;
  },

  /**
   * 대기 중인 작업 개수 조회
   */
  async getPendingCount(): Promise<number> {
    const { count, error } = await supabase
      .schema('ae')
      .from('render_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count ?? 0;
  },
};
