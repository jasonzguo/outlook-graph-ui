import {
	PublicClientApplication,
	SilentRequest,
	AuthenticationResult,
	Configuration,
	LogLevel,
	AccountInfo,
	InteractionRequiredAuthError,
	RedirectRequest,
	PopupRequest,
	EndSessionRequest
} from '@azure/msal-browser';

const MSAL_CONFIG: Configuration = {
	auth: {
		clientId: process.env.CLIENT_ID
	},
	cache: {
		cacheLocation: 'sessionStorage',
		storeAuthStateInCookie: false
	},
	system: {
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii) {
					return;
				}
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
				}
			}
		}
	}
};

const maslInstance = new PublicClientApplication(MSAL_CONFIG);

export const loginRequest: SilentRequest = {
	scopes: []
};

export const graphTokenRequest: SilentRequest = {
	scopes: ["Mail.Read"]
};

export const apiTokenRequest: SilentRequest = {
	scopes: [`api://${process.env.CLIENT_ID}/Greet.Read`]
};

export async function login() {
	try {
		const resp = await maslInstance.loginPopup(loginRequest);
		return resp.account;
	} catch (error) {
		console.error(error);
	}
}

export async function logout(account: AccountInfo) {
	if (!account) return;
	return maslInstance.logoutPopup({ account });
}

export async function getTokenSilent(request: SilentRequest, account: AccountInfo) {
	try {
		const tokenResp = await maslInstance.acquireTokenSilent({ ...request, account });
		return tokenResp.accessToken;
	} catch (error) {
		if (error instanceof InteractionRequiredAuthError) {
	        const tokenResp = await getTokenPopup(request, account);
	        return tokenResp.accessToken;
	    }
		console.error(error);
	}
}

async function getTokenPopup(request: SilentRequest, account: AccountInfo) {
	try {
		return maslInstance.acquireTokenPopup({ ...request, account });
	} catch (error) {
		console.error(error);
	}
}