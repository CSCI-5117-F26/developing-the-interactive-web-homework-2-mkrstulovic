import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {db, EJSON} from '#lib/mongo.server.ts'
import { getRequestEvent } from '$app/server';
import {
  readJsonBody,
  requireText,
  requireId,
  requireBoolean,
  requireOwnCategory,
  MAX_TODO_LENGTH
} from '#lib/validation.server.ts';

export const PATCH: RequestHandler = async ({request, params}) => {
  const todo_id = requireId(params.todo_id, 'Todo id');
  const event = getRequestEvent();
  const user = event.locals.user;
  const { edit_todo } = await readJsonBody(request);

  if (typeof edit_todo !== 'object' || edit_todo === null) error(400, 'edit_todo is required');
  const { desc, done, category } = edit_todo as Record<string, unknown>;

  const update = {
    $set: {
      'todos.$.desc': requireText(desc, 'To-do text', MAX_TODO_LENGTH),
      'todos.$.done': requireBoolean(done, 'Done'),
      'todos.$.category': await requireOwnCategory(category, user.email),
      'todos.$.time_updated': Date.now(),
    }
  };
  const result = await db.collection("user").updateOne({email: user.email, "todos.id": todo_id}, update);
  if (result.matchedCount === 0) error(404, 'To-do not found');
  return new Response(EJSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
};
