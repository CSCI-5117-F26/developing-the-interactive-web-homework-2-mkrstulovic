<script lang="ts">
  import { authClient } from "#lib/auth.client.ts";
  import CategoryFilter from "#lib/CategoryFilter.svelte";
	import SignOut from "#lib/SignOut.svelte";
  let catFilter: CategoryFilter;
  const session = authClient.useSession();
  const {data} = $props()
  let todos = $derived(data.todos)

</script>

<SignOut />
<h1>TODOS</h1>
<h2>Hello {$session?.data?.user?.name}</h2>
<a href="/todos">See Uncompleted To-Do Items</a>

<CategoryFilter bind:this={catFilter} base_url={'done'} />
<button onclick={() => catFilter.reload()}> Refresh categories </button>

{#if todos.length > 0}
<table>
  <thead>
    <tr><th>Desc</th><th>Done?</th></tr>
    </thead>
    <tbody>
  {#each todos as todo (todo.id) }
  <tr>
    <td><a href="/todo/{todo.id}">{todo.desc}</a></td>
    <td>CHECKMARK</td></tr>
  {/each}
  </tbody>
</table>
{:else }
no todos
{/if}