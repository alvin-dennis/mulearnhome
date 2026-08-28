import { publicGateway } from "@/lib/fetcher";
import { endpoints } from "@/shared";
import type {
  GrabYourSuperpowersSession,
  OfficeHoursSession,
  PublicEvent,
  PublicEventsParams,
  WeeklyTwitchEpisode,
  WeeklyTwitchPagination,
  WeeklyTwitchParams,
} from "../types/events.types";

function buildPublicEventsParams(params: PublicEventsParams): URLSearchParams {
  const out = new URLSearchParams();

  if (params.status) {
    for (const s of Array.isArray(params.status) ? params.status : [params.status]) {
      out.append("status", s);
    }
  }
  if (params.start_date) out.append("start_date", params.start_date);
  if (params.end_date) out.append("end_date", params.end_date);
  if (params.event_type) out.append("event_type", params.event_type);
  if (params.scope) out.append("scope", params.scope);
  if (params.ig_id) out.append("ig_id", params.ig_id);
  if (params.campus_id) out.append("campus_id", params.campus_id);
  if (params.cluster) out.append("cluster", params.cluster);
  if (params.is_featured !== undefined) out.append("is_featured", String(params.is_featured));
  if (params.tags) out.append("tags", params.tags);
  if (params.search) out.append("search", params.search);
  if (params.sortBy) out.append("sortBy", params.sortBy);

  return out;
}

// response is a plain array — no data/pagination wrapper
export async function fetchPublicEvents(params?: PublicEventsParams): Promise<PublicEvent[]> {
  const res = await publicGateway.get(endpoints.publicEvents.getEvents, {
    params: params ? buildPublicEventsParams(params) : undefined,
  });
  return res.data.response;
}

interface WeeklyTwitchResponse<T> {
  data: T[];
  pagination: WeeklyTwitchPagination;
}

function buildWeeklyTwitchParams(params: WeeklyTwitchParams): URLSearchParams {
  const out = new URLSearchParams();
  if (params.status) {
    for (const status of Array.isArray(params.status) ? params.status : [params.status]) {
      out.append("status", status);
    }
  }
  if (params.search) out.append("search", params.search);
  if (params.pageIndex !== undefined) out.append("pageIndex", String(params.pageIndex));
  if (params.perPage) out.append("perPage", String(params.perPage));
  return out;
}

export async function fetchOfficeHours(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<OfficeHoursSession>> {
  const res = await publicGateway.get(endpoints.weeklyTwitches.officeHours, {
    params: buildWeeklyTwitchParams(params),
  });
  return res.data.response;
}

export async function fetchSaltMangoTree(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<WeeklyTwitchEpisode>> {
  const res = await publicGateway.get(endpoints.weeklyTwitches.saltMangoTree, {
    params: buildWeeklyTwitchParams(params),
  });
  return res.data.response;
}

export async function fetchInspirationStation(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<WeeklyTwitchEpisode>> {
  const res = await publicGateway.get(endpoints.weeklyTwitches.inspirationStation, {
    params: buildWeeklyTwitchParams(params),
  });
  return res.data.response;
}

export async function fetchGrabYourSuperpowers(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<GrabYourSuperpowersSession>> {
  const res = await publicGateway.get(endpoints.weeklyTwitches.grabYourSuperpowers, {
    params: buildWeeklyTwitchParams(params),
  });
  return res.data.response;
}
