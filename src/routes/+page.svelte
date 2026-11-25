<script lang="ts">
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let create = $state(false);
  import { authClient } from "#lib/auth.client.ts";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
  const session = authClient.useSession();
  
  async function login() {
    
  }
  
</script>

<h1>Todo Master</h1>
<button onclick={() => create = false}>Existing User</button>
<button onclick={() => create = true}>Create New Account</button>

{#if create}
<h3>Please Sign Up</h3>
<input type='text' placeholder='Username' bind:value={name} />
<input type='text' placeholder='Email' bind:value={email} />
<input type='text' placeholder='Password' bind:value={password} />
<button
onclick={async () => {
  await authClient.signUp.email({name, email, password}, {
        onSuccess: (ctx: any) => {
          goto(resolve('/todos', {}));
        },
        onError: (ctx: any) => {
            // display the error message
            alert(ctx.error.message);
        } })
}}
>
  Sign Up
</button>
{:else}
<h3>Please Log In</h3>
<input type='text' placeholder='Email' bind:value={email} />
<input type='text' placeholder='Password' bind:value={password} />
<button
onclick={async () => {
  await authClient.signIn.email({email, password}, {
        onSuccess: (ctx: any) => {
          goto(resolve('/todos', {}));
        },
        onError: (ctx: any) => {
            // display the error message
            alert(ctx.error.message);
        }
      })
}}
>
  Log in
</button>
{/if}
