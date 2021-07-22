<script type="ts">
	import { login, logout } from '../utils/auth';
	import account from '../stores/account';

	let loading = false;

	function handleLoginClick() {
		performLogin();
	}
	async function performLogin() {
		loading = true;
		$account = await login();
		loading = false;
	}

	function handleLogoutClick() {
		performLogout();
	}
	async function performLogout() {
		loading = true;
		await logout($account);
		$account = null;
		loading = false;
	}

</script>

{#if !($account)}
	<button disabled={loading} on:click={handleLoginClick}>Login</button>	
{:else}
	<button disabled={loading} on:click={handleLogoutClick}>Logout</button>
{/if}
