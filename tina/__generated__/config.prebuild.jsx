// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // TinaCloud credentials (only include if available)
  ...process.env.NEXT_PUBLIC_TINA_CLIENT_ID && {
    clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID
  },
  ...process.env.TINA_TOKEN && {
    token: process.env.TINA_TOKEN
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "assets/events",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // Events (individual files for main events like Top 100, Permute, etc.)
      {
        name: "event",
        label: "Events",
        path: "content/events",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.title?.toLowerCase().replace(/\s+/g, "-") || "new-event"}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "date",
            label: "Date",
            description: "e.g., 'Oct 1-31, 2025' or 'Every Tuesday'"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: { component: "textarea" }
          },
          {
            type: "string",
            name: "link",
            label: "Link URL"
          },
          {
            type: "image",
            name: "image",
            label: "Event Image"
          },
          {
            type: "boolean",
            name: "isLive",
            label: "Is Live?"
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              { label: "Latest Events", value: "latest" },
              { label: "Past Events", value: "past" },
              { label: "Flagship Events", value: "flagship" },
              { label: "Weekly Events", value: "weekly" },
              { label: "Biweekly Events", value: "biweekly" },
              { label: "Monthly Events", value: "monthly" }
            ]
          },
          {
            type: "number",
            name: "order",
            label: "Display Order"
          }
        ]
      },
      // Office Hours - Single file with array of sessions
      {
        name: "officeHours",
        label: "Office Hours",
        path: "content",
        format: "json",
        match: { include: "office-hours" },
        fields: [
          {
            type: "object",
            name: "sessions",
            label: "Sessions",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title || "New Session"
              })
            },
            fields: [
              { type: "string", name: "title", label: "Title", required: true },
              { type: "string", name: "performer", label: "Speaker/Host" },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: { component: "textarea" }
              },
              { type: "string", name: "date", label: "Date", description: "Format: DD/MM/YYYY" },
              { type: "string", name: "tags", label: "Tags", list: true },
              { type: "boolean", name: "isUpcoming", label: "Is Upcoming?" }
            ]
          }
        ]
      },
      // Salt Mango Tree - Single file with array of episodes
      {
        name: "saltMangoTree",
        label: "Salt Mango Tree",
        path: "content",
        format: "json",
        match: { include: "salt-mango-tree" },
        fields: [
          {
            type: "object",
            name: "episodes",
            label: "Episodes",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.topic || "New Episode"
              })
            },
            fields: [
              { type: "string", name: "topic", label: "Topic", required: true },
              { type: "string", name: "campus", label: "Campus", required: true },
              {
                type: "string",
                name: "zone",
                label: "Zone",
                options: ["North", "Central", "South"]
              },
              { type: "string", name: "date", label: "Date", description: "Format: YYYY-MM-DD" },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: { component: "textarea" }
              },
              { type: "boolean", name: "isUpcoming", label: "Is Upcoming?" }
            ]
          }
        ]
      },
      // Inspiration Station Radio - Single file with array of episodes
      {
        name: "inspirationStation",
        label: "Inspiration Station Radio",
        path: "content",
        format: "json",
        match: { include: "inspiration-station" },
        fields: [
          {
            type: "object",
            name: "episodes",
            label: "Episodes",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: `${item?.campus || "New Episode"}`
              })
            },
            fields: [
              { type: "string", name: "topic", label: "Topic", required: true },
              { type: "string", name: "campus", label: "Campus", required: true },
              {
                type: "string",
                name: "zone",
                label: "Zone",
                options: ["North", "Central", "South"]
              },
              { type: "string", name: "date", label: "Date", description: "Format: YYYY-MM-DD" },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: { component: "textarea" }
              },
              { type: "boolean", name: "isUpcoming", label: "Is Upcoming?" }
            ]
          }
        ]
      },
      // Special Events (Home Page) - Individual files
      {
        name: "specialEvent",
        label: "Special Events (Home)",
        path: "content/special-events",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: { component: "textarea" }
          },
          { type: "string", name: "link", label: "Link URL" },
          { type: "image", name: "image", label: "Event Image" },
          { type: "boolean", name: "isLive", label: "Is Live?" },
          { type: "number", name: "order", label: "Display Order" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
