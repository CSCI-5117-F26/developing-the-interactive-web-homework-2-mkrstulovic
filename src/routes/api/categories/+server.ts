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

	const result = await users.updateOne(
		{ email: locals.user.email },
		update
	);
	return new Response(EJSON.stringify({ result, category }), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { id } = await request.json();
	if (typeof id !== 'string') error(400, 'Category ID required');

	const update = {} as any;
	update['$pull'] = { 'created_categories': { id } };
	await users.updateOne(
		{ email: locals.user.email },
		update
	);

	const result = await users.updateOne(
		{ email: locals.user.email, 'todos.category': id },
		{ $set: { 'todos.$[t].category': null, 'todos.$[t].time_updated': Date.now() } },
		{ arrayFilters: [{ 't.category': id }] }
	);

	return new Response(EJSON.stringify(result), {
		headers: { 'Content-Type': 'application/json' }
	});
};
