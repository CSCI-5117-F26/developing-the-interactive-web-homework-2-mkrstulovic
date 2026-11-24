<script lang="ts">
  import { authClient } from "#lib/auth.client.ts";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
  const session = authClient.useSession();
  const {data} = $props()
  console.log(data)
  const todos = $state(data.todos)

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
<a href="/todos">See Uncompleted To-Do Items</a>

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