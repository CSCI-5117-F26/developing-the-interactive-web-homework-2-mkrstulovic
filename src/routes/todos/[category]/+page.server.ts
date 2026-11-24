import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {db, EJSON} from '#lib/mongo.server.ts'
import { getRequestEvent } from '$app/server';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { category } = params;
    const event = getRequestEvent();
    const user = event.locals.user;
    const foundUser = await db.collection("user").findOne({email: user.email});
    const todos = foundUser?.todos?.filter((todo: Todo) => !todo.done && todo.category === category) ?? [];
    return {todos: EJSON.serialize(todos) as unknown as Todo[]};
  } catch {
    error(404, 'Not found');
  }
};