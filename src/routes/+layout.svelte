<script>
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/AppwriteService';
	import { onMount } from 'svelte';

	let isReady = false;

	onMount(async () => {
		await AppwriteService.fetchAccount();
		isReady = true;
	});
</script>

{#if isReady}
	<div class="container">
		{#if $accountStore}
			<button class="btn btn-secondary" on:click={AppwriteService.logout}>Logout</button>
		{:else}
			<button class="btn btn-dark" on:click={AppwriteService.login}>Login with GitHub</button>
		{/if}

		<hr />

		<slot />
	</div>
{:else}
	<p>Loading ...</p>
{/if}
