# Backend API Integration - notes_database

This Qwik frontend is designed to communicate with a backend REST API service, namely `notes_database`, for persistent storage and data operations. All note CRUD, authentication, and tag management calls assume the backend is available at `/api`.

## Expected Endpoints

- `GET    /api/auth/me` — gets current user info (if logged in, else 401)
- `GET    /api/notes` — list all user's notes
- `POST   /api/notes` — create a new note (`{title, body, tags?}`)
- `PUT    /api/notes/:id` — update note
- `DELETE /api/notes/:id` — delete note
- `POST   /api/auth/login` — initiates login/OAuth/cookie session
- `POST   /api/auth/logout` — logs out the current user

## Environment

No .env required for client, but to support OAuth redirect flows, the backend should set appropriate session cookies and honor CORS for frontend-to-backend calls. Endpoints must be proxyable on the same domain or via a proxy under `/api` for seamless XHR.

## Integration Steps

1. Ensure frontend API calls are routed to `/api/...`, which proxies or hosts the `notes_database` backend.
2. On deployment, configure API gateway/proxy so the frontend’s `/api` path hits the backend.

This document should be updated if backend endpoints, domains, or authentication behavior changes.
