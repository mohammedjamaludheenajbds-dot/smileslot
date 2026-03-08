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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string
          dentist_id: string
          id: string
          message: string
          sender_name: string
          sender_role: string
        }
        Insert: {
          created_at?: string
          dentist_id: string
          id?: string
          message: string
          sender_name: string
          sender_role: string
        }
        Update: {
          created_at?: string
          dentist_id?: string
          id?: string
          message?: string
          sender_name?: string
          sender_role?: string
        }
        Relationships: []
      }
      clinic_reviews: {
        Row: {
          comment: string
          created_at: string
          dentist_id: string
          id: string
          photo_url: string | null
          rating: number
          reviewer_name: string
          treatment: string
          video_url: string | null
          youtube_id: string | null
        }
        Insert: {
          comment?: string
          created_at?: string
          dentist_id: string
          id?: string
          photo_url?: string | null
          rating?: number
          reviewer_name: string
          treatment?: string
          video_url?: string | null
          youtube_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          dentist_id?: string
          id?: string
          photo_url?: string | null
          rating?: number
          reviewer_name?: string
          treatment?: string
          video_url?: string | null
          youtube_id?: string | null
        }
        Relationships: []
      }
      clinics: {
        Row: {
          about: string
          achievements: string
          address: string
          area: string
          clinic_name: string
          created_at: string
          doctor_name: string
          doctor_phone: string
          emi_available: boolean
          experience: number
          google_maps_url: string
          id: string
          phone: string
          qualification: string
          specialization: string
          status: string
          treatments: string
          website: string
          whatsapp: string
        }
        Insert: {
          about?: string
          achievements?: string
          address?: string
          area?: string
          clinic_name: string
          created_at?: string
          doctor_name: string
          doctor_phone?: string
          emi_available?: boolean
          experience?: number
          google_maps_url?: string
          id?: string
          phone?: string
          qualification?: string
          specialization?: string
          status?: string
          treatments?: string
          website?: string
          whatsapp?: string
        }
        Update: {
          about?: string
          achievements?: string
          address?: string
          area?: string
          clinic_name?: string
          created_at?: string
          doctor_name?: string
          doctor_phone?: string
          emi_available?: boolean
          experience?: number
          google_maps_url?: string
          id?: string
          phone?: string
          qualification?: string
          specialization?: string
          status?: string
          treatments?: string
          website?: string
          whatsapp?: string
        }
        Relationships: []
      }
      doctor_applications: {
        Row: {
          clinic_name: string
          created_at: string
          dci_certificate_url: string
          id: string
          id_proof_url: string
          name: string
          phone: string
          specialization: string
          status: string
        }
        Insert: {
          clinic_name: string
          created_at?: string
          dci_certificate_url?: string
          id?: string
          id_proof_url?: string
          name: string
          phone: string
          specialization?: string
          status?: string
        }
        Update: {
          clinic_name?: string
          created_at?: string
          dci_certificate_url?: string
          id?: string
          id_proof_url?: string
          name?: string
          phone?: string
          specialization?: string
          status?: string
        }
        Relationships: []
      }
      home_consultations: {
        Row: {
          address: string
          age: number
          condition: string
          created_at: string
          id: string
          name: string
          phone: string
          sex: string
          status: string
          treatment_required: string
        }
        Insert: {
          address: string
          age: number
          condition: string
          created_at?: string
          id?: string
          name: string
          phone: string
          sex: string
          status?: string
          treatment_required: string
        }
        Update: {
          address?: string
          age?: number
          condition?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string
          sex?: string
          status?: string
          treatment_required?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          device_id: string
          id: string
          phone: string
          screenshot_url: string
          status: string
          user_name: string
        }
        Insert: {
          amount?: number
          created_at?: string
          device_id: string
          id?: string
          phone: string
          screenshot_url: string
          status?: string
          user_name: string
        }
        Update: {
          amount?: number
          created_at?: string
          device_id?: string
          id?: string
          phone?: string
          screenshot_url?: string
          status?: string
          user_name?: string
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
    Enums: {},
  },
} as const
