import {
	writable
} from 'svelte/store';

import type {
	AccountInfo
} from '@azure/msal-browser';

const account = writable<AccountInfo>(null);

export default account;