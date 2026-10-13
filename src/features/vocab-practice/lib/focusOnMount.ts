/* A stable callback ref: runs when its element mounts, not on every render. Each new card or
   question mounts afresh (keyed by id), so a keyboard learner lands on it straight away. */
export const focusOnMount = (node: HTMLElement | null): void => {
  node?.focus({ preventScroll: true });
};
