import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { trainerDescriptors } from '../scripts/trainerRegistry.mjs';

/*
 * axe-core over every screen of every trainer, in both themes, on the desktop and the phone
 * project: zero `serious` or `critical` WCAG 2.2 AA violations. `moderate` and `minor` ones are
 * printed, not failed, so they show up in the run without blocking it.
 *
 * Reduced motion is emulated so the colour-contrast rule never measures a card halfway through
 * its fade-in — an animation frame is not the palette. The emulation is asserted, as the
 * reduced-motion spec learned to.
 */

const TRAINERS = trainerDescriptors();
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];
const THEMES = ['light', 'dark'];
const BLOCKING = new Set(['serious', 'critical']);

const isoInDays = days => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/* An exam date and three scored A2·B1 sittings, so the dashboard has a plan and the root
   trainer's history renders its chart and data table rather than the empty state. */
const seed = page =>
  page.addInitScript(iso => {
    if (window.localStorage.getItem('telcTrainerV1')) return;
    const attempt = (id, total, result) => ({
      id,
      examId: id,
      mode: 'full',
      date: new Date(id).toISOString(),
      times: {},
      scores: { lesen: 45, hoeren: 40, schreiben: 42, sprechen: 41 },
      sb: null,
      answers: {},
      ratings: {},
      total,
      result
    });
    window.localStorage.setItem(
      'telcTrainerV1',
      JSON.stringify({
        attempts: [attempt(1, 172, 'B1'), attempt(2, 120, 'A2'), attempt(3, 60, 'nicht bestanden')],
        learnDone: {},
        settings: { examDate: iso }
      })
    );
  }, isoInDays(30));

const settle = async page => {
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  await page.waitForLoadState('networkidle');
};

const describe = violation =>
  `${violation.impact} ${violation.id}: ${violation.help}\n${violation.nodes
    .slice(0, 5)
    .map(node => `    ${node.target.join(' ')} — ${node.failureSummary?.split('\n')[1]?.trim() ?? ''}`)
    .join('\n')}`;

/** Runs axe on what is on screen now; fails softly so both themes always run. */
const audit = async (page, label) => {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const blocking = violations.filter(violation => BLOCKING.has(violation.impact ?? ''));
  const advisory = violations.filter(violation => !BLOCKING.has(violation.impact ?? ''));
  for (const violation of advisory) console.log(`[a11y advisory] ${label} — ${describe(violation)}`);
  expect.soft(blocking.map(describe), `${label}: serious/critical axe violations`).toEqual([]);
};

const setTheme = async (page, theme) => {
  await page.evaluate(value => localStorage.setItem('telcTrainerTheme', value), theme);
  await page.reload();
  await settle(page);
  /* A retrying locator assertion rather than a one-shot `evaluate`, which throws "Execution
     context was destroyed" if the page is still navigating when it runs. */
  const html = page.locator('html');
  if (theme === 'dark') await expect(html, 'the dark theme did not apply').toHaveClass(/\bdark\b/);
  else await expect(html, 'the light theme did not apply').not.toHaveClass(/\bdark\b/);
};

/** Audits the current URL in both themes; `prepare` re-creates any open state after a reload. */
const auditBothThemes = async (page, label, prepare = async () => undefined) => {
  for (const theme of THEMES) {
    await setTheme(page, theme);
    await prepare();
    await audit(page, `${label} (${theme})`);
  }
};

test.beforeEach(async ({ page }, info) => {
  /* Each test audits several screens twice over; that outlasts the 30s default. */
  test.setTimeout(180_000);
  test.skip(
    info.project.name !== 'chromium' && info.project.name !== 'mobile',
    'phone and desktop widths are the a11y gate; tablets are covered by layout specs'
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seed(page);
});

const reducedMotionIsOn = page => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

test('settings and the 404 page', async ({ page }) => {
  await page.goto('/settings');
  await settle(page);
  expect(await reducedMotionIsOn(page), 'reduced motion is not actually emulated').toBe(true);
  await auditBothThemes(page, '/settings');

  await page.goto('/no-such-page');
  await settle(page);
  await auditBothThemes(page, '404');
});

for (const trainer of TRAINERS) {
  const base = trainer.basePath;

  test.describe(`${trainer.short} trainer`, () => {
    test('dashboard, guide and history', async ({ page }) => {
      for (const path of [base || '/', `${base}/guide`, `${base}/history`]) {
        await page.goto(path);
        await settle(page);
        await auditBothThemes(page, path);
      }
    });

    test('learn, with a cheatsheet open', async ({ page }) => {
      await page.goto(`${base}/learn`);
      await settle(page);
      await auditBothThemes(page, `${base}/learn`);

      /* Desktop: the panel beside the plan lists the sheets. Phone: a button opens them in a
         modal sheet. Either way the first sheet is opened and its content must be on screen. */
      const openSheet = async () => {
        const phoneButton = page.getByRole('button', { name: /^Cheatsheets \(\d+\)$/ });
        const container = (await phoneButton.isVisible())
          ? page.getByRole('dialog')
          : page.locator('aside[aria-label="Cheatsheets"]');
        if (await phoneButton.isVisible()) await phoneButton.click();
        await container.locator('li button').first().click();
        await expect(container.locator('.prose')).toBeVisible();
        await settle(page);
      };
      await auditBothThemes(page, `${base}/learn + cheatsheet`, openSheet);
    });

    test('practice: hub, a flashcard and a quiz question', async ({ page }) => {
      await page.goto(`${base}/practice`);
      await settle(page);
      await auditBothThemes(page, `${base}/practice`);

      const flashcards = page.getByRole('button', { name: /Flashcards/ }).first();
      if ((await flashcards.count()) === 0) return; // an empty bank has no sessions to open
      const startFlashcards = async () => {
        await flashcards.click();
        await expect(page.locator('button[aria-describedby="flashcard-hint"]')).toBeVisible();
      };
      await auditBothThemes(page, `${base}/practice flashcard`, startFlashcards);

      const startQuiz = async () => {
        await page.getByRole('button', { name: /Quiz/ }).first().click();
        await expect(page.getByText(/^1\/\d+$/)).toBeVisible();
      };
      await auditBothThemes(page, `${base}/practice quiz`, startQuiz);
    });
  });
}

/* One paper of each format: briefing, the open module, the submit dialog, results and review.
   The attempt is created through the app — a Lesen practice submitted with blanks — so the
   results and review screens show a real attempt of that paper's own shape. */
const FORMATS = ['dual-level', 'single-level', 'dtz-paper'].map(format => {
  const trainer = TRAINERS.find(candidate => candidate.format === format);
  if (!trainer) throw new Error(`the registry has no ${format} trainer`);
  return trainer;
});

for (const trainer of FORMATS) {
  test(`${trainer.short} exam: briefing, runner, results and review`, async ({ page }) => {
    const base = trainer.basePath;
    await page.goto(`${base}/exam/1/lesen`);
    await settle(page);
    await auditBothThemes(page, `${trainer.short} briefing`);

    await page.getByRole('button', { name: /^Start Lesen/ }).click();
    await expect(page.getByRole('timer')).toBeVisible();
    await auditBothThemes(page, `${trainer.short} Lesen runner`);

    await page.getByRole('button', { name: /^Submit Lesen/ }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await audit(page, `${trainer.short} submit dialog`);
    await page.getByRole('button', { name: /Submit anyway/ }).click();

    await expect(page).toHaveURL(/\/results\/\d+$/);
    await settle(page);
    await auditBothThemes(page, `${trainer.short} results`);

    await page.getByRole('link', { name: /Review answers/ }).click();
    await expect(page).toHaveURL(/\/review\/\d+$/);
    await settle(page);
    await auditBothThemes(page, `${trainer.short} review`);
  });
}
