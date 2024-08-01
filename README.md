
# OAuth2-Proxy Integration with Keycloak and Web Application

An example of how to use OAuth2-Proxy and Keycloak to give authentication capability in any kind of web application.

## Requirements
* docker and docker-compose

## Usage
```shell
docker compose up
```

- Then open the dashboard page [http://kubernetes.docker.internal:4180/blogs/valid-access](http://kubernetes.docker.internal:4180/blogs/valid-access)
- You will be redirected to login page of keyloak. Login using the credentials mjane:password
- After the successful login you will see a list of 5 blog entries

## Authentication User
1. User enters the hostname.
2. Browser sends request to the server.
3. The OAuth2-Proxy determines the request is not authenticated yet. OAuth2-Proxy redirects the browser to `/auth` endpoint of Keycloak.
4. The browser sends a request to the `/auth` endpoint of Keycloak.
5. Keycloak serves the login screen.
6. User enters Username and Password and submits the form. 
7. The browser sends a request to the `/authenticate` endpoint of Keycloak.
8. Keycloak verifies the credentials of the user and generates an `Authorization code`.
9. Keycloak then redirects the browser to the `/callback` endpoint of OAuth2-Proxy with `Authorization code` as query parameter in the URL.
10. The browser sends a request to the `/callback` endpoint of the OAuth2-Proxy
11. OAuth2-Proxy invokes the `/token` endpoint of Keycloak including the `Authorization code`.
14. Keycloak validates the `Authorization code` and responds back with `access token`, `id token` and `refresh token`
15. OAuth2-Proxy persists the tokens
16. OAuth2-Proxy redirects the browser to the original url requested by the user. It instructs the browser to store a cookie with a specific key configured in OAuth2-Proxy
17. The browser sends a request to hostname, this time the request will contain the cookie header containing cookie that was sent by OAuth2-Proxy.
18. OAuth2-Proxy to verify if the request is authenticated properly
19. OAuth2-Proxy responds back with a HTTP 200 OK response that contains the access token in `X-Auth-Request-Access-Token` custom header
20. OAuth2-Proxy then forwards the request to upstream service with “X-Auth-Request-Access-Token” header in it.
21. The upstream service serves the request.

[![](https://mermaid.ink/img/pako:eNqVVMFu2zAM_RVC5xQFevShwIq2QNEBC1JkJ184iUmF2JJHyc28ov8-ynYa23HazgfDpt4j36MovSrtDalMBfpdk9N0a3HLWOYO5KmQo9W2QhdhHYhPozfs97MLP77V8flqyf5PAxj634v2_xT8SI0uPO5mqlYhMmH5RPxiNaVUN4XfBrhn7yI5k7uOlORdXF_3ejK4k1WGZx-iw5I6TL8osIG6DFbJeogQ_QQ_QA1Tr8hYJt0SLlEgIDoqb0Wu30y8HEse4qN6Y3pHOQCHJZN9AjFuHQTNRB-6TtHkAtAZWGIIe8_m63rISfsx0nldR-5PYrtpQCSZRMMiLGBLjjjxU_s8278YrXeQBu28w1FTNRbFL9S7Y2P3Vvp0Lt_n-3qacW6Hj7Ye3IvfEVxGebsvqhi4msgIlZeNaMltwjBXfMRZEgfbSj8Hn22cyJIJwQLWq-8LCBRFnt_Z_x7_TuuQ-4HWfgQGkyN9mWNNznIG9573yAa4V9BWRa0phM55P-Rj3um56PlTl-sWcmtDVWBzAJERX-nmiGqhSuISrZHr7zWRcyUW5PCrTD4NbbAuYq5y9yZQseefGqdVFrmmhaorIyPe35Yq28jkv0fvjI2e--DbP9zW5vM?type=png)](https://mermaid.live/edit#pako:eNqVVMFu2zAM_RVC5xQFevShwIq2QNEBC1JkJ184iUmF2JJHyc28ov8-ynYa23HazgfDpt4j36MovSrtDalMBfpdk9N0a3HLWOYO5KmQo9W2QhdhHYhPozfs97MLP77V8flqyf5PAxj634v2_xT8SI0uPO5mqlYhMmH5RPxiNaVUN4XfBrhn7yI5k7uOlORdXF_3ejK4k1WGZx-iw5I6TL8osIG6DFbJeogQ_QQ_QA1Tr8hYJt0SLlEgIDoqb0Wu30y8HEse4qN6Y3pHOQCHJZN9AjFuHQTNRB-6TtHkAtAZWGIIe8_m63rISfsx0nldR-5PYrtpQCSZRMMiLGBLjjjxU_s8278YrXeQBu28w1FTNRbFL9S7Y2P3Vvp0Lt_n-3qacW6Hj7Ye3IvfEVxGebsvqhi4msgIlZeNaMltwjBXfMRZEgfbSj8Hn22cyJIJwQLWq-8LCBRFnt_Z_x7_TuuQ-4HWfgQGkyN9mWNNznIG9573yAa4V9BWRa0phM55P-Rj3um56PlTl-sWcmtDVWBzAJERX-nmiGqhSuISrZHr7zWRcyUW5PCrTD4NbbAuYq5y9yZQseefGqdVFrmmhaorIyPe35Yq28jkv0fvjI2e--DbP9zW5vM)

## Verification Access Token
1. The client makes the request to the backend with the access token. NOTE in the oauth2-proxy the access token is stored in the `x-forwarded-access-token` custom Header.
2. The Backend ask keycloak the validate the Access token via the [`userinfo`](https://connect2id.com/products/server/docs/api/userinfo) endpoint.
3. Keycloak searches for a valid user session for the given access token.
4. **A user was found** and the OpenID claims will be returned. NOTE: The response is not important since our backend dis not care about the user information but only needs to know if the access token is valid or not.
5. Backend returns the requested data to the client.
6. **No user was found** and keycloak returns the HTTP status code 401
7. The Backend returns an error message to the client


[![](https://mermaid.ink/img/pako:eNqVkk1vwjAMhv-KlRNITLBppx6Q9ilNu0xj2qkXL3UhIk06x2FCiP--9IOhDi700srx-_h9U--U9gWpTAX6juQ0PRpcMla5g_TUyGK0qdEJPFhD6YUB7q1fBnhm74Rccdr5TsFH1rQg3hAfFXdvL6fNr7TV1uM6d91ZN-ZqPh9SskRNBoPAFGsz_WqBP0ZWgFpTCCB-TT1iqEyow4wMPtGaAoUGKhjFQGxc6SHlqb1xMu5IB-GAsSBkvYKQ9MY7KD2f8YBW4KOFmwCbZmpXH1DPppTIDhpD0Doa3cxm46P2X7ZE6C7sT9ncTIohbCh0MrKBjl6Mu9wNMaeQo9vZ9SVOWlVvoVkTNVEVcYWmSOu2aw5yJSuqKFdZ-iyoxGglV7nbp1aM4hdbp1UmHGmiYt38t347VVZiSnWoPhVGPPfF_S8wOfdz?type=png)](https://mermaid.live/edit#pako:eNqVkk1vwjAMhv-KlRNITLBppx6Q9ilNu0xj2qkXL3UhIk06x2FCiP--9IOhDi700srx-_h9U--U9gWpTAX6juQ0PRpcMla5g_TUyGK0qdEJPFhD6YUB7q1fBnhm74Rccdr5TsFH1rQg3hAfFXdvL6fNr7TV1uM6d91ZN-ZqPh9SskRNBoPAFGsz_WqBP0ZWgFpTCCB-TT1iqEyow4wMPtGaAoUGKhjFQGxc6SHlqb1xMu5IB-GAsSBkvYKQ9MY7KD2f8YBW4KOFmwCbZmpXH1DPppTIDhpD0Doa3cxm46P2X7ZE6C7sT9ncTIohbCh0MrKBjl6Mu9wNMaeQo9vZ9SVOWlVvoVkTNVEVcYWmSOu2aw5yJSuqKFdZ-iyoxGglV7nbp1aM4hdbp1UmHGmiYt38t347VVZiSnWoPhVGPPfF_S8wOfdz)

## Under the hood

### Keycloak
1. In keycloak we created a new realm named `example-realm`
2. In the `example-realm` create a user.
3. It is important that the user has a verified email adress
4. Set a password for the user
5. Create a new client. For details take a look at [the oauth2-proxy guide](https://oauth2-proxy.github.io/oauth2-proxy/configuration/providers/keycloak_oidc)

### Oauth2-proxy
1. Create a cookie secrect. `openssl rand -base64 32 | tr -- '+/' '-_'` and set the `OAUTH2_PROXY_COOKIE_SECRET` env
2. Add upstream service. 
3. Configurate Oauth Client from keycloak. `OAUTH2_PROXY_CLIENT_ID`, `OAUTH2_PROXY_CLIENT_SECRET`, `OAUTH2_PROXY_REDIRECT_URL` and `OAUTH2_PROXY_OIDC_ISSUER_URL`
4. Due to a bug we need to disable the OpenID connect auto discover. `OAUTH2_PROXY_SKIP_OIDC_DISCOVERY`, `OAUTH2_PROXY_LOGIN_URL`, `OAUTH2_PROXY_REDEEM_URL`, `OAUTH2_PROXY_OIDC_JWKS_URL`
5. Pass the access token to the upstream service via `OAUTH2_PROXY_PASS_AUTHORIZATION_HEADER` and `OAUTH2_PROXY_PASS_ACCESS_TOKEN`
6. The access token from keycloak is valid only for *5 minutes*. We can ask the oauth2-proxy to handle the refresh logic. Set the `OAUTH2_PROXY_COOKIE_REFRESH` variable to 4 minutes. This [ensures enough time](https://github.com/oauth2-proxy/oauth2-proxy/blob/master/docs/docs/configuration/sessions.md#redis-storage) to refresh the access token.
7. For the testing purose skip the email and cookie restrictions. `OAUTH2_PROXY_EMAIL_DOMAINS`, `OAUTH2_PROXY_COOKIE_SECURE`

### API Backend
1. Set the JWT token issuer of the access token in order to validate the acces token against keycloak. This must be the same issuer as for the oauth2-proxy.

### Frontent
The frontend must be able to access the header of the request in order to exctract the access token from the `x-forwarded-access-token` custom header