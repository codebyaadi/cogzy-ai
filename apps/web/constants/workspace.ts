export const WORKSPACE_ROLES = [
  {
    value: "admin",
    label: "Admin",
    description: "Full access to workspace settings",
  },
  {
    value: "editor",
    label: "Editor",
    description: "Can edit and create content",
  },
  { value: "viewer", label: "Viewer", description: "Read-only access" },
] as const;

export const SEARCH_CONFIG = {
  MIN_LENGTH: 3,
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 10,
} as const;
