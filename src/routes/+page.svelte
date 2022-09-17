<script>
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/AppwriteService';

	let msg = '';

	const orders = [
		{
			$createdAt: '2022-09-17T14:10:21.090+00:00',
			msg: 'Hello World!',
			status: 'FINISHED'
		},
		{
			$createdAt: '2022-09-17T14:10:21.090+00:00',
			msg: 'Hello World!',
			status: 'PENDING'
		},
		{
			$createdAt: '2022-09-17T14:10:21.090+00:00',
			msg: 'Hello World!',
			status: 'CREATED'
		},
		{
			$createdAt: '2022-09-17T14:10:21.090+00:00',
			msg: 'Hello World!',
			status: 'CANCELLED'
		}
	];
</script>

<h1>Homepage</h1>

<hr />

{#if !$accountStore}
	<p>Login first!</p>
{:else}
	<p>Welcome!</p>

	<hr />

	<h3>Buy shoutout</h3>

	<p>
		Once purchased, we will instantly post your message on our <a
			href="https://discord.gg/3sAmyqN6Ud"
			target="_blank">Discord Server</a
		>.
	</p>

	<form on:submit|preventDefault={() => AppwriteService.createOrder(msg)}>
		<div class="form-group mb-2">
			<label for="yourMessage">Your message</label>
			<textarea
				bind:value={msg}
				required={true}
				maxlength="280"
				class="form-control"
				id="yourMessage"
				rows="3"
			/>
		</div>
		<button type="submit" class="btn btn-primary">Buy for 0.99€</button>

		<div class="mt-2">
			<small>Payment is done in a sandbox environment. You don't pay anything, no worries.</small>
		</div>
	</form>

	<hr />

	<h3>Order History</h3>

	{#if orders.length <= 0}
		<p>No orders in your history.</p>
	{/if}

	<ul>
		{#each orders as order}
			<li><b>[{order.status}]</b> {order.msg} <small>({order.$createdAt})</small></li>
		{/each}
	</ul>

	<button class="btn btn-secondary">Load more</button>
{/if}
