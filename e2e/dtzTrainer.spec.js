import { readFileSync } from 'node:fs';
import vm from 'node:vm';

import { expect, test } from '@playwright/test';

import { trainerDescriptors } from '../scripts/trainerRegistry.mjs';

/*
 * The DTZ trainer end to end, in a real browser: its dashboard and routes, a practice run of
 * every module type, a full sitting that ends on a certificate, a mid-module reload, its own
 * history and settings, and the module it does not have.
 *
 * e2e specs are plain JS with no bundler, so the registry is read through
 * `scripts/trainerRegistry.mjs` and the answer key of Modelltest 1 is read straight from its
 * content file — the same text parse `validate.cjs` does — rather than hardcoded here, where it
 * would drift the day the paper is edited.
 */

const DTZ = trainerDescriptors().find(trainer => trainer.format === 'dtz-paper');
if (!DTZ) throw new Error('the registry has no DTZ trainer');
const BASE = DTZ.basePath;
const B1 = trainerDescriptors().find(trainer => trainer.format === 'single-level');
const ROOT = trainerDescriptors().find(trainer => trainer.basePath === '');
if (!B1 || !ROOT) throw new Error('this spec needs the root and a single-level trainer');

const LETTERS = 'abcdefghijkl';
const NO_MATCH = -1;
const RUN_KEY = 'telcTrainerDtzRunV1';
const PROGRESS_KEY = 'telcTrainerV1';

/** One DTZ Modelltest, evaluated from its authored file. */
const loadExam = id => {
  const file = new URL(`../src/content/dtz/exams/exam${String(id).padStart(2, '0')}.ts`, import.meta.url);
  const source = readFileSync(file, 'utf8')
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/^\s*const exam =\s*/m, '')
    .replace(/\bas const satisfies DtzExam;?/, '')
    .replace(/export default exam;?\s*$/m, '')
    .trim()
    .replace(/;\s*$/, '');
  return vm.runInNewContext(`(${source})`);
};
const EXAM = loadExam(1);

/* Speech is stubbed: headless Chromium ships no German voice, and the spec must know a clip
   was asked for without waiting for it to be read out. The stub offers one German voice, so
   the app takes its real playback path, and ends every utterance almost at once. The
   utterance class is replaced too: Chromium refuses a voice it did not create. */
const stubSpeech = page =>
  page.addInitScript(() => {
    const spoken = [];
    window.__spoken = spoken;
    const voice = {
      name: 'Stub Deutsch',
      lang: 'de-DE',
      voiceURI: 'stub-de',
      localService: true,
      default: true
    };
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
    const fake = {
      speaking: false,
      pending: false,
      paused: false,
      onvoiceschanged: null,
      getVoices: () => [voice],
      speak: utterance => {
        spoken.push(utterance.text);
        setTimeout(() => utterance.onend?.(new Event('end')), 20);
      },
      cancel: () => undefined,
      pause: () => undefined,
      resume: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined
    };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  });

const collectConsoleErrors = page => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
};

/** Ids carry dots (`l1.0-2`), so they are matched as attributes rather than as `#id`. */
const byId = (page, id) => page.locator(`[id="${id}"]`);

/**
 * Picks an option of a Radix select named `label`, waiting on the select's own state rather than
 * on time: the previous select's listbox has finished closing, this one is open and the option is
 * in it, and afterwards the listbox is gone and the trigger is collapsed again. Under load the
 * closing listbox of the previous pick used to be on screen when the next option was looked up.
 */
const choose = async (page, label, option) => {
  const listbox = page.getByRole('listbox');
  await expect(listbox).toHaveCount(0);
  const trigger = page.getByRole('combobox', { name: label, exact: true });
  await trigger.click();
  /* Open, Radix hides everything else — the trigger too — from the accessibility tree. */
  await expect(listbox).toBeVisible();
  const item = listbox.getByRole('option', { name: option });
  await expect(item).toBeVisible();
  await item.click();
  await expect(listbox).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
};

const letterOption = index => (index === NO_MATCH ? 'X' : new RegExp(`^${LETTERS[index]}$`));

/** Every Lesen item answered as the key expects. Teil 2's X goes through the select's X. */
const answerLesen = async page => {
  const { teil1, teil2, teil3, teil4, teil5 } = EXAM.lesen;
  for (const [i, question] of teil1.questions.entries())
    await byId(page, `l1.${i}-${question.answer}`).click();
  for (const [i, answer] of teil2.answers.entries())
    await choose(page, `Anzeige für Aufgabe ${26 + i}`, letterOption(answer));
  for (const [i, text] of teil3.texts.entries()) {
    await byId(page, `l3.${i}-${String(text.statement.answer)}`).click();
    await byId(page, `l3m.${i}-${text.question.answer}`).click();
  }
  for (const [i, statement] of teil4.statements.entries())
    await byId(page, `l4.${i}-${String(statement.answer)}`).click();
  for (const [i, gap] of teil5.gaps.entries())
    await choose(page, `Lücke ${i + 1}`, new RegExp(`^${LETTERS[gap.answer]}\\)`));
};

/** Every Hören item answered as the key expects. */
const answerHoeren = async page => {
  const { teil1, teil2, teil3, teil4 } = EXAM.hoeren;
  for (const [i, item] of teil1.items.entries()) await byId(page, `h1.${i}-${item.answer}`).click();
  for (const [i, item] of teil2.items.entries()) await byId(page, `h2.${i}-${item.answer}`).click();
  for (const [i, gespraech] of teil3.gespraeche.entries()) {
    await byId(page, `h3.${i}-${String(gespraech.statement.answer)}`).click();
    await byId(page, `h3m.${i}-${gespraech.question.answer}`).click();
  }
  for (const [i, aussage] of teil4.aussagen.entries())
    await choose(page, `Aufgabe ${18 + i}`, letterOption(aussage.answer));
};

/** Moves every self-rating slider to the top of its band. */
const rateAllTop = async page => {
  const sliders = page.getByRole('slider');
  const count = await sliders.count();
  for (let i = 0; i < count; i += 1) {
    await sliders.nth(i).focus();
    await sliders.nth(i).press('End');
  }
  return count;
};

const submit = async (page, module) => {
  await page.getByRole('button', { name: new RegExp(`^Submit ${module}`) }).click();
  /* Submitting always asks: "Submit anyway" past blanks, "Submit now" when all is answered. */
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: /^Submit (anyway|now)$/ })
    .click();
};

const dashboardHeading = page => page.getByRole('heading', { name: /^Dashboard/, level: 1 });

/* Follows a main-nav tab on any band: phones keep the reference tabs (Exam Guide, Settings)
   behind the tab bar's "More" menu. */
const followNav = async (page, name) => {
  const nav = page.getByRole('navigation', { name: 'Main' });
  const link = nav.getByRole('link', { name });
  if (await link.isVisible()) {
    await link.click();
    return;
  }
  await nav.getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name }).click();
  /* Radix hides the rest of the page from the accessibility tree until the menu has gone. */
  await expect(page.getByRole('menu')).toBeHidden();
};

test.beforeEach(async ({ page }) => {
  await stubSpeech(page);
});

test.describe('the DTZ dashboard and its routes', () => {
  test('lists 10 Modelltests under the DTZ name, and every nav route loads cleanly', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(BASE);
    await expect(dashboardHeading(page)).toBeVisible();
    await expect(dashboardHeading(page)).toContainText(DTZ.short);
    /* The full name sits in the header subtitle, which a phone hides: present, not visible. */
    await expect(page.getByText(DTZ.name).first()).toBeAttached();
    await expect(page.getByRole('combobox', { name: /^Practice one module of Modelltest \d+$/ })).toHaveCount(
      10
    );

    for (const [link, path, heading] of [
      ['Learn', `${BASE}/learn`, /AI-assisted learning/],
      ['Exam Guide', `${BASE}/guide`, /DTZ|Zuwanderer/],
      ['Practice', `${BASE}/practice`, /Reference tables/],
      ['History', `${BASE}/history`, /History/],
      ['Settings', '/settings', /Settings/]
    ]) {
      await followNav(page, link);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator('main')).toContainText(heading);
    }

    expect(errors, 'console/page errors on the DTZ routes').toEqual([]);
  });

  test('has no Sprachbausteine module: its route goes back to the dashboard', async ({ page }) => {
    await page.goto(`${BASE}/exam/1/sprachbausteine`);
    await expect(page).toHaveURL(new RegExp(`${BASE}$`));
    await expect(dashboardHeading(page)).toBeVisible();
  });

  test('does not overflow horizontally at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const overflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

    for (const path of ['', '/learn', '/guide', '/practice', '/history']) {
      await page.goto(`${BASE}${path}`);
      await expect(page.locator('main')).toBeVisible();
      expect(await overflow(), `${BASE}${path} overflows at 360px`).toBeLessThanOrEqual(1);
    }
    for (const module of ['hoeren', 'lesen', 'schreiben', 'sprechen']) {
      await page.goto(`${BASE}/exam/1/${module}`);
      await page.getByRole('button', { name: /^Start / }).click();
      await expect(page.getByRole('timer')).toBeVisible();
      expect(await overflow(), `the ${module} module overflows at 360px`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('DTZ practice runs', () => {
  test('Lesen: every Teil answered, X in Teil 2, scored 25/25 and reviewed as 25 rows', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(`${BASE}/exam/1/lesen`);
    await page.getByRole('button', { name: /^Start Lesen/ }).click();
    await expect(page.getByText('Teil 2 — Anzeigen')).toBeVisible();

    await answerLesen(page);
    const xIndex = EXAM.lesen.teil2.answers.indexOf(NO_MATCH);
    expect(xIndex).toBeGreaterThanOrEqual(0);
    await expect(
      page.getByRole('combobox', { name: `Anzeige für Aufgabe ${26 + xIndex}`, exact: true })
    ).toHaveText('X');

    /* Everything is answered, so the confirmation is the plain one, not the blank warning. */
    await page.getByRole('button', { name: /^Submit Lesen/ }).click();
    await expect(page.getByRole('alertdialog')).not.toContainText('unanswered');
    await page.getByRole('button', { name: 'Submit now' }).click();
    await expect(page.getByText(/time used/)).toBeVisible();
    await expect(page.getByText('/25', { exact: true }).first()).toBeVisible();
    await expect(page.locator('main')).toContainText(/25\s*\/25/);

    await page.getByRole('link', { name: /Review answers/ }).click();
    /* Each row names itself and says, in words, whether it was right. */
    await expect(
      page.getByRole('article', { name: /^Teil \d · Nr\. \d+, (correct|incorrect)$/ })
    ).toHaveCount(25);
    await expect(page.getByRole('article', { name: /, correct$/ })).toHaveCount(25);
    await expect(page.getByText('Your answer: X) keine passende Anzeige')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('Hören: a clip plays, all four Teile answered, scored 20/20', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(`${BASE}/exam/1/hoeren`);
    await page.getByRole('button', { name: /^Start Hören/ }).click();

    /* The DTZ default is two plays per text — this trainer's choice. One play leaves one. */
    const firstPlay = page.getByRole('button', { name: 'Play' }).first();
    await firstPlay.click();
    await expect(page.getByText(/\b1 play left$/).first()).toBeVisible();
    expect(await page.evaluate(() => window.__spoken.length)).toBeGreaterThan(0);

    await answerHoeren(page);
    await submit(page, 'Hören');
    await expect(page.getByText(/time used/)).toBeVisible();
    await expect(page.locator('main')).toContainText(/20\s*\/20/);

    expect(errors).toEqual([]);
  });

  test('Schreiben: Aufgabe B, a typed text and four criteria rated to 20/20', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(`${BASE}/exam/1/schreiben`);
    await page.getByRole('button', { name: /^Start Schreiben/ }).click();

    await byId(page, 'w.task-1').click();
    await expect(byId(page, 'w.task-1')).toBeChecked();
    await expect(page.getByText(EXAM.schreiben.tasks[1].situation)).toBeVisible();
    await page
      .getByRole('textbox', { name: 'Ihr Text' })
      .fill('Sehr geehrte Damen und Herren, ich schreibe Ihnen wegen der Wohnung.');
    await expect(page.getByText('11 Wörter')).toBeVisible();

    await submit(page, 'Schreiben');
    await expect(page.getByText(/self-scoring \(max 20\)/)).toBeVisible();
    expect(await rateAllTop(page)).toBe(4);
    await expect(page.getByText(/Module score:/)).toContainText('20/20');
    await page.getByRole('button', { name: /^Confirm score/ }).click();

    await expect(page.getByText(/time used/)).toBeVisible();
    await expect(page.locator('main')).toContainText(/20\s*\/20/);
    expect(errors).toEqual([]);
  });
});

test.describe('a full DTZ sitting', () => {
  test('ends on a certificate with the three part results, then reaches history', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(BASE);
    await page
      .getByRole('button', { name: /Start full exam/ })
      .first()
      .click();
    await expect(page.getByText(/Module 1 of 4/)).toBeVisible();

    /* Hören and Lesen left blank: 0/45 is unter A2. Schreiben 20/20 and Sprechen 100/100 are
       both B1 — and Schreiben B1 stands in for Hören + Lesen, so the verdict is B1. */
    await page.getByRole('button', { name: /^Start Hören/ }).click();
    await submit(page, 'Hören');
    await page.getByRole('button', { name: /^Start Lesen/ }).click();
    await submit(page, 'Lesen');
    await page.getByRole('button', { name: /^Start Schreiben/ }).click();
    await submit(page, 'Schreiben');
    expect(await rateAllTop(page)).toBe(4);
    /* The certificate below rests on Schreiben B1: confirm only once the rating has landed. */
    await expect(page.getByText(/Module score:/)).toContainText('20/20');
    await page.getByRole('button', { name: /^Confirm score/ }).click();
    await page.getByRole('button', { name: /^Start Sprechen/ }).click();
    await submit(page, 'Sprechen');
    await expect(page.getByText(/self-scoring \(max 100\)/)).toBeVisible();
    expect(await rateAllTop(page)).toBe(9);
    await expect(page.getByText(/Module score:/)).toContainText('100/100');
    await page.getByRole('button', { name: /^Confirm score/ }).click();

    /* The sitting ends on the results route, a lazily loaded screen: wait for it to be there
       before reading the verdict on it. */
    await expect(page).toHaveURL(/\/results\/\d+$/);
    await expect(page.getByRole('heading', { level: 1, name: /Results/ })).toBeVisible();
    const main = page.locator('main');
    await expect(main.getByText('Zertifikat B1', { exact: true })).toBeVisible();
    await expect(main).toContainText('Hören + Lesen: 0/45 → unter A2 (B1 ab 33, A2 ab 20)');
    await expect(main).toContainText('Schreiben: 20/20 → B1 (B1 ab 15, A2 ab 7)');
    await expect(main).toContainText('Sprechen: 100/100 → B1 (B1 ab 75, A2 ab 35)');

    await page.goto(`${BASE}/history`);
    /* Phones list attempts as cards; wider screens as a table. */
    const phone = (page.viewportSize()?.width ?? 1280) < 640;
    const row = page
      .locator('main')
      .getByRole(phone ? 'listitem' : 'row')
      .filter({ hasText: 'Zertifikat B1' });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText('0/45');
    await expect(row).toContainText('100/100');
    await expect(page.getByRole('img', { name: /Latest: Test \d+, 0 of 45 \(Zertifikat B1\)/ })).toHaveCount(
      1
    );

    expect(errors).toEqual([]);
  });
});

test.describe('DTZ data stays its own', () => {
  test('a mid-module reload resumes from telcTrainerDtzRunV1 and leaves other run keys alone', async ({
    page
  }) => {
    await page.goto(`${BASE}/exam/2/lesen`);
    /* Another trainer's run in progress, which nothing here may touch. */
    const levelRun = JSON.stringify({
      b1: { runId: 1, trainer: 'b1', examId: 3, mode: 'lesen', queue: ['lesen'] }
    });
    await page.evaluate(
      ([key, value]) => localStorage.setItem(key, value),
      ['telcTrainerLevelRunV1', levelRun]
    );

    await page.getByRole('button', { name: /^Start Lesen/ }).click();
    const radio = page.getByRole('radio').first();
    await radio.click();
    await expect(radio).toBeChecked();

    const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? 'null'), RUN_KEY);
    expect(Object.keys(stored)).toEqual(['dtz']);
    expect(stored.dtz.examId).toBe(2);
    expect(Object.keys(stored.dtz.answers)).toHaveLength(1);

    await page.reload();
    await expect(page.getByText('Teil 1 — Verzeichnis')).toBeVisible();
    await expect(page.getByRole('radio').first()).toBeChecked();
    expect(await page.evaluate(() => localStorage.getItem('telcTrainerLevelRunV1'))).toBe(levelRun);
    expect(await page.evaluate(() => localStorage.getItem('telcTrainerRunV1'))).toBeNull();
  });

  test('switching A2·B1 → DTZ → B1 keeps a DTZ attempt out of the other histories', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      ([key, doc]) => localStorage.setItem(key, JSON.stringify(doc)),
      [
        PROGRESS_KEY,
        {
          attempts: [],
          learnDone: {},
          settings: {},
          dtz: {
            attempts: [
              {
                id: 1_760_000_000_000,
                examId: 4,
                mode: 'full',
                date: '2026-10-01T10:00:00.000Z',
                times: {},
                scores: { hoeren: 10, lesen: 12, schreiben: 9, sprechen: 50 },
                answers: {},
                ratings: { schreiben: 9, sprechen: 50 },
                result: 'Zertifikat A2'
              }
            ],
            learnDone: {},
            srs: {},
            activity: {},
            settings: { examDate: '2026-12-01', writingMinutes: 30, playsAllowed: 2 }
          }
        }
      ]
    );
    await page.reload();

    const visit = async trainer => {
      await page.getByRole('button', { name: /switch trainer/i }).click();
      await page
        .getByRole('menuitem', {
          name: new RegExp(`^${trainer.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
        })
        .click();
      await expect(dashboardHeading(page)).toBeVisible();
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'History' }).click();
      await expect(page.locator('main')).toContainText(/History/);
    };

    await visit(ROOT);
    await expect(page.getByText('Zertifikat A2')).toHaveCount(0);
    await visit(DTZ);
    /* Phones list attempts as cards; wider screens as a table. */
    const attemptRole = (page.viewportSize()?.width ?? 1280) < 640 ? 'listitem' : 'row';
    await expect(
      page.locator('main').getByRole(attemptRole).filter({ hasText: 'Zertifikat A2' })
    ).toHaveCount(1);
    await visit(B1);
    await expect(page.getByText('Zertifikat A2')).toHaveCount(0);
  });

  test('settings show the DTZ exam conditions with no official play count', async ({ page }) => {
    await page.goto('/settings');
    const conditions = page.getByLabel('Exam conditions');
    await expect(conditions.getByRole('heading', { name: DTZ.name, level: 3 })).toBeVisible();
    await expect(
      conditions.getByText('The DTZ material this trainer follows does not say how often each text plays')
    ).toBeVisible();

    const plays = page.locator('[id="setting-dtz-plays"]');
    await expect(plays).toContainText("this trainer's default");
    await plays.click();
    const options = page.getByRole('option');
    await expect(options).toHaveCount(3);
    for (const label of await options.allTextContents())
      expect(label.toLowerCase()).not.toContain('official');
  });
});
