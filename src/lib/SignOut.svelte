<script lang="ts">
  import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
  import { authClient } from "#lib/auth.client.ts";

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