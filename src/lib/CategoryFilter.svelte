<script lang="ts">
	import { onMount } from 'svelte';
	import { refreshAll } from '$app/navigation';

	let { onchange, base_url }: { onchange?: (categories: Category[]) => void, base_url: String } = $props();

	let categories = $state<Category[]>([]);
	let new_category = $state('');
	let loading = $state(true);
	let error_msg = $state('');

	// Exported so a parent can call it: <CategoryManager bind:this={mgr} /> then mgr.reload()
	export async function reload() {
		loading = true;
		error_msg = '';
		try {
			const res = await fetch('/api/categories');
			if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
      const result = await res.json();
      categories = result.categories;
		} catch (e) {
			error_msg = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	async function add_category(e: SubmitEvent) {
		e.preventDefault();
		const name = new_category.trim();
		if (!name) return;

		const res = await fetch('/api/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		});
		if (!res.ok) return (error_msg = 'Could not add category');

    const result = await res.json();
		categories.push(result.category);
		new_category = '';
		onchange?.(categories);
	}

	async function delete_category(id: string) {
		const res = await fetch('/api/categories', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		if (!res.ok) return (error_msg = 'Could not delete category');

		categories = categories.filter((c) => c.id !== id);
		await refreshAll(); // re-run page load()s so todos no longer show the deleted category
		onchange?.(categories);
	}

	onMount(reload);
</script>

<section>
	<h3>Categories</h3>

	<form onsubmit={add_category}>
		<input placeholder="New category..." bind:value={new_category} />
		<button type="submit" disabled={!new_category.trim()}>Create</button>
	</form>

	{#if error_msg}<p role="alert">{error_msg}</p>{/if}

	{#if loading}
		<p>Loading…</p>
	{:else if categories.length === 0}
		<p>No categories yet</p>
	{:else}
		<ul>
			{#each categories as category (category.id)}
				<li>
					<a href='/{base_url}/{category.name}'>{category.name}</a>
					<button onclick={() => delete_category(category.id)}>Delete</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>