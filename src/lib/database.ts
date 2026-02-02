export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      puffs: {
        Row: {
          id: string
          user_id: string
          timestamp: string
          count: number
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          timestamp?: string
          count?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          timestamp?: string
          count?: number
          created_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          currency: string | null
          full_name: string
          goal: string | null
          goal_speed: string | null
          id: string
          money_per_month: number | null
          puffs_per_day: number | null
    
          updated_at: string | null
          user_id: string
          why_stopped: string[] | null
          worries: string[] | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          full_name: string
          goal?: string | null
          goal_speed?: string | null
          id?: string
          money_per_month?: number | null
          puffs_per_day?: number | null
          updated_at?: string | null
          user_id: string
          why_stopped?: string[] | null
          worries?: string[] | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          full_name?: string
          goal?: string | null
          goal_speed?: string | null
          id?: string
          money_per_month?: number | null
          puffs_per_day?: number | null
          updated_at?: string | null
          user_id?: string
          why_stopped?: string[] | null
          worries?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

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
