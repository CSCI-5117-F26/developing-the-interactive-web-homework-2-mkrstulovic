<script lang="ts">
  const {data} = $props();
  const todo = $state(data.todos);

  async function edit_todo() {
    const res = await fetch(`/todos/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({edit_todo: todo}),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    console.log(result);
  }
</script>
<a href="/todos">Return to To-Do List</a>
<input type='textarea' placeholder="Enter to-do text here..." bind:value={todo.desc} />
<input type='checkbox' bind:checked={todo.done} />
<button onclick={edit_todo}>Save Changes</button>
