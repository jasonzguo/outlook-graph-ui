<script type="ts">
	import wretch from 'wretch';
	import {
		getTokenSilent, graphTokenRequest
	} from '../utils/auth';
	import account from '../stores/account';

	let payload = null;
	let loading = false;

	function handleClick() {
		getProfile();
	}

	async function getProfile() {
		loading = true;

		const token = await getTokenSilent(graphTokenRequest, $account);
		if (!token) {
			loading = false;
			return;
		}

		try {
			const url = 'https://graph.microsoft.com/v1.0/me';
			const resp = await wretch(url).auth(`Bearer ${ token }`).get().json();
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
			View Profile
		</button>
	{/if}

	{#if $account && payload}
		<div>{payload.displayName}</div>
	{/if}
</div>