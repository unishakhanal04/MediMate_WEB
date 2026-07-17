// Centralized API client entry point. The actual implementation lives in
// api-client.ts (already used by every existing *.service.ts file) — this file
// re-exports it under the name new services should import from, without
// duplicating the auth-header/response-parsing logic a second time.
export * from "./api-client";
