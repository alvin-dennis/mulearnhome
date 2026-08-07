import type { OngoingHiring, PaginationMeta, PreviousHiring } from "@/lib/types";
import { publicGateway } from "./apiGateway";
import { careerLabRoutes } from "./urls";

export interface PaginatedCareersResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export async function fetchOngoingHiringPage(
  pageIndex = 1,
  perPage = 12,
): Promise<PaginatedCareersResponse<OngoingHiring>> {
  const res = await publicGateway.get(careerLabRoutes.ongoing, {
    params: { pageIndex, perPage },
  });
  const raw = res.data?.response;
  const data: OngoingHiring[] = Array.isArray(raw?.data) ? raw.data : [];
  const pagination: PaginationMeta = raw?.pagination ?? {
    count: data.length,
    totalPages: 1,
    isNext: false,
    isPrev: false,
    nextPage: null,
    prevPage: null,
    current_page: pageIndex,
  };
  return { data, pagination };
}

export async function fetchPreviousHiringPage(
  pageIndex = 1,
  perPage = 12,
): Promise<PaginatedCareersResponse<PreviousHiring>> {
  const res = await publicGateway.get(careerLabRoutes.previous, {
    params: { pageIndex, perPage },
  });
  const raw = res.data?.response;
  const data: PreviousHiring[] = Array.isArray(raw?.data) ? raw.data : [];
  const pagination: PaginationMeta = raw?.pagination ?? {
    count: data.length,
    totalPages: 1,
    isNext: false,
    isPrev: false,
    nextPage: null,
    prevPage: null,
    current_page: pageIndex,
  };
  return { data, pagination };
}
