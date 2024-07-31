sequenceDiagram
    participant User
    participant Browser
    participant OAuth2Proxy as OAuth2-Proxy
    participant Keycloak
    participant UpstreamService as Blogs Frontend

    User->>Browser: Enter hostname
    Browser->>OAuth2Proxy: Request to hostname
    OAuth2Proxy->>Browser: Redirect to /auth endpoint of Keycloak
    Browser->>Keycloak: Request to /auth endpoint
    Keycloak->>Browser: Serve login screen
    User->>Browser: Enter Username and Password
    Browser->>Keycloak: Request to /authenticate endpoint
    Keycloak->>Keycloak: Verify credentials, generate Authorization code
    Keycloak->>Browser: Redirect to /callback endpoint with Authorization code
    Browser->>OAuth2Proxy: Request to /callback endpoint
    OAuth2Proxy->>Keycloak: Invoke /token endpoint with Authorization code
    Keycloak->>OAuth2Proxy: Respond with tokens
    OAuth2Proxy->>OAuth2Proxy: Persist tokens
    OAuth2Proxy->>Browser: Redirect to original URL, set cookie
    Browser->>OAuth2Proxy: Request to hostname with cookie
    OAuth2Proxy->>OAuth2Proxy: Verify authentication
    OAuth2Proxy->>UpstreamService: Forward request with access token
    UpstreamService->>Browser: Serve request
    Browser->>User: Display requested content
