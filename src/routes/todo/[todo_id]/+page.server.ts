import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {db, EJSON} from '#lib/mongo.server.ts'
import { getRequestEvent } from '$app/server';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { todo_id } = params;
    const event = getRequestEvent();
    const user = event.locals.user;
    const foundUser = await db.collection("user").findOne({email: user.email});
    if (foundUser) {
      const todos = foundUser.todos.filter((todo: {id: String}) => todo.id === todo_id);
      const categories = foundUser.created_categories;
      return {todos:EJSON.serialize(todos[0]), categories: EJSON.serialize(categories)}
    } else {
      error(404, 'Not found');
    }
  } catch {
    error(404, 'Not found');
  }
};