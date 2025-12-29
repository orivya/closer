export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_artifacts: {
        Row: {
          artifact_type: string
          content: Json
          created_at: string
          expires_at: string | null
          feature_key: string
          id: string
          metadata: Json | null
          source_entry_ids: string[] | null
          source_hash: string | null
          source_thread_id: string | null
          user_id: string
        }
        Insert: {
          artifact_type: string
          content: Json
          created_at?: string
          expires_at?: string | null
          feature_key: string
          id?: string
          metadata?: Json | null
          source_entry_ids?: string[] | null
          source_hash?: string | null
          source_thread_id?: string | null
          user_id: string
        }
        Update: {
          artifact_type?: string
          content?: Json
          created_at?: string
          expires_at?: string | null
          feature_key?: string
          id?: string
          metadata?: Json | null
          source_entry_ids?: string[] | null
          source_hash?: string | null
          source_thread_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_cache: {
        Row: {
          cache_key: string
          content: Json
          created_at: string
          expires_at: string
          feature_key: string
          id: string
          source_hash: string | null
          ttl_seconds: number
          user_id: string
        }
        Insert: {
          cache_key: string
          content: Json
          created_at?: string
          expires_at: string
          feature_key: string
          id?: string
          source_hash?: string | null
          ttl_seconds?: number
          user_id: string
        }
        Update: {
          cache_key?: string
          content?: Json
          created_at?: string
          expires_at?: string
          feature_key?: string
          id?: string
          source_hash?: string | null
          ttl_seconds?: number
          user_id?: string
        }
        Relationships: []
      }
      ai_cues: {
        Row: {
          confidence: number | null
          created_at: string
          cue_text: string
          cue_type: Database["public"]["Enums"]["ai_cue_type"]
          id: string
          is_active: boolean
          last_seen_at: string | null
          source_entry_ids: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          cue_text: string
          cue_type: Database["public"]["Enums"]["ai_cue_type"]
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          source_entry_ids?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          cue_text?: string
          cue_type?: Database["public"]["Enums"]["ai_cue_type"]
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          source_entry_ids?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_features: {
        Row: {
          cooldown_seconds: number | null
          created_at: string
          description: string | null
          display_name: string
          feature_key: string
          id: string
          is_enabled: boolean
          metadata: Json | null
          min_entries_required: number | null
          requires_plan: Database["public"]["Enums"]["ai_plan"]
          ttl_seconds: number | null
          updated_at: string
        }
        Insert: {
          cooldown_seconds?: number | null
          created_at?: string
          description?: string | null
          display_name: string
          feature_key: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          min_entries_required?: number | null
          requires_plan?: Database["public"]["Enums"]["ai_plan"]
          ttl_seconds?: number | null
          updated_at?: string
        }
        Update: {
          cooldown_seconds?: number | null
          created_at?: string
          description?: string | null
          display_name?: string
          feature_key?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          min_entries_required?: number | null
          requires_plan?: Database["public"]["Enums"]["ai_plan"]
          ttl_seconds?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          artifact_id: string | null
          comment: string | null
          created_at: string
          feature_key: string | null
          feedback_type: Database["public"]["Enums"]["ai_feedback_type"]
          id: string
          user_id: string
        }
        Insert: {
          artifact_id?: string | null
          comment?: string | null
          created_at?: string
          feature_key?: string | null
          feedback_type: Database["public"]["Enums"]["ai_feedback_type"]
          id?: string
          user_id: string
        }
        Update: {
          artifact_id?: string | null
          comment?: string | null
          created_at?: string
          feature_key?: string | null
          feedback_type?: Database["public"]["Enums"]["ai_feedback_type"]
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "ai_artifacts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_output_events: {
        Row: {
          artifact_id: string | null
          created_at: string
          feature_key: string
          id: string
          output_fingerprint: string
          user_id: string
        }
        Insert: {
          artifact_id?: string | null
          created_at?: string
          feature_key: string
          id?: string
          output_fingerprint: string
          user_id: string
        }
        Update: {
          artifact_id?: string | null
          created_at?: string
          feature_key?: string
          id?: string
          output_fingerprint?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_output_events_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "ai_artifacts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          max_tokens: number | null
          metadata: Json | null
          model: string | null
          system_prompt: string
          temperature: number | null
          template_key: string
          user_prompt_template: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_tokens?: number | null
          metadata?: Json | null
          model?: string | null
          system_prompt: string
          temperature?: number | null
          template_key: string
          user_prompt_template: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_tokens?: number | null
          metadata?: Json | null
          model?: string | null
          system_prompt?: string
          temperature?: number | null
          template_key?: string
          user_prompt_template?: string
          version?: number
        }
        Relationships: []
      }
      ai_redaction_events: {
        Row: {
          chunk_id: string | null
          created_at: string
          entry_id: string | null
          id: string
          original_hash: string | null
          patterns_matched: string[] | null
          redacted_hash: string | null
          redaction_type: string
          user_id: string
        }
        Insert: {
          chunk_id?: string | null
          created_at?: string
          entry_id?: string | null
          id?: string
          original_hash?: string | null
          patterns_matched?: string[] | null
          redacted_hash?: string | null
          redaction_type: string
          user_id: string
        }
        Update: {
          chunk_id?: string | null
          created_at?: string
          entry_id?: string | null
          id?: string
          original_hash?: string | null
          patterns_matched?: string[] | null
          redacted_hash?: string | null
          redaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_resurface_queue: {
        Row: {
          created_at: string
          entry_id: string
          id: string
          is_shown: boolean | null
          priority: number | null
          resurface_reason: string | null
          scheduled_for: string | null
          shown_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          id?: string
          is_shown?: boolean | null
          priority?: number | null
          resurface_reason?: string | null
          scheduled_for?: string | null
          shown_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          id?: string
          is_shown?: boolean | null
          priority?: number | null
          resurface_reason?: string | null
          scheduled_for?: string | null
          shown_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_runs: {
        Row: {
          created_at: string
          error_message: string | null
          feature_key: string
          id: string
          input_hash: string | null
          latency_ms: number | null
          metadata: Json | null
          model_used: string | null
          output_hash: string | null
          risk_level: Database["public"]["Enums"]["ai_risk"] | null
          run_status: Database["public"]["Enums"]["ai_run_status"]
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          feature_key: string
          id?: string
          input_hash?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          model_used?: string | null
          output_hash?: string | null
          risk_level?: Database["public"]["Enums"]["ai_risk"] | null
          run_status?: Database["public"]["Enums"]["ai_run_status"]
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          feature_key?: string
          id?: string
          input_hash?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          model_used?: string | null
          output_hash?: string | null
          risk_level?: Database["public"]["Enums"]["ai_risk"] | null
          run_status?: Database["public"]["Enums"]["ai_run_status"]
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ai_safety_events: {
        Row: {
          action_taken: string | null
          created_at: string
          details: Json | null
          event_type: string
          id: string
          risk_level: Database["public"]["Enums"]["ai_risk"]
          run_id: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          risk_level: Database["public"]["Enums"]["ai_risk"]
          run_id?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          risk_level?: Database["public"]["Enums"]["ai_risk"]
          run_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_safety_events_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ai_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_schema_registry: {
        Row: {
          created_at: string
          description: string | null
          id: string
          json_schema: Json
          schema_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          json_schema: Json
          schema_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          json_schema?: Json
          schema_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          ai_enabled: boolean
          allow_anchor_quotes: boolean
          avoid_topics: string[] | null
          created_at: string
          creativity: Database["public"]["Enums"]["meadow_creativity"]
          depth: Database["public"]["Enums"]["meadow_depth"]
          enabled_features: string[] | null
          id: string
          preferred_length: string | null
          sensitive_mode: boolean
          updated_at: string
          user_id: string
          voice_style: string | null
        }
        Insert: {
          ai_enabled?: boolean
          allow_anchor_quotes?: boolean
          avoid_topics?: string[] | null
          created_at?: string
          creativity?: Database["public"]["Enums"]["meadow_creativity"]
          depth?: Database["public"]["Enums"]["meadow_depth"]
          enabled_features?: string[] | null
          id?: string
          preferred_length?: string | null
          sensitive_mode?: boolean
          updated_at?: string
          user_id: string
          voice_style?: string | null
        }
        Update: {
          ai_enabled?: boolean
          allow_anchor_quotes?: boolean
          avoid_topics?: string[] | null
          created_at?: string
          creativity?: Database["public"]["Enums"]["meadow_creativity"]
          depth?: Database["public"]["Enums"]["meadow_depth"]
          enabled_features?: string[] | null
          id?: string
          preferred_length?: string | null
          sensitive_mode?: boolean
          updated_at?: string
          user_id?: string
          voice_style?: string | null
        }
        Relationships: []
      }
      ai_user_avoidance: {
        Row: {
          avoidance_type: string
          created_at: string
          id: string
          is_active: boolean
          pattern: string
          reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avoidance_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          pattern: string
          reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avoidance_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          pattern?: string
          reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_voice_policy: {
        Row: {
          banned_phrases: string[] | null
          created_at: string
          id: string
          metadata: Json | null
          tone_guidelines: string | null
          updated_at: string
          voice_rules: Json
        }
        Insert: {
          banned_phrases?: string[] | null
          created_at?: string
          id?: string
          metadata?: Json | null
          tone_guidelines?: string | null
          updated_at?: string
          voice_rules?: Json
        }
        Update: {
          banned_phrases?: string[] | null
          created_at?: string
          id?: string
          metadata?: Json | null
          tone_guidelines?: string | null
          updated_at?: string
          voice_rules?: Json
        }
        Relationships: []
      }
      ai_week_theme: {
        Row: {
          created_at: string
          id: string
          source_entry_ids: string[] | null
          supporting_cues: Json | null
          theme_text: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_entry_ids?: string[] | null
          supporting_cues?: Json | null
          theme_text: string
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          source_entry_ids?: string[] | null
          supporting_cues?: Json | null
          theme_text?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      embedding_jobs: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string
          entry_id: string
          id: string
          job_status: string
          last_error: string | null
          priority: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          entry_id: string
          id?: string
          job_status?: string
          last_error?: string | null
          priority?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          entry_id?: string
          id?: string
          job_status?: string
          last_error?: string | null
          priority?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      entry_chunks: {
        Row: {
          chunk_index: number
          content_hash: string
          content_redacted: string
          created_at: string
          embedding: string | null
          entry_id: string
          id: string
          metadata: Json | null
          thread_id: string | null
          user_id: string
        }
        Insert: {
          chunk_index?: number
          content_hash: string
          content_redacted: string
          created_at?: string
          embedding?: string | null
          entry_id: string
          id?: string
          metadata?: Json | null
          thread_id?: string | null
          user_id: string
        }
        Update: {
          chunk_index?: number
          content_hash?: string
          content_redacted?: string
          created_at?: string
          embedding?: string | null
          entry_id?: string
          id?: string
          metadata?: Json | null
          thread_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      intentions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          audio_url: string | null
          content: string | null
          created_at: string
          id: string
          is_reflection: boolean | null
          mood: string | null
          tags: string[] | null
          thread_id: string | null
          title: string | null
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_reflection?: boolean | null
          mood?: string | null
          tags?: string[] | null
          thread_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_reflection?: boolean | null
          mood?: string | null
          tags?: string[] | null
          thread_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_journal_entries_thread"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_logs: {
        Row: {
          created_at: string
          entry_id: string | null
          factors: string[] | null
          id: string
          intensity: number | null
          logged_at: string
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id?: string | null
          factors?: string[] | null
          id?: string
          intensity?: number | null
          logged_at?: string
          mood: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string | null
          factors?: string[] | null
          id?: string
          intensity?: number | null
          logged_at?: string
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_logs_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          content: string
          created_at: string
          entry_id: string | null
          id: string
          is_favorite: boolean | null
          model_used: string | null
          prompt_used: string | null
          reflection_type: string | null
          thread_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entry_id?: string | null
          id?: string
          is_favorite?: boolean | null
          model_used?: string | null
          prompt_used?: string | null
          reflection_type?: string | null
          thread_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_id?: string | null
          id?: string
          is_favorite?: boolean | null
          model_used?: string | null
          prompt_used?: string | null
          reflection_type?: string | null
          thread_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflections_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_rollups: {
        Row: {
          content: Json
          created_at: string
          entry_count: number | null
          id: string
          last_entry_at: string | null
          rollup_type: string
          source_hash: string | null
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          entry_count?: number | null
          id?: string
          last_entry_at?: string | null
          rollup_type?: string
          source_hash?: string | null
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          entry_count?: number | null
          id?: string
          last_entry_at?: string | null
          rollup_type?: string
          source_hash?: string | null
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          entry_count: number | null
          id: string
          last_entry_at: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          entry_count?: number | null
          id?: string
          last_entry_at?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          entry_count?: number | null
          id?: string
          last_entry_at?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      time_capsules: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_unlocked: boolean | null
          mood: string | null
          tags: string[] | null
          title: string
          unlock_date: string
          unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_unlocked?: boolean | null
          mood?: string | null
          tags?: string[] | null
          title: string
          unlock_date: string
          unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_unlocked?: boolean | null
          mood?: string | null
          tags?: string[] | null
          title?: string
          unlock_date?: string
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          app_lock_enabled: boolean | null
          created_at: string
          daily_reminder_enabled: boolean | null
          daily_reminder_time: string | null
          export_format: string | null
          id: string
          theme: string | null
          updated_at: string
          user_id: string
          weekly_digest_enabled: boolean | null
        }
        Insert: {
          app_lock_enabled?: boolean | null
          created_at?: string
          daily_reminder_enabled?: boolean | null
          daily_reminder_time?: string | null
          export_format?: string | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id: string
          weekly_digest_enabled?: boolean | null
        }
        Update: {
          app_lock_enabled?: boolean | null
          created_at?: string
          daily_reminder_enabled?: boolean | null
          daily_reminder_time?: string | null
          export_format?: string | null
          id?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
          weekly_digest_enabled?: boolean | null
        }
        Relationships: []
      }
      user_state: {
        Row: {
          active_thread_ids: string[] | null
          cadence_policy: Json | null
          created_at: string
          creativity: Database["public"]["Enums"]["meadow_creativity"]
          cue_palette: Json | null
          depth: Database["public"]["Enums"]["meadow_depth"]
          entry_count_30d: number | null
          entry_count_7d: number | null
          id: string
          last_entry_at: string | null
          last_thread_change_at: string | null
          output_fingerprints: Json | null
          stage: Database["public"]["Enums"]["meadow_stage"]
          updated_at: string
          user_id: string
          week_theme: string | null
        }
        Insert: {
          active_thread_ids?: string[] | null
          cadence_policy?: Json | null
          created_at?: string
          creativity?: Database["public"]["Enums"]["meadow_creativity"]
          cue_palette?: Json | null
          depth?: Database["public"]["Enums"]["meadow_depth"]
          entry_count_30d?: number | null
          entry_count_7d?: number | null
          id?: string
          last_entry_at?: string | null
          last_thread_change_at?: string | null
          output_fingerprints?: Json | null
          stage?: Database["public"]["Enums"]["meadow_stage"]
          updated_at?: string
          user_id: string
          week_theme?: string | null
        }
        Update: {
          active_thread_ids?: string[] | null
          cadence_policy?: Json | null
          created_at?: string
          creativity?: Database["public"]["Enums"]["meadow_creativity"]
          cue_palette?: Json | null
          depth?: Database["public"]["Enums"]["meadow_depth"]
          entry_count_30d?: number | null
          entry_count_7d?: number | null
          id?: string
          last_entry_at?: string | null
          last_thread_change_at?: string | null
          output_fingerprints?: Json | null
          stage?: Database["public"]["Enums"]["meadow_stage"]
          updated_at?: string
          user_id?: string
          week_theme?: string | null
        }
        Relationships: []
      }
      user_state_history: {
        Row: {
          created_at: string
          id: string
          snapshot_date: string
          state_snapshot: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          snapshot_date: string
          state_snapshot: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          snapshot_date?: string
          state_snapshot?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_entry_chunks: {
        Args: {
          p_embedding: string
          p_match_count?: number
          p_match_threshold?: number
          p_user_id: string
        }
        Returns: {
          chunk_index: number
          content_redacted: string
          entry_id: string
          id: string
          similarity: number
          thread_id: string
        }[]
      }
    }
    Enums: {
      ai_cue_type:
        | "tension"
        | "theme"
        | "energy"
        | "value"
        | "time_horizon"
        | "pattern"
        | "decision"
        | "relationship"
        | "identity"
        | "rest"
        | "work"
        | "health"
        | "creative"
        | "other"
      ai_feedback_type:
        | "more_like_this"
        | "less_like_this"
        | "too_deep"
        | "too_shallow"
        | "irrelevant"
        | "creepy"
        | "loved_it"
      ai_plan: "free" | "pro" | "premium"
      ai_risk: "none" | "low" | "medium" | "high"
      ai_run_status: "ok" | "cached" | "blocked" | "failed" | "repaired"
      meadow_creativity:
        | "plain"
        | "poetic_light"
        | "sensory"
        | "story_seed"
        | "perspective_shift"
      meadow_depth: "light" | "balanced" | "deep"
      meadow_mood: "sunny" | "clear" | "cloudy" | "rainy" | "stormy" | "unknown"
      meadow_stage: "SEED" | "SPROUT" | "GROW" | "BLOOM" | "THRIVE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_cue_type: [
        "tension",
        "theme",
        "energy",
        "value",
        "time_horizon",
        "pattern",
        "decision",
        "relationship",
        "identity",
        "rest",
        "work",
        "health",
        "creative",
        "other",
      ],
      ai_feedback_type: [
        "more_like_this",
        "less_like_this",
        "too_deep",
        "too_shallow",
        "irrelevant",
        "creepy",
        "loved_it",
      ],
      ai_plan: ["free", "pro", "premium"],
      ai_risk: ["none", "low", "medium", "high"],
      ai_run_status: ["ok", "cached", "blocked", "failed", "repaired"],
      meadow_creativity: [
        "plain",
        "poetic_light",
        "sensory",
        "story_seed",
        "perspective_shift",
      ],
      meadow_depth: ["light", "balanced", "deep"],
      meadow_mood: ["sunny", "clear", "cloudy", "rainy", "stormy", "unknown"],
      meadow_stage: ["SEED", "SPROUT", "GROW", "BLOOM", "THRIVE"],
    },
  },
} as const
