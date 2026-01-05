import "server-only";
import { createClient } from "tinacms/dist/client";
import { clientEnv } from "@/lib/env/env.client";
import { serverEnv } from "@/lib/env/env.server";
import {
  type Event,
  type OfficeHours,
  queries,
  type SpecialEvent,
} from "@/tina/__generated__/types";

/**
 * Server-only TinaCMS client
 *
 * This client is created at runtime using environment variables,
 * preventing the TINA_TOKEN from being embedded in the build output.
 *
 * In local development (when TINA_PUBLIC_IS_LOCAL is set), connects to the local TinaCMS dev server.
 * In production, connects to TinaCloud.
 */
function getServerClient() {
  const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

  if (isLocal) {
    return createClient({
      url: "http://localhost:4001/graphql",
      token: "",
      queries,
    });
  }

  const branch =
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "production";

  return createClient({
    url: `https://content.tinajs.io/content/${clientEnv.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${branch}`,
    token: serverEnv.TINA_TOKEN || "",
    queries,
  });
}

const client = getServerClient();

/**
 * Fetch all events from TinaCMS
 */
export async function getAllEvents() {
  const eventsResponse = await client.queries.eventConnection();
  return eventsResponse.data.eventConnection.edges?.map((edge) => edge?.node) || [];
}

/**
 * Fetch events by category
 */
export async function getEventsByCategory(category: string) {
  const allEvents = await getAllEvents();
  return allEvents
    .filter((event) => event?.category === category)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0));
}

/**
 * Fetch latest events
 */
export async function getLatestEvents() {
  return getEventsByCategory("latest");
}

/**
 * Fetch past events
 */
export async function getPastEvents() {
  return getEventsByCategory("past");
}

/**
 * Fetch flagship events
 */
export async function getFlagshipEvents() {
  return getEventsByCategory("flagship");
}

/**
 * Fetch weekly events
 */
export async function getWeeklyEvents() {
  return getEventsByCategory("weekly");
}

/**
 * Fetch all recurring events (weekly, biweekly, monthly)
 */
export async function getRecurringEvents() {
  const allEvents = await getAllEvents();
  return {
    weekly: allEvents
      .filter((e) => e?.category === "weekly")
      .sort((a, b) => (a?.order || 0) - (b?.order || 0)),
    biweekly: allEvents
      .filter((e) => e?.category === "biweekly")
      .sort((a, b) => (a?.order || 0) - (b?.order || 0)),
    monthly: allEvents
      .filter((e) => e?.category === "monthly")
      .sort((a, b) => (a?.order || 0) - (b?.order || 0)),
    flagship: allEvents
      .filter((e) => e?.category === "flagship")
      .sort((a, b) => (a?.order || 0) - (b?.order || 0)),
  };
}

/**
 * Fetch all special events for home page
 */
export async function getSpecialEvents() {
  const response = await client.queries.specialEventConnection();
  return (
    response.data.specialEventConnection.edges
      ?.map((edge) => edge?.node)
      .sort((a, b) => (a?.order || 0) - (b?.order || 0)) || []
  );
}

/**
 * Fetch all office hours
 */
export async function getOfficeHours() {
  const response = await client.queries.officeHoursConnection();
  return response.data.officeHoursConnection.edges?.map((edge) => edge?.node) || [];
}

/**
 * Get a single event by filename
 */
export async function getEvent(filename: string) {
  const response = await client.queries.event({
    relativePath: `${filename}.json`,
  });
  return response.data.event;
}

/**
 * Fetch all Salt Mango Tree episodes
 */
export async function getSaltMangoTree() {
  const response = await client.queries.saltMangoTreeConnection();
  return response.data.saltMangoTreeConnection.edges?.map((edge) => edge?.node) || [];
}

/**
 * Fetch all Inspiration Station episodes
 */
export async function getInspirationStation() {
  const response = await client.queries.inspirationStationConnection();
  return response.data.inspirationStationConnection.edges?.map((edge) => edge?.node) || [];
}

// Types for external use
export type { Event, SpecialEvent, OfficeHours };
export type { InspirationStation, SaltMangoTree } from "@/tina/__generated__/types";
