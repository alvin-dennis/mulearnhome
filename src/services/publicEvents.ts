import type { PublicEventsResponse } from "@/lib/types";
import { publicGateway } from "./apiGateway";
import { publicEventsRoutes } from "./urls";

export async function fetchPublicEvents(): Promise<PublicEventsResponse> {
  const res = await publicGateway.get(publicEventsRoutes.getEvents);
  return res.data.response;
}
