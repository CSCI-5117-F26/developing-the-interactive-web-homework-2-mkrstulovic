import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db, EJSON } from '#lib/mongo.server.ts';

const users = db.collection('user');

export const GET: RequestHandler = async ({ locals }) => {
	const foundUser = await users.findOne(
		{ email: locals.user.email },
		{ projection: { created_categories: 1 } }
	);
	const categories: Category[] = foundUser?.created_categories ?? [];
	return new Response(EJSON.stringify({ categories }), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { name } = await request.json();
	const trimmed = typeof name === 'string' ? name.trim() : '';
	if (!trimmed) error(400, 'Category Name required');

	const category: Category = {
		id: crypto.randomUUID(),
		name: trimmed,
		time_created: Date.now()
	};
	const update = {} as any;
	update['$push'] = { 'created_categories': category };

	// Leverages MongoDB insert failure to provide error messages.
	const result = await users.updateOne(
		{ email: locals.user.email, 'created_categories.name': { $ne: trimmed } },
		update,
		{ collation: { locale: 'en', strength: 2 } }
	);
	if (result.matchedCount === 0) error(409, `A category named "${trimmed}" already exists`);

	return new Response(EJSON.stringify({ result, category }), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { name } = await request.json();
	if (typeof name !== 'string' || !name) error(400, 'Category Name required');

	const update = {} as any;
	update['$pull'] = { 'created_categories': { name } };
	await users.updateOne(
		{ email: locals.user.email },
		update
	);

	const result = await users.updateOne(
		{ email: locals.user.email, 'todos.category': name },
		{ $set: { 'todos.$[t].category': null, 'todos.$[t].time_updated': Date.now() } },
		{ arrayFilters: [{ 't.category': name }] }
	);

	return new Response(EJSON.stringify(result), {
		headers: { 'Content-Type': 'application/json' }
	});
};
