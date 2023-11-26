---
title: Web
---

# {$frontmatter.title}

## Add and initialize the Firebase SDK

1. If you haven't already, install the Firebase JS SDK and initialize Firebase.
2. Add the Firebase Authentication JS SDK and initialize Firebase Authentication:

```bash
npm install firebase
```

```js copy title="firebase.js"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	// ...
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
```

## Sign in existing user

### Creating a Redirect Link to Builtsearch Authentication

Create a link that redirects users to the Builtsearch Authentication sign-in page, follow these guidelines. Ensure the link includes the required query parameters:

- `response`: This parameter specifies the response type. The value must be set to "custom_token".
- `redirectURL`: A URL (string) specifying where the user should be redirected after authentication. see next section for more information.
- `appname`: A string representing the application name.
- `data` (optional): You can include additional data that you wish to receive back after the user is authenticated. This data will be sent back as a query parameter. Please ensure that the content within the data parameter is kept to a minimum and is properly encoded using encodeURIComponent.

**example:**

```
https://auth.builtsearch.com/signin?response=custom_token&redirectURL=https://myapp.com/verifying&appname=myapp&data=%7B"originalPath"%3A"%2F"%7D
```

```js title="helper.js function to create url with query params"
const paramsObject = {
	response: "custom_token",
	appname: "myapp",
	redirectURL: "https://myapp.com/verifying",
	data: {
		originalPath: "/",
		foo: ["bar", "baz"]
	}
};

function addQueryParamsToUrl(url, paramsObject) {
	if (!paramsObject) {
		return url;
	}
	const queryParams = Object.entries(paramsObject)
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join("&");

	if (url.includes("?")) {
		return `${url}&${queryParams}`;
	} else {
		return `${url}?${queryParams}`;
	}
}

const url = addQueryParamsToUrl("https://auth.builtsearch.com/signin", paramsObject);
//url: https://auth.builtsearch.com/signin?appname=myapp&redirectURL=https%3A%2F%2Fmyapp.com%2Fverifying&data=%5Bobject%20Object%5D'
```

### Sign up

The current sign-up functionality is experiencing issues.

As an alternative, you can direct users to the sign-in page, where they will find a link to the sign-up page. Upon completing the sign-up process, users will be redirected back to the specified redirectURL, similar to the sign-in process.

## Redirect Link

Redirection URL
The redirectURL parameter serves the purpose of redirecting users back to your application following authentication. This parameter is essential and should be a valid URL.

It is advisable to ensure that your redirectURL possesses server-side rendering capabilities. This is necessary because the redirectURL will receive an encrypted custom token within its query parameters, which is utilized for user authentication. In cases where you are employing a client-side framework, it becomes necessary to implement a server-side rendering solution to effectively manage the custom token.

## Decrypt Token

To complete the authentication process, you'll need to decrypt this token using the AES-256-CBC encryption algorithm, with your appSignature serving as the decryption key. Your appSignature is a confidential key that has been registered with Builtsearch.

Please ensure that your application is equipped to handle this decryption step, as your appSignature plays a crucial role in securely processing the received token.

An additional HTTPS endpoint has been made available for your convenience, facilitating the decryption of the token. To utilize this endpoint, you are required to provide both the encrypted string and the corresponding decryption key. This ensures that the content is encrypted during the process.

```js title="server.js"
// APP_SIGNATURE is your secret string that is used to decrypt the custom token
const APP_SIGNATURE = "xxxxxxxxxxxxx";
const encryptedToken = url.searchParams.get("encryptedToken");
const resp = await fetch(`https://auth.builtsearch.com/api/utils/decrypt-token`, {
	method: "POST",
	headers: {
		"content-type": "application/json"
	},
	body: JSON.stringify({ encryptedToken, appSignature: APP_SIGNATURE })
});
const token = await resp.text();

// signInWithCustomToken using this token
```

## Sign in with Custom Token

Once you have successfully decrypted the token, you can initiate the user's sign-in process using the Firebase `signInWithCustomToken` function. To manage user session persistence effectively, please consult the Firebase documentation for guidance on configuring sign-in persistency.

If you are using the Firebase SDK with local browser persistency, the user's session will remain active indefinitely. Firebase achieves this by utilizing refresh tokens to refresh the user's session automatically.

```js
import {
	getAuth,
	signInWithEmailAndPassword,
	setPersistence,
	browserLocalPersistence
} from "firebase/auth";

const auth = getAuth();

try {
	setPersistence(auth, browserSessionPersistence);
	const userCredential = await signInWithCustomToken(auth, customToken);
	const user = userCredential.user;
	console.log(user.uid);
} catch (error) {
	console.log(error.code, error.message);
}
```

## Set an authentication state observer and get user data

Attach the observer using the onAuthStateChanged method. When a user successfully signs in, you can get information about the user in the observer.

```js
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
	if (user) {
		const uid = user.uid;
		// this will trigger after signInWithCustomToken
		// user is signed in
	} else {
		// User is not signed in
	}
});
```
