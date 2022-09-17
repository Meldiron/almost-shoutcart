<script>
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/AppwriteService';

	let msg = '';
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
		Once purchased, we will instantly post your message on behalf of our <a
			href="https://twitter.com/almostshoutcart"
			target="_blank">Twitter account</a
		>.
	</p>

	<form on:submit|preventDefault={() => AppwriteService.createOrder(msg)}>
		<div class="form-group">
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

		<div>
			<small>Payment is done in a sandbox environment. You don't pay anything, no worries.</small>
		</div>
	</form>
{/if}
