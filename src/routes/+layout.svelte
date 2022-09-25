<script>
	import { accountStore } from '$lib/accountStore';
	import { AppwriteService } from '$lib/AppwriteService';
	import { loadingStore } from '$lib/loadingStore';
	import { onMount } from 'svelte';

	let isReady = false;

	onMount(async () => {
		await AppwriteService.fetchAccount();
		isReady = true;
	});
</script>

<div class="container">
	<header
		class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom"
	>
		<a
			href="/"
			class="d-flex align-items-end col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
		>
			<img src="/logo.svg" alt="Logo" width="32" style="padding-right: 6px">
			<span>Almost Shoutcart</span>
		</a>

		<ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
			<li><a href="/" class="nav-link px-2 link-dark">Home</a></li>
			<li><a href="/purchase-history" class="nav-link px-2 link-dark">Purchase History</a></li>
		</ul>

		<div class="col-md-3 text-end">
			{#if isReady}
				{#if $accountStore}
					<button type="button" on:click={AppwriteService.logout} class="btn btn-outline-primary me-2">Logout</button>
				{:else}
					<button type="button" on:click={AppwriteService.login} class="btn btn-dark">Login with GitHub</button>
				{/if}
			{:else}
				<div class="spinner-border spinner-border-sm" role="status"></div>
			{/if}
		</div>
	</header>
</div>

{#if isReady}
	<div class="container">
		<slot />
	</div>
{:else}
	<div class="container">
		<div class="d-flex justify-content-center">
			<div class="spinner-border spinner-border" role="status"></div>
		</div>
	</div>
{/if}

<div class="container my-4">
	<div class="border-bottom mb-4"></div>
	<footer class="d-block d-md-flex align-items-center justify-content-between">
	  <p class="text-center text-muted">Made with ♥️ and <a href="https://appwrite.io/"><svg width="24" height="24" class="mx-1 mb-2" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M299.384 100.21C299.384 155.211 254.798 199.799 199.795 199.799C174.248 199.799 150.949 190.177 133.319 174.365C161.561 161.65 181.222 133.262 181.222 100.282C181.222 67.259 161.512 38.842 133.211 26.151C150.856 10.281 174.196 0.622009 199.795 0.622009C254.798 0.622009 299.384 45.209 299.384 100.21Z" fill="#F02E65"></path><path d="M159.987 20.718C98.825 -25.503 10.561 11.816 1.114 87.895C-3.276 123.253 11.556 158.262 40.009 179.704C101.205 225.884 189.443 188.5 198.838 112.414C203.197 77.101 188.387 42.148 159.987 20.717V20.718ZM148.91 35.393C198.809 73.046 189.233 150.593 131.674 174.979C104.964 186.297 74.242 182.504 51.085 165.028C1.189 127.374 10.763 49.827 68.321 25.442C95.032 14.126 125.754 17.918 148.91 35.393Z" fill="#F02E65"></path><path d="M102.666 65.755C102.548 66.048 101.023 72.028 99.386 79.123C97.683 86.216 94.986 97.414 93.464 104.037C90.531 116.173 88.772 124.146 88.772 125.2C88.772 125.492 90.591 125.729 92.816 125.729H96.864L98.679 117.637C99.736 113.242 102.083 103.157 103.957 95.243C105.834 87.329 108.118 77.714 108.999 73.843C109.878 69.974 110.758 66.46 110.934 66.048C111.11 65.521 110.112 65.347 107.063 65.347C104.776 65.347 102.782 65.521 102.666 65.755ZM71.183 91.138L65.79 97.002L67.375 98.878C68.252 99.932 70.659 102.571 72.709 104.742L76.462 108.725H87.133L82.089 103.274C79.332 100.346 77.046 97.529 77.046 97.179C77.046 96.768 79.157 94.132 81.739 91.316C84.317 88.446 86.428 85.98 86.428 85.688C86.428 85.452 84.201 85.277 81.505 85.277H76.638L71.183 91.138ZM112.221 85.629C112.221 85.806 113.219 86.917 114.449 88.149C119.025 92.722 122.248 96.593 122.071 97.352C121.956 97.766 119.726 100.519 117.03 103.391L112.165 108.725H117.616L123.068 108.668L128.049 103.215C130.808 100.169 133.035 97.469 133.035 97.119C133.035 96.827 130.69 94.071 127.757 90.965L122.485 85.277H117.381C114.508 85.277 112.221 85.452 112.221 85.629Z" fill="#F02E65"></path></svg></a> by Matej Bačo</p>
	  <ul class="nav justify-content-center">
		<li class="nav-item"><a href="/about" class="nav-link px-2 text-dark">About</a></li>
		<li class="nav-item"><a href="/contact" class="nav-link px-2 text-dark">Contact</a></li>
	  </ul>
	</footer>
  </div>

{#if $loadingStore.state}
	<div style="left: 0; top: 0; bottom: 0; right: 0; background: rgba(0,0,0, 0.8);" class="position-fixed d-flex flex-column justify-content-center align-items-center">
		<div class="spinner-border text-light" role="status"></div>

		{#if $loadingStore.msg}
			<p class="text-light text-center col-sm-8 mt-3"> {$loadingStore.msg} </p>
		{/if}
	</div>
{/if}