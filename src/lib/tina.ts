import { client } from "@/tina/__generated__/client";
import type { Event, OfficeHours, SpecialEvent } from "@/tina/__generated__/types";

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

// Types for external use
export type { Event, SpecialEvent, OfficeHours };
