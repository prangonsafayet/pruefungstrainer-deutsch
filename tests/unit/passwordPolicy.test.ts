import { describe, expect, it } from 'vitest';

import {
  checkPassword,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  strengthLabel
} from '@shared/account-sync/lib/passwordPolicy.ts';

/*
 * Immediate feedback on the sign-up form. Not a security control — Supabase enforces its own
 * rules — but the form's submit button and its strength meter both read these, so the edges
 * (exactly the minimum length, the 12-character bonus, the meter's ends) are pinned.
 */

describe('isValidEmail', () => {
  it.each([
    ['learner@example.test', true],
    ['  learner@example.test  ', true],
    ['learner@example', false],
    ['learner example@test.de', false],
    ['@example.test', false],
    ['', false]
  ])('%j → %s', (email, valid) => {
    expect(isValidEmail(email)).toBe(valid);
  });
});

describe('checkPassword', () => {
  it('says nothing about an empty password, but does not accept it', () => {
    expect(checkPassword('')).toEqual({ valid: false, problem: null, strength: 0 });
  });

  it('refuses one character short of the minimum and accepts exactly the minimum', () => {
    expect(checkPassword('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toEqual({
      valid: false,
      problem: `Use at least ${String(MIN_PASSWORD_LENGTH)} characters.`,
      strength: 1
    });
    expect(checkPassword('a'.repeat(MIN_PASSWORD_LENGTH))).toMatchObject({ valid: true, problem: null });
  });

  it.each([
    ['aaaaaaaa', 1], // one character class: never below 1
    ['aaaaAAAA', 1],
    ['aaaaAA11', 2],
    ['aaaAA11!', 3],
    ['aaaaAAAA1111', 3], // three classes + the 12-character bonus
    ['aaaaAAA111!!', 4],
    ['aaaaaAAAAA11111!!!!!', 4] // capped at 4
  ])('%s scores %i', (password, strength) => {
    expect(checkPassword(password).strength).toBe(strength);
  });
});

describe('strengthLabel', () => {
  it('names each step of the meter, and has nothing to say outside it', () => {
    expect([1, 2, 3, 4].map(strengthLabel)).toEqual(['weak', 'fair', 'good', 'strong']);
    expect(strengthLabel(0)).toBe('—');
    expect(strengthLabel(5)).toBe('—');
  });
});
