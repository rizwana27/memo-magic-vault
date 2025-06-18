export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          client_id: string
          client_name: string
          client_type: string
          company_name: string
          created_at: string | null
          created_by: string | null
          industry: string | null
          notes: string | null
          phone_number: string | null
          primary_contact_email: string
          primary_contact_name: string
          revenue_tier: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          client_name: string
          client_type: string
          company_name: string
          created_at?: string | null
          created_by?: string | null
          industry?: string | null
          notes?: string | null
          phone_number?: string | null
          primary_contact_email: string
          primary_contact_name: string
          revenue_tier?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          client_name?: string
          client_type?: string
          company_name?: string
          created_at?: string | null
          created_by?: string | null
          industry?: string | null
          notes?: string | null
          phone_number?: string | null
          primary_contact_email?: string
          primary_contact_name?: string
          revenue_tier?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          attachments: string[] | null
          billing_type: string
          client_id: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          discount_rate: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          items: Json | null
          notes: string | null
          project_id: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          billing_type: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          discount_rate?: number | null
          due_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          items?: Json | null
          notes?: string | null
          project_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          billing_type?: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          discount_rate?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          items?: Json | null
          notes?: string | null
          project_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          attachments: string | null
          budget: number | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          delivery_status: string | null
          description: string | null
          end_date: string | null
          project_id: string
          project_manager: string | null
          project_name: string
          region: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          attachments?: string | null
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_status?: string | null
          description?: string | null
          end_date?: string | null
          project_id: string
          project_manager?: string | null
          project_name: string
          region?: string | null
          start_date?: string | null
          status: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          attachments?: string | null
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_status?: string | null
          description?: string | null
          end_date?: string | null
          project_id?: string
          project_manager?: string | null
          project_name?: string
          region?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          delivery_date: string | null
          id: string
          line_items: Json | null
          notes: string | null
          order_date: string
          po_number: string
          project_id: string | null
          status: string
          total_amount: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          id?: string
          line_items?: Json | null
          notes?: string | null
          order_date?: string
          po_number: string
          project_id?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          id?: string
          line_items?: Json | null
          notes?: string | null
          order_date?: string
          po_number?: string
          project_id?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["vendor_id"]
          },
        ]
      }
      resources: {
        Row: {
          active_status: boolean | null
          availability: number | null
          created_at: string | null
          created_by: string | null
          department: string
          email_address: string
          full_name: string
          join_date: string | null
          phone_number: string | null
          profile_picture: string | null
          resource_id: string
          role: string
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          active_status?: boolean | null
          availability?: number | null
          created_at?: string | null
          created_by?: string | null
          department: string
          email_address: string
          full_name: string
          join_date?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          resource_id: string
          role: string
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active_status?: boolean | null
          availability?: number | null
          created_at?: string | null
          created_by?: string | null
          department?: string
          email_address?: string
          full_name?: string
          join_date?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          resource_id?: string
          role?: string
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      timesheets: {
        Row: {
          billable: boolean | null
          created_at: string | null
          created_by: string | null
          date: string
          end_time: string
          hours: number | null
          notes: string | null
          project_id: string | null
          start_time: string
          task: string
          timesheet_id: string
          updated_at: string | null
        }
        Insert: {
          billable?: boolean | null
          created_at?: string | null
          created_by?: string | null
          date: string
          end_time: string
          hours?: number | null
          notes?: string | null
          project_id?: string | null
          start_time: string
          task: string
          timesheet_id: string
          updated_at?: string | null
        }
        Update: {
          billable?: boolean | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          end_time?: string
          hours?: number | null
          notes?: string | null
          project_id?: string | null
          start_time?: string
          task?: string
          timesheet_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      vendors: {
        Row: {
          attachments: string | null
          contact_email: string
          contact_person: string
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          created_by: string | null
          notes: string | null
          phone_number: string | null
          services_offered: string
          status: string | null
          updated_at: string | null
          vendor_id: string
          vendor_name: string
        }
        Insert: {
          attachments?: string | null
          contact_email: string
          contact_person: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          created_by?: string | null
          notes?: string | null
          phone_number?: string | null
          services_offered: string
          status?: string | null
          updated_at?: string | null
          vendor_id: string
          vendor_name: string
        }
        Update: {
          attachments?: string | null
          contact_email?: string
          contact_person?: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          created_by?: string | null
          notes?: string | null
          phone_number?: string | null
          services_offered?: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
          vendor_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_client_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_project_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_purchase_order_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_resource_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_timesheet_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_vendor_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_client: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_project_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      invoice_type: "time_material" | "milestone" | "fixed_price"
      notification_type: "system" | "invoice" | "timesheet" | "project" | "task"
      po_status: "draft" | "approved" | "sent" | "received" | "cancelled"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "not_started" | "in_progress" | "completed" | "blocked"
      timesheet_status: "draft" | "submitted" | "approved" | "rejected"
      user_role: "admin" | "project_manager" | "client" | "resource"
      vendor_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      invoice_type: ["time_material", "milestone", "fixed_price"],
      notification_type: ["system", "invoice", "timesheet", "project", "task"],
      po_status: ["draft", "approved", "sent", "received", "cancelled"],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "cancelled",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["not_started", "in_progress", "completed", "blocked"],
      timesheet_status: ["draft", "submitted", "approved", "rejected"],
      user_role: ["admin", "project_manager", "client", "resource"],
      vendor_status: ["active", "inactive", "suspended"],
    },
  },
} as const
