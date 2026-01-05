import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({
  url: "http://localhost:4001/graphql",
  token: "5bd62e8201809ede153211fb33e88c1654b0394e",
  queries,
});
export default client;
