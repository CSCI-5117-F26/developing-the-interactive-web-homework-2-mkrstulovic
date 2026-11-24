import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {db, EJSON} from '#lib/mongo.server.ts'
import { getRequestEvent } from '$app/server';

export const PATCH: RequestHandler = async ({request, params}) => {
    const event = getRequestEvent();
    const user = event.locals.user;
    const { todo_to_add, mark_done } = await request.json();
    
    const update = {} as any;
    let result;
    if (todo_to_add) {
      update['$push'] = {'todos': {
        id: crypto.randomUUID(),
        desc: todo_to_add,
        done: false,
        category: null,
        time_created: Date.now(),
        time_updated: Date.now(), 
      }};
      result = await db.collection("user").updateOne({email: user.email}, update)
    }
    if (mark_done) {
      update['$set'] = {
        'todos.$.done': true,
        'todos.$.time_updated': Date.now(),
      };
      result = await db.collection("user").updateOne({email: user.email, "todos.id": mark_done}, update)
    }
    return new Response(EJSON.serialize(result));
};