<script lang="ts">
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/AppwriteService';
	import { onMount } from 'svelte';

	let msg = '';

	let orders: any[] | null = null;
	let hasMore = true;

	async function refreshOrders() {
		orders = [];
		hasMore = true;

		orders = await AppwriteService.getOrders();
		hasMore = orders.length > 0;
	}

	onMount(async () => {
		await refreshOrders();
	});

	async function createOrder() {
		const url = await AppwriteService.createOrder(msg);

		await refreshOrders();

		window.open(url, '_blank')?.focus();
	}

	function verifyOrder(orderId: string) {
		return async () => {
			const data = await AppwriteService.verifyOrder(orderId);
			await refreshOrders();
			console.log(data);
		};
	}

	async function loadPage() {
		if (!orders || orders.length < 0) {
			return;
		}

		const newOrders = await AppwriteService.getOrders(orders[orders.length - 1].$id);
		hasMore = newOrders.length > 0;
		orders.push(...newOrders);
	}
</script>

<h1>Homepage</h1>

<hr />

{#if !$accountStore}
	<p>
		This is a demo app showcasing Appwrite + Online payments. In this demo we will use <a
			href="https://www.revolut.com/"
			target="_blank">Revolut</a
		> as our payment gateway. It supports Revolut Pay, Google Pay, Apple Pay and card payments.
	</p>

	<p>
		Revolut does not support redirect URLs, so instead of fetching status after reditect, there will
		be button to 'Verify Payment'. We also verify all pending payments every 60 minutes.
	</p>

	<p>Login first! <small class="text text-sm text-secondary">(look above)</small></p>
{:else}
	<p>Welcome!</p>

	<hr />

	<p>
		This is a demo app showcasing Appwrite + Online payments. In this demo we will use <a
			href="https://www.revolut.com/"
			target="_blank">Revolut</a
		> as our payment gateway. It supports Revolut Pay, Google Pay, Apple Pay and card payments.
	</p>

	<p>
		Revolut does not support redirect URLs, so instead of fetching status after reditect, there will
		be button to 'Verify Payment'. We also verify all pending payments every 60 minutes.
	</p>

	<hr />

	<h3>Buy shoutout</h3>

	<p>
		Once purchased, verify payment. We will post your message on our <a
			href="https://discord.gg/3sAmyqN6Ud"
			target="_blank">Discord Server</a
		> after successful verification.
	</p>

	<form on:submit|preventDefault={createOrder}>
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
		<button type="submit" class="btn btn-primary">Buy for 0.01€</button>

		<div class="mt-2">
			<small
				>Payment is done in a production environment. You will pay 0.01€. Sadly, both 0.00€ payment
				and Revolut sandbox is broken. This is the only way.</small
			>
		</div>
	</form>

	<hr />

	<h3>Order History</h3>

	{#if orders === null}
		<p>Loading ...</p>
	{:else}
		{#if orders.length <= 0}
			<p>No orders in your history.</p>
		{/if}

		<ul>
			{#each orders as order}
				<li>
					<b>[{order.status}]</b>
					{order.msg} <small>({order.$createdAt}) - ATTEMPTS {order.attempts}/5</small>

					{#if order.status === 'PENDING'}
						<a target="_blank" href={order.revolutPaymentUrl}
							><button class="btn btn-success btn-sm">Pay using Revolut</button></a
						><button on:click={verifyOrder(order.$id)} class="btn btn-warning btn-sm"
							>Verify payment</button
						>
					{/if}
				</li>
			{/each}
		</ul>

		{#if hasMore}
			<button on:click={loadPage} class="btn btn-secondary">Load more</button>
		{/if}
	{/if}
{/if}
