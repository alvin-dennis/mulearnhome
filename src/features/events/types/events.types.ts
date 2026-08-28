export interface Event {
  title: string;
  description: string;
  image?: string;
  isLive?: boolean;
  date?: string;
  link?: string;
  category?: string;
  organizedBy?: string;
  venueType?: string;
  venueLabel?: string;
  tags?: string[];
}

export interface WeeklyTwitchPagination {
  count: number;
  totalPages: number;
  isNext: boolean;
  isPrev: boolean;
  nextPage: number | null;
}

export interface WeeklyTwitchParams {
  status?: "upcoming" | "ongoing" | "completed" | Array<"upcoming" | "ongoing" | "completed">;
  search?: string;
  pageIndex?: number;
  perPage?: number;
}

export interface OfficeHoursSession {
  id: string;
  title: string;
  performer?: string | null;
  designation?: string | null;
  description?: string | null;
  date: string;
  time?: string | null;
  link?: string | null;
  interest_groups: string[] | null;
  poster_thumbnail?: string | null;
  status: "upcoming" | "ongoing" | "completed";
}

export interface WeeklyTwitchEpisode {
  id: string;
  topic: string;
  campus: string;
  zone?: "north" | "central" | "south" | null;
  date: string;
  time?: string | null;
  description?: string | null;
  link?: string | null;
  status: "upcoming" | "ongoing" | "completed";
}

export interface GrabYourSuperpowersSession {
  id: string;
  title: string;
  date: string;
  time?: string | null;
  description?: string | null;
  performer?: string | null;
  designation?: string | null;
  campus: string;
  link?: string | null;
  status: "upcoming" | "ongoing" | "completed";
}

export interface PublicEventVenue {
  venue_type: "physical" | "online" | "hybrid" | string;
  venue_address: string | null;
  venue_city: string | null;
  venue_maps_url: string | null;
  venue_online_link: string | null;
  venue_platform: string | null;
}

export interface PublicEventOrganizer {
  organiser_type: string;
  organiser_ig: {
    id: string;
    name: string;
    code: string;
  } | null;
  organiser_campus: {
    id: string;
    title: string;
    code: string;
  } | null;
  organiser_company: unknown | null;
  organiser_ci_id: unknown | null;
}

export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  description?: string | null;
  status: string;
  scope: string;
  event_scope: string;
  event_type: string;
  start_datetime: string;
  end_datetime: string;
  venue: PublicEventVenue | null;
  organizer: PublicEventOrganizer | null;
  is_featured: boolean;
  is_collaboration: boolean;
  interest_count: number;
  min_karma: number | null;
  tags: string[];
  user_limit: number | null;
  category_id: string | null;
  category_name: string | null;
  viewer_interest_status: string | null;
}

export interface PublicEventsParams {
  status?: "upcoming" | "ongoing" | "completed" | Array<"upcoming" | "ongoing" | "completed">;
  start_date?: string;
  end_date?: string;
  event_type?: string;
  scope?: string;
  ig_id?: string;
  campus_id?: string;
  cluster?: string;
  is_featured?: boolean;
  tags?: string;
  search?: string;
  sortBy?: string;
}

export interface OMEvent {
  id: number;
  title: string;
  description: string;
  date?: string;
  time?: string;
  performer?: string;
  designation?: string;
  tags?: string[];
  interestGroups?: string[];
  thumbnail?: string;
  link?: string;
  isUpcoming: boolean;
}

export interface OfficeHours {
  id: number;
  title: string;
  date?: string;
  description: string;
  performer?: string;
  tags: string[];
  ig?: string;
  thumbnail?: string;
  isUpcoming: boolean;
}

export interface OfficeHoursData {
  events: OfficeHours[];
}

export interface WeeklyTwitchEvent {
  id: number;
  topic: string;
  campus: string;
  zone: string;
  date: string;
  description: string;
  isUpcoming: boolean;
}

export interface WeeklyTwitchData {
  "salt mango tree": WeeklyTwitchEvent[];
  "inspiration station radio": WeeklyTwitchEvent[];
}
