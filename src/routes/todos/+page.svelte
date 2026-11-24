<script lang="ts">
  import { authClient } from "#lib/auth.client.ts";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
  const session = authClient.useSession();
  const {data} = $props()
  console.log(data)
  const todos = $state(data.todos)

  let todo_to_add = $state('');

  async function add_todo() {
    const res = await fetch(`/todos`, {
      method: 'PATCH',
      body: JSON.stringify({todo_to_add}),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    console.log(result);
  }
  async function mark_todo_done(todo_id: String) {
    const res = await fetch(`/todos`, {
      method: 'PATCH',
      body: JSON.stringify({mark_done: todo_id}),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    console.log(result);
  }
</script>

<button onclick={async () => await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      goto(resolve('/'));
    },
  },
})}>
  Sign Out
</button> 
<h1>TODOS</h1>
<h2>Hello {$session?.data?.user?.name}</h2>
<a href="/done">See Completed To-Do Items</a>

<input type='textarea' placeholder="Add a new to-do item here..." bind:value={todo_to_add} />
<button onclick={add_todo} >Add New To-Do</button>
{#if todos.length > 0}
<table>
  <thead>
    <tr><th>Desc</th><th>Done?</th></tr>
    </thead>
    <tbody>
  {#each todos as todo (todo.id) }
  <tr>
    <td><a href="/todo/{todo.id}">{todo.desc}</a></td>
    <td><button onclick={mark_todo_done(todo.id)}>Mark Complete?</button></td></tr>
  {/each}
  </tbody>
</table>
{:else }
no todos
{/if}