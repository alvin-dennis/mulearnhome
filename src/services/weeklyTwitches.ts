import axios from "axios";
import { clientEnv } from "@/lib/env/env.client";
import type {
  OfficeHoursSession,
  WeeklyTwitchEpisode,
  WeeklyTwitchPagination,
  WeeklyTwitchParams,
} from "@/lib/types";
import { weeklyTwitchesRoutes } from "./urls";

interface WeeklyTwitchResponse<T> {
  data: T[];
  pagination: WeeklyTwitchPagination;
}

function buildParams(params: WeeklyTwitchParams): Record<string, string> {
  const out: Record<string, string> = {};
  if (params.status) out.status = params.status;
  if (params.search) out.search = params.search;
  if (params.pageIndex !== undefined) out.pageIndex = String(params.pageIndex);
  if (params.perPage) out.perPage = String(params.perPage);
  return out;
}

export async function fetchOfficeHours(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<OfficeHoursSession>> {
  const res = await axios.get(
    `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${weeklyTwitchesRoutes.officeHours}`,
    { params: buildParams(params) },
  );
  return res.data.response;
}

export async function fetchSaltMangoTree(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<WeeklyTwitchEpisode>> {
  const res = await axios.get(
    `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${weeklyTwitchesRoutes.saltMangoTree}`,
    { params: buildParams(params) },
  );
  return res.data.response;
}

export async function fetchInspirationStation(
  params: WeeklyTwitchParams,
): Promise<WeeklyTwitchResponse<WeeklyTwitchEpisode>> {
  const res = await axios.get(
    `${clientEnv.NEXT_PUBLIC_API_BASE_URL}${weeklyTwitchesRoutes.inspirationStation}`,
    { params: buildParams(params) },
  );
  return res.data.response;
}
