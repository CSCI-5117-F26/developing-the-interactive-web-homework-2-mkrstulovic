import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {db, EJSON} from '#lib/mongo.server.ts'
import { getRequestEvent } from '$app/server';
import {
  readJsonBody,
  requireText,
  requireId,
  requireOwnCategory,
  MAX_TODO_LENGTH
} from '#lib/validation.server.ts';

export const PATCH: RequestHandler = async ({request}) => {
    const event = getRequestEvent();
    const user = event.locals.user;
    const { todo_to_add, mark_done, category } = await readJsonBody(request);

    if (todo_to_add === undefined && mark_done === undefined) {
      error(400, 'Nothing to update');
    }

    let result;
    if (todo_to_add !== undefined) {
      const desc = requireText(todo_to_add, 'To-do text', MAX_TODO_LENGTH);
      const todoCategory = await requireOwnCategory(category, user.email);
      result = await db.collection("user").updateOne({email: user.email}, {
        $push: {'todos': {
          id: crypto.randomUUID(),
          desc,
          done: false,
          category: todoCategory,
          time_created: Date.now(),
          time_updated: Date.now(),
        }} as any
      });
    }
    if (mark_done !== undefined) {
      const todo_id = requireId(mark_done, 'Todo id');
      result = await db.collection("user").updateOne({email: user.email, "todos.id": todo_id}, {
        $set: {
          'todos.$.done': true,
          'todos.$.time_updated': Date.now(),
        }
      });
      if (result.matchedCount === 0) error(404, 'To-do not found');
    }
    return new Response(EJSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
};
