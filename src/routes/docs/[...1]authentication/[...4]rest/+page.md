---
title: REST API
---

# {$frontmatter.title}

If you are unable to use Firebase SDK, you can query the Firebase Auth backend through a REST API.

Throughout this document, **API_KEY** refers to the Web API Key.

```bash title="API_KEY"|copy
AIzaSyCY3eOftEgY1qjLoCnNFkZMubbGqKldcgQ
```

## Sign in existing user

### Creating a Redirect Link to Builtsearch Authentication

Create a link that redirects users to the Builtsearch Authentication sign-in page, follow these guidelines. Ensure the link includes the required query parameters:

- `response`: This parameter specifies the response type. The value must be set to "custom_token".
- `redirectURL`: A URL (string) specifying where the user should be redirected after authentication. see next section for more information.
- `appname`: A string representing the application name.
- `data` (optional): You can include additional data that you wish to receive back after the user is authenticated. This data will be sent back as a query parameter. Please ensure that the content within the data parameter is kept to a minimum and is properly encoded using encodeURIComponent.

**Redirect To**

```
https://auth.builtsearch.com/signin?response=custom_token&redirectURL=[REDIRECT_URL]&appname=[APP_NAME]
```

optionally if you wish to receive additional data back after the user is authenticated, you can include a `data` parameter. Please ensure that the content within the data parameter is kept to a minimum and is properly encoded using encodeURIComponent.

## Redirect Link

Redirection URL
The redirectURL parameter serves the purpose of redirecting users back to your application following authentication. This parameter is essential and should be a valid URL.

If your application is not a website (e.g. desktop app / mobile app) you can use a custom protocol URL (e.g. myapp://verifying) to redirect users back to your application. Please ensure that you have registered the custom protocol URL with your operating system.

## Decrypt Token

Once the user is authenticated, the user will be redirected to the redirectURL with a Encrypted Token query parameter. To decrypt use AES-256-CBC with your appSignature as the key and the token as the cipher text.

An additional HTTPS endpoint has been made available for your convenience, facilitating the decryption of the token. To utilize this endpoint, you are required to provide both the encrypted string and the corresponding decryption key. This ensures that the content is encrypted during the process.

```bash copy
curl -X POST -H "Content-Type: application/json" -d '{
  "encryptedToken": "YOUR_ENCRYPTED_TOKEN",
  "appSignature": "YOUR_APP_SIGNATURE"
}' https://auth.builtsearch.com/api/utils/decrypt-token
```

## Exchange custom token for Firebase ID token and refresh token

Once you have decrypted the token, you can exchange the custom token for a Firebase ID token and refresh token. To do so, send a POST request to the following endpoint:

```bash copy
curl -X POST -H "Content-Type: application/json" -d '{
    "token":"[CUSTOM_TOKEN]",
    "returnSecureToken":true,
}' https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyCY3eOftEgY1qjLoCnNFkZMubbGqKldcgQ
```

**Sample response**

```json
{
	"idToken": "[ID_TOKEN]",
	"refreshToken": "[REFRESH_TOKEN]",
	"expiresIn": "3600"
}
```

## Exchange a refresh token for an ID token

You can refresh a Firebase ID token by issuing an HTTP POST request to the this endpoint.

**Request**

```bash copy
curl -X POST \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data 'grant_type=refresh_token&refresh_token=[REFRESH_TOKEN]' \
'https://securetoken.googleapis.com/v1/token?key=[API_KEY]'
```

**Sample Response**

```json
{
	"expires_in": "3600",
	"token_type": "Bearer",
	"refresh_token": "[REFRESH_TOKEN]",
	"id_token": "[ID_TOKEN]",
	"user_id": "tRcfmLH7o2XrNELi...",
	"project_id": "1234567890"
}
```
