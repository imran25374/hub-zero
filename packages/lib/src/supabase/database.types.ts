/**
 * Types for the Supabase schema in supabase/migrations.
 *
 * Hand-written to match 20261122133000_hub_zero_schema.sql. Once the Supabase CLI
 * is linked, regenerate with:
 *   pnpm dlx supabase gen types typescript --project-id <project-ref> > packages/lib/src/supabase/database.types.ts
 */

/** The five launch layout archetypes (database domain public.layout_archetype). */
export const LAYOUT_ARCHETYPES = [
  "hero-split",
  "magazine-grid",
  "portfolio-mosaic",
  "dashboard",
  "classic-stack",
] as const;
export type LayoutArchetype = (typeof LAYOUT_ARCHETYPES)[number];

/** Allowed affiliate markers (constraint links_affiliate_disclosure). */
export type DisclosureLine = "#ad" | "(paid link)";

export type Device = "mobile" | "tablet" | "desktop" | "other";

export type Database = {
  public: {
    Tables: {
      hubs: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          identity_statement: string | null;
          profile_image_url: string | null;
          cover_image_url: string | null;
          theme_id: string | null;
          layout_id: LayoutArchetype | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name: string;
          identity_statement?: string | null;
          profile_image_url?: string | null;
          cover_image_url?: string | null;
          theme_id?: string | null;
          layout_id?: LayoutArchetype | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          identity_statement?: string | null;
          profile_image_url?: string | null;
          cover_image_url?: string | null;
          theme_id?: string | null;
          layout_id?: LayoutArchetype | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sections: {
        Row: {
          id: string;
          hub_id: string;
          slug: string;
          title: string;
          description: string | null;
          icon_image_url: string | null;
          order_index: number;
          layout_id: LayoutArchetype;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hub_id: string;
          slug: string;
          title: string;
          description?: string | null;
          icon_image_url?: string | null;
          order_index?: number;
          layout_id: LayoutArchetype;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hub_id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          icon_image_url?: string | null;
          order_index?: number;
          layout_id?: LayoutArchetype;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sections_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["id"];
          },
        ];
      };
      links: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          url: string;
          image_url: string | null;
          description: string | null;
          tags: string[];
          is_affiliate: boolean;
          disclosure_line: DisclosureLine | null;
          order_index: number;
          click_count: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          url: string;
          image_url?: string | null;
          description?: string | null;
          tags?: string[];
          is_affiliate?: boolean;
          disclosure_line?: DisclosureLine | null;
          order_index?: number;
          click_count?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          url?: string;
          image_url?: string | null;
          description?: string | null;
          tags?: string[];
          is_affiliate?: boolean;
          disclosure_line?: DisclosureLine | null;
          order_index?: number;
          click_count?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "links_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "sections";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_events: {
        Row: {
          id: number;
          link_id: string | null;
          occurred_at: string;
          referrer: string | null;
          country: string | null;
          device: Device | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_term: string | null;
          utm_content: string | null;
        };
        /** Only these columns are granted to the public API; id and occurred_at are set by the database. */
        Insert: {
          id?: never;
          occurred_at?: never;
          link_id: string;
          referrer?: string | null;
          country?: string | null;
          device?: Device | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_term?: string | null;
          utm_content?: string | null;
        };
        Update: {
          id?: never;
          link_id?: string | null;
          occurred_at?: string;
          referrer?: string | null;
          country?: string | null;
          device?: Device | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_term?: string | null;
          utm_content?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_events_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicTables = Database["public"]["Tables"];

/** Row type of a table, e.g. Tables<"links">. */
export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];
/** Insert shape of a table. */
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]["Insert"];
/** Update shape of a table. */
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]["Update"];
