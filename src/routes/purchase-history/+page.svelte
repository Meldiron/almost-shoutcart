<script lang="ts">
	import { AppwriteService } from '$lib/AppwriteService';
	import { onMount } from 'svelte';

	let orders: any[] | null = null;
	let hasMore = true;

	async function refreshOrders() {
		orders = [];
		hasMore = true;

		orders = await AppwriteService.getOrders();
		hasMore = orders ? orders.length > 0 : false;
	}

	onMount(async () => {
		await refreshOrders();
	});

	function verifyOrder(orderId: string) {
		return async () => {
			await AppwriteService.verifyOrder(orderId);
			await refreshOrders();
		};
	}

	async function loadPage() {
		if (!orders || orders.length < 0) {
			return;
		}

		const newOrders = await AppwriteService.getOrders(orders[orders.length - 1].$id);
		hasMore = newOrders ? newOrders.length > 0 : false;

		if(newOrders) {
			orders.push(...newOrders);
		}
	}

  function getVerboseDate(date: string) {
    return new Date(date).toLocaleString();
  }
</script>

<div class="pricing-header p-3 pb-md-4 mx-auto text-center">
  <h1 class="display-4 fw-normal">What all have you bought?</h1>
  <p class="fs-5 text-muted">Convinient list of how much money you spent on advertisments.</p>
</div>

{#if orders === null}
<div class="d-flex justify-content-center">
  <div class="spinner-border spinner-border" role="status"></div>
</div>
{:else}
	{#if orders.length <= 0}
		<p>No orders in your history.</p>
	{/if}


		{#each orders as order}
    <div class={`card mb-3 ${order.status === 'PENDING' || order.status === 'AUTHORISED' || order.status === 'PROCESSING' ? 'border-warning' : order.status === 'COMPLETED' ? 'border-success' : 'border-danger'}`}>
      <div class="card-header">Payment from {getVerboseDate(order.$createdAt)} <small class="text-gray">(#{order.$id})</small> </div>

    <div class="py-3 bg-dark px-3">
        <code>
          {order.msg}
      </code>
    </div>

      {#if order.status === 'PENDING'}
      <div class="card-body">
        <h5 class="card-title text-warning">Not paid yet!</h5>
        <p class="card-text">We did not yet recieve update about this payment. Make sure to finish the payment.</p>
      </div>
      <div class="card-footer bg-transparent border-gray py-3">
        <a target="_blank" href={order.revolutPaymentUrl}><button type="button" class="btn btn-primary">Pay using Revolut</button></a>
        <button on:click={verifyOrder(order.$id)} type="button" class="btn btn-outline-dark">Verify payment</button>
        <div class="mt-2">
          <small>There were <b>{order.attempts}/5</b> attempts to verify payments.</small>
        </div>
      </div>
      {:else if order.status === 'AUTHORISED' || order.status === 'PROCESSING'}
      <div class="card-body">
        <h5 class="card-title text-warning">Payment recieved!</h5>
        <p class="card-text">Almost there! You did your part. Payment was finished, now our system will post shoutout. This usually only take a few moments.</p>
      </div>
      {:else if order.status === 'COMPLETED'}
      <div class="card-body">
        <h5 class="card-title text-success">Shoutout fimished!</h5>
        <p class="card-text">Wohoo! The shoutout was fullfilled on our Discord server.</p>
      </div>
      {:else if order.status === 'CANCELLED' || order.status === 'FAILED'}
      <div class="card-body">
        <h5 class="card-title text-danger">No, no, no!</h5>
        <p class="card-text">Hey! You did not pay! We are not going to send a shotout.</p>
      </div>
      {/if}
    </div>
		{/each}


	{#if hasMore}
		<button on:click={loadPage} class="btn btn-outline-primary" style="width: 100%;">Load more</button>
	{/if}
{/if}
