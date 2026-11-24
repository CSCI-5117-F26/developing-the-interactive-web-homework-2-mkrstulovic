import { auth } from "#lib/auth.server.js";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/env";
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';

const PUBLIC_ROUTES = new Set(['/']);

// called everytime the server receives a request
export async function handle({ event, resolve }) {

  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  // Make session and user available on server
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  // Let Better Auth's own endpoints (sign-up, sign-in, session...) through
  const isAuthApi = event.url.pathname.startsWith('/api/auth');

  if (!isAuthApi && !event.locals.user && !PUBLIC_ROUTES.has(event.route.id ?? '')) {
		redirect(303, '/');
	}

  return svelteKitHandler({ event, resolve, auth, building });
}
