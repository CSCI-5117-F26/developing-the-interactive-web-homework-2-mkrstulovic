<script lang="ts">
  import { authClient } from "#lib/auth.client.ts";
	import { refreshAll } from "$app/navigation";
  import CategoryFilter from "#lib/CategoryFilter.svelte";
	import SignOut from "#lib/SignOut.svelte";
  let catFilter: CategoryFilter;
  const session = authClient.useSession();
  const { data, params } = $props();
  let todos = $derived(data.todos)
  let category = $derived(params.category);
  
  let todo_to_add = $state('');

  async function add_todo() {
    const res = await fetch(`/todos`, {
      method: 'PATCH',
      body: JSON.stringify({todo_to_add, category}),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    refreshAll();
  }
  async function mark_todo_done(todo_id: String) {
    const res = await fetch(`/todos`, {
      method: 'PATCH',
      body: JSON.stringify({mark_done: todo_id}),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    refreshAll();
  }
</script>

<SignOut />

<h1>TODOS</h1>
<h2>Hello {$session?.data?.user?.name}</h2>
<a href="/done">See Completed To-Do Items</a>

<CategoryFilter bind:this={catFilter} base_url={'todos'} />
<button onclick={() => catFilter.reload()}> Refresh categories </button>

<input type='textarea' placeholder="Add a new to-do item here..." maxlength="500" bind:value={todo_to_add} />
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
    <td><button onclick={() => mark_todo_done(todo.id)}>Mark Complete?</button></td></tr>
  {/each}
  </tbody>
</table>
{:else }
no todos
{/if}