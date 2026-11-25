import { error } from '@sveltejs/kit';
import { db } from '#lib/mongo.server.ts';

// Server-side validation, checks for max length, and untrusted request bodies.
export const MAX_TODO_LENGTH = 500;
export const MAX_CATEGORY_LENGTH = 50;

// UUID structure regex (hey this was hard to setup... would be nice to have an app for it)
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Get control characters outta here.
const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

/** Parses a JSON object body,
 *  responds 400 instead of 500 on malformed input. */
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		error(400, 'Request body must be valid JSON');
	}
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		error(400, 'Request body must be a JSON object');
	}
	return body as Record<string, unknown>;
}

/** Require trimmed, non-empty string. Cannot be longer than <max> characters. */
export function requireText(value: unknown, field: string, max: number): string {
	if (typeof value !== 'string') error(400, `${field} must be a string`);
	const trimmed = value.trim();
	if (!trimmed) error(400, `${field} is required`);
	if (trimmed.length > max) error(400, `${field} must be at most ${max} characters`);
	if (CONTROL_CHARS_RE.test(trimmed)) error(400, `${field} contains invalid characters`);
	return trimmed;
}

/** Require id in UUID format that crypto.randomUUID() uses. */
export function requireId(value: unknown, field = 'id'): string {
	if (typeof value !== 'string' || !UUID_RE.test(value)) error(400, `${field} is invalid`);
	return value;
}

/** Requre boolean properly formatted. */
export function requireBoolean(value: unknown, field: string): boolean {
	if (typeof value !== 'boolean') error(400, `${field} must be true or false`);
	return value;
}

/**
 * Accept null/empty or name of a category the user owns,
 * todos can only reference categories that actually exist.
 */
export async function requireOwnCategory(value: unknown, email: string): Promise<string | null> {
	if (value === null || value === undefined || value === '') return null;
	const name = requireText(value, 'Category', MAX_CATEGORY_LENGTH);
	const owner = await db
		.collection('user')
		.findOne({ email, 'created_categories.name': name }, { projection: { _id: 1 } });
	if (!owner) error(400, `Category "${name}" does not exist`);
	return name;
}
