<script lang="ts">
  const {data} = $props();
  const todo = $derived(data.todos);
  const categories = $derived(data.categories);

  const options = $derived(categories.map((cat: Category) => cat.name));

  async function edit_todo() {
    const res = await fetch(`/todo/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({edit_todo: todo}),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
  }
</script>
<a href="/todos">Return to To-Do List</a>
<input type='textarea' placeholder="Enter to-do text here..." maxlength="500" bind:value={todo.desc} />
<input type='checkbox' bind:checked={todo.done} />
<select name='category' id='cat' bind:value={todo.category}>
  <option value="" disabled selected>Select a category</option>
  {#each options as opt}
    <option value={opt}>{opt}</option>
  {/each}
</select>
<button onclick={edit_todo}>Save Changes</button>
