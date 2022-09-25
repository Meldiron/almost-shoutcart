<script lang="ts">
	import { goto } from '$app/navigation';
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/AppwriteService';
	import { loadingStore } from '$lib/loadingStore';

	let msg = '';

	async function createOrder() {
		const res = await AppwriteService.createOrder(msg);

		if(res) {
        	loadingStore.set({ state: true, msg: "Finish order. When done, close the payment window." });
			const win = window.open(res.url, '_blank');

			if(!win) {
        		loadingStore.set({ state: false });
				return;
			}

			const timer = setInterval(async () => {
				if (win.closed) {
					clearInterval(timer);
					await AppwriteService.verifyOrder(res.id);
        			loadingStore.set({ state: false });
					goto('/purchase-history');
				}
			}, 500);
			
			win.focus();
		}
	}
</script>

<div class="bg-dark p-5 rounded">
    <div class="col-sm-8">
      <h1 class="text-light display-5 fw-normal">This Is a Demo App!</h1>
      <p class="text-light">This application includes online payments, but everything is in <b>sandbox environment</b>. All purchases are fake. Do <b>not</b> enter real data. </p>

	  <hr>

	  <p class="text-light">You will see showcase of <a href="https://appwrite.io/">Appwrite</a> and <a href="https://www.revolut.com/business/business-account/">Revolut Pay</a> working together.</p>
  </div>
</div>


<div class="mt-5">
	<h4 class="mb-1">Buy Shoutout</h4>
	<p class="mb-3">
		Once purchased, verify payment. We will post your message on our <a
			href="https://discord.gg/3sAmyqN6Ud"
			target="_blank">Discord Server</a
		> after successful verification.
	</p>

	{#if $accountStore}
	<form on:submit|preventDefault={createOrder} class="needs-validation">
		<div class="col-12">
		  <label for="yourMessage" class="form-label">Your Message</label>
		  <textarea
				bind:value={msg}
				required={true}
				maxlength="280"
				class="form-control"
				id="yourMessage"
				rows="3"
			/>
		</div>

	  <button class="w-100 btn btn-primary btn-lg mt-3" type="submit">Purchase for 0.99€</button>

		<div class="mt-2 text-center">
			<small
				>Payments are fake. Just click 'Revolut Pay' and confirm. That's it.</small
			>
		</div>
	</form>
	{:else}
	<div class="alert alert-warning" role="alert">
		Please sign in in order to purchase a shoutout.
	  </div>
	{/if}
  </div>