<script type="ts">
	import wretch from 'wretch';
	import {
		getTokenSilent, apiTokenRequest
	} from '../utils/auth';
	import account from '../stores/account';

	let payload = null;
	let loading = false;

	function handleClick() {
		getGreet();
	}

	async function getGreet() {
		loading = true;

		const token = await getTokenSilent(apiTokenRequest, $account);
		if (!token) {
			loading = false;
			return;
		}

		try {
			const url = 'http://localhost:8080';
			const resp = await wretch(url).auth(`Bearer ${ token }`).get().text();
			payload = resp;
			loading = false;
		} catch(error) {
			console.error(error);
			loading = false;
		}
	}

	// reactive statements
	$: if (!$account) payload = null;
</script>

<div>
	{#if $account}
		<button disabled={loading} on:click={handleClick}>
			View Greet
		</button>
	{/if}

	{#if $account && payload}
		<div>{payload}</div>
	{/if}
</div>