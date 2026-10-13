import { expect, test } from '@playwright/test';

/* Pass 5B, in a real browser: the Learn tab's cheatsheets open in place and lead back to the
   day, a task's "Go to …" link lands on the module it names, and a flashcard flips from the
   keyboard. Every project runs it: a phone gets the modal sheet, a desktop the side panel. */

const isoInDays = days => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/* Day 1 done, so Day 2 (Lesen, ads & matching) is today's lesson and first on the page. */
const seed = page =>
  page.addInitScript(iso => {
    window.localStorage.setItem(
      'telcTrainerV1',
      JSON.stringify({
        attempts: [],
        learnDone: { d1t0: true, d1t1: true, d1t2: true },
        settings: { examDate: iso }
      })
    );
  }, isoInDays(30));

test.beforeEach(async ({ page }) => {
  await seed(page);
});

test('a cheatsheet opens from its day card and leads back to that day', async ({ page }) => {
  await page.goto('/learn');
  const day = page.locator('#learn-day-2');
  await expect(day).toBeVisible();

  await page.getByRole('button', { name: /Open Theme vocabulary/ }).click();
  const sheetHeading = page.getByRole('heading', { name: /^Theme vocabulary/ });
  await expect(sheetHeading).toBeVisible();
  await expect(page.getByText('Familie & Alltag:')).toBeVisible();

  await page.getByRole('button', { name: 'Back to Day 2' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(day).toBeFocused();
  await expect(day).toBeInViewport();
});

test('a task link lands on the module it names', async ({ page }) => {
  await page.goto('/learn');
  await page.getByRole('link', { name: /Go to Lesen Teil 1 · Mock exam 3/ }).click();
  await expect(page).toHaveURL(/\/exam\/3\/lesen$/);
  await expect(page.locator('main')).toContainText(/Lesen|Leseverstehen/);
});

test('a flashcard flips with Space and Enter', async ({ page }) => {
  await page.goto('/dtz/practice');
  await page
    .getByRole('button', { name: /Flashcards/ })
    .first()
    .click();
  const card = page.locator('button[aria-describedby="flashcard-hint"]');
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  /* A new card takes focus, so the keyboard can flip it straight away. */
  await expect(card).toBeFocused();

  await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Knew it/ })).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'false');
});
