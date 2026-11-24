import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {db, EJSON} from '#lib/mongo.server.ts'
import { getRequestEvent } from '$app/server';

export const PATCH: RequestHandler = async ({request, params}) => {
  const { todo_id } = params;
  const event = getRequestEvent();
  const user = event.locals.user;
  const { edit_todo } = await request.json();

  const update = {} as any;
  
  if (edit_todo) {
    update['$set'] = {
      'todos.$.desc': edit_todo.desc,
      'todos.$.done': edit_todo.done,
      'todos.$.category': edit_todo.category,
      'todos.$.time_updated': Date.now(),
    };
  }
  const result = await db.collection("user").updateOne({email: user.email, "todos.id": todo_id}, update);
  return new Response(EJSON.serialize(result));
};