import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

/*
 * On iPhones the bottom tab bar sat flush on the home indicator and was hard to tap. The bar
 * already padded itself with `env(safe-area-inset-bottom)`, but iOS reports every safe-area
 * inset as 0 unless the viewport opts in with `viewport-fit=cover` — so the padding was 0.
 * A `max()` floor also keeps the tabs off the very edge where the inset really is 0.
 *
 * Plain JS reading the sources: the bug is a missing token in markup and class strings, which
 * happy-dom cannot evaluate (it has no safe-area insets) and Chromium e2e cannot reproduce.
 */

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

describe('iOS safe-area insets', () => {
  it('opts the viewport in, so env(safe-area-inset-*) is not always 0 on iOS', () => {
    const viewport = /<meta\s+name="viewport"\s+content="([^"]*)"/.exec(read('index.html'));
    expect(viewport?.[1]).toContain('viewport-fit=cover');
  });

  it.each([
    'src/features/app-shell/components/BottomTabBar/BottomTabBar.tsx',
    'src/shared/components/exam-ui/ExamModuleToolbar/ExamModuleToolbar.tsx',
    'src/features/app-shell/components/AppLayout/AppLayout.tsx'
  ])('%s keeps a floor under the bottom inset', path => {
    expect(read(path)).toMatch(/max\([^)]*env\(safe-area-inset-bottom\)/);
  });
});
