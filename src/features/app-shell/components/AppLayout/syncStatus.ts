/**
 * Whether the sync chip reports the app as offline — the header shows its own warning badge
 * then. Typed structurally so the shell needs nothing from account-sync beyond its barrel.
 */
export const isSyncOffline = (chip: { readonly text: string } | null): boolean =>
  chip?.text.includes('offline') ?? false;
