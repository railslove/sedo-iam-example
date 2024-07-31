sequenceDiagram
    participant Client as Blogs Frontend
    participant ResourceServer as Blogs API
    participant Keycloak

    Client->>ResourceServer: Request /api/blogs with access token
    ResourceServer->>Keycloak: Validate access token (userinfo endpoint)
    Keycloak->>Keycloak: Search session for access token
    alt Token is valid
        Keycloak-->>ResourceServer: Return user info (200)
        ResourceServer-->>Client: Return blog entries
    else Token is invalid
        Keycloak-->>ResourceServer: Return error (401)
        ResourceServer-->>Client: Return error
    end
