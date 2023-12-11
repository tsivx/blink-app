export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      colleges: {
        Row: {
          id: number
          name: string | null
          supervisor_id: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          supervisor_id?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          supervisor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colleges_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          auditory_id: number | null
          college_id: number | null
          date: string | null
          group_id: number | null
          id: number
          name: string | null
          number: number | null
          subgroup: number | null
          teacher_id: number | null
          time_end: string | null
          time_start: string | null
          week: number
        }
        Insert: {
          auditory_id?: number | null
          college_id?: number | null
          date?: string | null
          group_id?: number | null
          id?: number
          name?: string | null
          number?: number | null
          subgroup?: number | null
          teacher_id?: number | null
          time_end?: string | null
          time_start?: string | null
          week: number
        }
        Update: {
          auditory_id?: number | null
          college_id?: number | null
          date?: string | null
          group_id?: number | null
          id?: number
          name?: string | null
          number?: number | null
          subgroup?: number | null
          teacher_id?: number | null
          time_end?: string | null
          time_start?: string | null
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_auditory_id_fkey"
            columns: ["auditory_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons_timetable: {
        Row: {
          id: number
          timetable: Json
        }
        Insert: {
          id?: number
          timetable?: Json
        }
        Update: {
          id?: number
          timetable?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_id: string | null
          college_id: number
          created_at: string
          description: string | null
          id: number
          metadata: Json
          name: string
          photo_url: string | null
          type: Database["public"]["Enums"]["profile_type"]
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          college_id: number
          created_at?: string
          description?: string | null
          id?: number
          metadata?: Json
          name?: string
          photo_url?: string | null
          type: Database["public"]["Enums"]["profile_type"]
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          college_id?: number
          created_at?: string
          description?: string | null
          id?: number
          metadata?: Json
          name?: string
          photo_url?: string | null
          type?: Database["public"]["Enums"]["profile_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_auth_id_fkey"
            columns: ["auth_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          }
        ]
      }
      weeks: {
        Row: {
          date_end: string | null
          date_start: string | null
          id: number
        }
        Insert: {
          date_end?: string | null
          date_start?: string | null
          id?: number
        }
        Update: {
          date_end?: string | null
          date_start?: string | null
          id?: number
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
      profile_type: "group" | "teacher" | "auditory" | "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
