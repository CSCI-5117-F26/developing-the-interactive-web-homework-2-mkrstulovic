import { betterAuth } from "better-auth";
import { db, mongo_client } from "#lib/mongo.server.ts";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { BETTER_AUTH_SECRET } from "$app/env/private";
import { BETTER_AUTH_URL } from "$app/env/public";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  database:mongodbAdapter(db, {
    client:mongo_client,
  }),

  advanced: {
    database: {
      joins: true,
    },
  },

  plugins: [sveltekitCookies(getRequestEvent)],

  emailAndPassword: { 
    enabled: true, 
  }
});
