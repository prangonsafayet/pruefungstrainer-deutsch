import { expect, test } from '@playwright/test';

import { trainerDescriptors } from '../scripts/trainerRegistry.mjs';

/*
 * No mouse at all: from the dashboard to a Lesen module, every item of one Teil answered,
 * submitted through the confirm dialog, results reached — for one paper of each format. Then a
 * flashcard flipped and graded, and a quiz question answered. Every step is Tab, Shift+Tab,
 * arrows, Space or Enter; nothing is clicked, and focus is checked where it has to land.
 *
 * Desktop only: the phone and tablet projects are touch devices with no Tab key to test.
 */

const TRAINERS = trainerDescriptors();
const byFormat = format => {
  const trainer = TRAINERS.find(candidate => candidate.format === format);
  if (!trainer) throw new Error(`the registry has no ${format} trainer`);
  return trainer;
};

const MAX_TABS = 400;

/** Presses Tab (or Shift+Tab) until `target` has focus; fails if it never does. */
const tabTo = async (page, target, { back = false } = {}) => {
  for (let presses = 0; presses < MAX_TABS; presses += 1) {
    /* No catch: a locator matching two elements must fail loudly, not read as "not yet". */
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press(back ? 'Shift+Tab' : 'Tab');
  }
  throw new Error(`Tab never reached ${String(target)}`);
};

/** Opens a focused Radix select with Space and picks the option matching `name` by arrowing to it. */
const pickWithKeys = async (page, name) => {
  await page.keyboard.press('Space');
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  const highlighted = listbox.locator('[role="option"][data-highlighted]');
  for (let presses = 0; presses < 20; presses += 1) {
    const text = (await highlighted.textContent()) ?? '';
    if (name.test(text)) break;
    await page.keyboard.press('ArrowDown');
    /* Radix moves the highlight on a timer after the keydown. Read it again only once it has
       moved: a stale read sends one arrow too many and picks the option after (issue #35). */
    await expect(highlighted).not.toHaveText(text);
  }
  await page.keyboard.press('Enter');
  await expect(listbox).toBeHidden();
};

/** Dashboard → "Practice one module of Modelltest 1" → Lesen → briefing → the open module. */
const openLesenByKeyboard = async (page, base) => {
  await page.goto(base || '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await tabTo(page, page.getByRole('combobox', { name: 'Practice one module of Modelltest 1', exact: true }));
  await pickWithKeys(page, /^Les/);
  await expect(page).toHaveURL(/\/exam\/1\/lesen$/);

  const start = page.getByRole('button', { name: /^Start Lesen/ });
  await tabTo(page, start);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('timer')).toBeVisible();
  /* The pressed button is gone; focus moved to the module's heading, not to the body. */
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
};

/** Shift+Tab back to the toolbar's Submit, confirm inside the trapped dialog, land on results. */
const submitByKeyboard = async page => {
  await tabTo(page, page.getByRole('button', { name: /^Submit Lesen/ }), { back: true });
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  /* Focus is trapped: however far Tab goes, it stays inside the dialog. */
  for (let presses = 0; presses < 5; presses += 1) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await tabTo(page, dialog.getByRole('button', { name: /^Submit (anyway|now)$/ }));
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/results\/\d+$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Results');
};

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'keyboard-only is a desktop gate; touch projects have no Tab');
  /* Nothing waits on an entrance animation between key presses. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('A2·B1: Lesen Teil 1 matched with the letter selects, submitted, scored', async ({ page }) => {
  const { basePath } = byFormat('dual-level');
  await openLesenByKeyboard(page, basePath);

  for (let item = 1; item <= 5; item += 1) {
    const select = page.getByRole('combobox', { name: `Anzeige für Situation ${String(item)}`, exact: true });
    await tabTo(page, select);
    await pickWithKeys(page, /^[a-l]$/);
    await expect(select).not.toHaveText('–');
  }
  await expect(page.getByText(/^5 of \d+ answered$/)).toBeVisible();

  await submitByKeyboard(page);
});

test('B1: Lesen Teil 1 headlines matched, submitted, scored', async ({ page }) => {
  const { basePath } = byFormat('single-level');
  await openLesenByKeyboard(page, basePath);

  for (let item = 1; item <= 5; item += 1) {
    const select = page.getByRole('combobox', { name: `Überschrift für Text ${String(item)}`, exact: true });
    await tabTo(page, select);
    await pickWithKeys(page, /^[a-l]$/);
    await expect(select).not.toHaveText('–');
  }
  await expect(page.getByText(/^5 of \d+ answered$/)).toBeVisible();

  await submitByKeyboard(page);
});

test('DTZ: Lesen Teil 1 answered with arrow keys in each radio group, submitted, scored', async ({
  page
}) => {
  const { basePath } = byFormat('dtz-paper');
  await openLesenByKeyboard(page, basePath);

  const groups = page.locator('section').filter({ hasText: 'Teil 1 — Verzeichnis' }).getByRole('radiogroup');
  await expect(groups).toHaveCount(5);

  for (let item = 0; item < 5; item += 1) {
    const group = groups.nth(item);
    /* Tab enters the group on its first option; an arrow moves AND selects within it. */
    await tabTo(page, group.getByRole('radio').first());
    /* Held, as a finger holds it: Radix moves roving focus on the next tick and selects on that
       focus only while the arrow is still down, so an instant press-and-release (keyup before
       the tick) would move nothing. */
    await page.keyboard.down('ArrowDown');
    await expect(group.getByRole('radio').nth(1)).toBeFocused();
    await page.keyboard.up('ArrowDown');
    await expect(group.getByRole('radio').nth(1)).toBeChecked();
    await expect(group.getByRole('radio').nth(1)).toBeFocused();
  }
  await expect(page.getByText(/^5 of \d+ answered$/)).toBeVisible();

  await submitByKeyboard(page);
});

test('a flashcard flips and grades, and a quiz question is answered, by keyboard', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await tabTo(page, page.getByRole('button', { name: /Flashcards/ }).first());
  await page.keyboard.press('Enter');
  const card = page.locator('button[aria-describedby="flashcard-hint"]');
  await expect(card).toBeFocused();
  await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await tabTo(page, page.getByRole('button', { name: /Knew it/ }));
  await page.keyboard.press('Enter');
  await expect(page.getByText(/^2\/\d+$/)).toBeVisible();

  await tabTo(page, page.getByRole('button', { name: /End session/ }), { back: true });
  await page.keyboard.press('Enter');

  await tabTo(page, page.getByRole('button', { name: /Quiz/ }).first());
  await page.keyboard.press('Enter');
  await expect(page.getByText(/^1\/\d+$/)).toBeVisible();
  await tabTo(page, page.getByRole('button', { name: /^a\)/ }));
  await page.keyboard.press('Enter');
  /* The verdict is said in words and takes focus. */
  await expect(page.locator(':focus')).toContainText(/Richtig — well done\.|Not quite — the answer is/);
  await tabTo(page, page.getByRole('button', { name: /^Next/ }));
  await page.keyboard.press('Enter');
  await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
});
