/**
 * Types for the Supabase schema in supabase/migrations.
 *
 * Hand-written to match supabase/migrations (schema v1 to v7). Once the Supabase CLI
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

/** One entry in hubs.social_links. URLs must be https (constraint hubs_social_links_shape). */
export type SocialLink = { label: string; url: string };

/** Embedded form providers allowed in sections.form_provider. */
export type FormProvider = "kit";

/** How a section appears on the home page (sections.home_display). */
export const HOME_DISPLAYS = ["inline", "tile", "hidden"] as const;
export type HomeDisplay = (typeof HOME_DISPLAYS)[number];

/** Kinds of profile_entries, in the order a profile page shows them. */
export const PROFILE_ENTRY_KINDS = [
  "header",
  "achievement",
  "skill_group",
  "experience",
  "education",
  "training",
  "award",
  "exposure",
  "publication",
  "thesis",
  "project",
  "interest",
  "language",
  "document",
] as const;
export type ProfileEntryKind = (typeof PROFILE_ENTRY_KINDS)[number];

/** Social publishing queue (social_posts). */
export type SocialChannel = "instagram";
export type SocialPostKind = "image" | "carousel" | "reel" | "story";
export type SocialPostStatus = "draft" | "approved" | "publishing" | "published" | "failed" | "cancelled";
export type IntegrationProvider = "instagram";

/** Roles in hub_members. Only owners until Stage 4. */
export type HubMemberRole = "owner";

/** How profile entry dates are shown: 2024, Dec 2024 or 3 Dec 2024. */
export type DatePrecision = "year" | "month" | "day";

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
          social_links: SocialLink[];
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
          social_links?: SocialLink[];
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
          social_links?: SocialLink[];
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
          body: string | null;
          form_provider: FormProvider | null;
          form_id: string | null;
          home_display: HomeDisplay;
          excerpt: string | null;
          cta_label: string | null;
          cta_href: string | null;
          nav_label: string | null;
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
          body?: string | null;
          form_provider?: FormProvider | null;
          form_id?: string | null;
          home_display?: HomeDisplay;
          excerpt?: string | null;
          cta_label?: string | null;
          cta_href?: string | null;
          nav_label?: string | null;
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
          body?: string | null;
          form_provider?: FormProvider | null;
          form_id?: string | null;
          home_display?: HomeDisplay;
          excerpt?: string | null;
          cta_label?: string | null;
          cta_href?: string | null;
          nav_label?: string | null;
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
          subtitle: string | null;
          url: string;
          image_url: string | null;
          description: string | null;
          tags: string[];
          is_affiliate: boolean;
          disclosure_line: DisclosureLine | null;
          group_label: string | null;
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
          subtitle?: string | null;
          url: string;
          image_url?: string | null;
          description?: string | null;
          tags?: string[];
          is_affiliate?: boolean;
          disclosure_line?: DisclosureLine | null;
          group_label?: string | null;
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
          subtitle?: string | null;
          url?: string;
          image_url?: string | null;
          description?: string | null;
          tags?: string[];
          is_affiliate?: boolean;
          disclosure_line?: DisclosureLine | null;
          group_label?: string | null;
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
      profile_entries: {
        Row: {
          id: string;
          section_id: string;
          parent_id: string | null;
          kind: ProfileEntryKind;
          group_label: string | null;
          title: string;
          organisation: string | null;
          place: string | null;
          start_date: string | null;
          end_date: string | null;
          date_precision: DatePrecision;
          is_current: boolean;
          body: string | null;
          image_url: string | null;
          url: string | null;
          file_url: string | null;
          image_width: number | null;
          image_height: number | null;
          video_url: string | null;
          duration_seconds: number | null;
          gallery_urls: string[] | null;
          order_index: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          parent_id?: string | null;
          kind: ProfileEntryKind;
          group_label?: string | null;
          title: string;
          organisation?: string | null;
          place?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          date_precision?: DatePrecision;
          is_current?: boolean;
          body?: string | null;
          image_url?: string | null;
          url?: string | null;
          file_url?: string | null;
          image_width?: number | null;
          image_height?: number | null;
          video_url?: string | null;
          duration_seconds?: number | null;
          gallery_urls?: string[] | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          parent_id?: string | null;
          kind?: ProfileEntryKind;
          group_label?: string | null;
          title?: string;
          organisation?: string | null;
          place?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          date_precision?: DatePrecision;
          is_current?: boolean;
          body?: string | null;
          image_url?: string | null;
          url?: string | null;
          file_url?: string | null;
          image_width?: number | null;
          image_height?: number | null;
          video_url?: string | null;
          duration_seconds?: number | null;
          gallery_urls?: string[] | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_entries_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_entries_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profile_entries";
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
        /** Clicks are written by record_click(), not inserted directly. */
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
      social_posts: {
        Row: {
          id: string;
          hub_id: string;
          channel: SocialChannel;
          kind: SocialPostKind;
          scheduled_at: string;
          caption: string;
          media_urls: string[];
          cover_url: string | null;
          share_to_feed: boolean;
          is_affiliate: boolean;
          is_ai_generated: boolean;
          promotes: string | null;
          status: SocialPostStatus;
          container_id: string | null;
          external_id: string | null;
          permalink: string | null;
          error: string | null;
          attempts: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hub_id: string;
          channel?: SocialChannel;
          kind: SocialPostKind;
          scheduled_at: string;
          caption: string;
          media_urls: string[];
          cover_url?: string | null;
          share_to_feed?: boolean;
          is_affiliate?: boolean;
          is_ai_generated?: boolean;
          promotes?: string | null;
          status?: SocialPostStatus;
          container_id?: string | null;
          external_id?: string | null;
          permalink?: string | null;
          error?: string | null;
          attempts?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hub_id?: string;
          channel?: SocialChannel;
          kind?: SocialPostKind;
          scheduled_at?: string;
          caption?: string;
          media_urls?: string[];
          cover_url?: string | null;
          share_to_feed?: boolean;
          is_affiliate?: boolean;
          is_ai_generated?: boolean;
          promotes?: string | null;
          status?: SocialPostStatus;
          container_id?: string | null;
          external_id?: string | null;
          permalink?: string | null;
          error?: string | null;
          attempts?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "social_posts_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Who runs a hub (schema v7). Signed-in users read their own rows; the secret key writes. */
      hub_members: {
        Row: {
          hub_id: string;
          user_id: string;
          role: HubMemberRole;
          created_at: string;
        };
        Insert: {
          hub_id: string;
          user_id: string;
          role?: HubMemberRole;
          created_at?: string;
        };
        Update: {
          hub_id?: string;
          user_id?: string;
          role?: HubMemberRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hub_members_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["id"];
          },
        ];
      };
      integration_tokens: {
        Row: {
          provider: IntegrationProvider;
          account_id: string;
          token: string;
          expires_at: string;
          updated_at: string;
        };
        Insert: {
          provider: IntegrationProvider;
          account_id: string;
          token: string;
          expires_at: string;
          updated_at?: string;
        };
        Update: {
          provider?: IntegrationProvider;
          account_id?: string;
          token?: string;
          expires_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      /** Server only (secret key). Records a click if the link is public and the visitor is under the rate limit. */
      record_click: {
        Args: {
          p_link_id: string;
          p_visitor_hash: string;
          p_referrer?: string | null;
          p_country?: string | null;
          p_device?: Device | null;
          p_utm_source?: string | null;
          p_utm_medium?: string | null;
          p_utm_campaign?: string | null;
          p_utm_term?: string | null;
          p_utm_content?: string | null;
        };
        Returns: boolean;
      };
    };
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
