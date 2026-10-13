import { Eye, EyeOff, KeyRound, Loader2, UserPlus } from 'lucide-react';

import PasswordStrengthMeter from '@shared/account-sync/components/password/PasswordStrengthMeter/PasswordStrengthMeter.tsx';
import SignUpNotice from '@shared/account-sync/components/password/SignUpNotice/SignUpNotice.tsx';
import { usePasswordAuth, type AuthMode } from '@shared/account-sync/hooks/usePasswordAuth.tsx';
import { MIN_PASSWORD_LENGTH } from '@shared/account-sync/lib/passwordPolicy.ts';
import { Button } from '@shared/ui/button.tsx';
import { Input } from '@shared/ui/input.tsx';
import { Label } from '@shared/ui/label.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs.tsx';

const MODES = ['signin', 'signup'] as const satisfies readonly AuthMode[];

/** Email + password sign-in and sign-up, as two tabs over one form. */
const PasswordAuthForm = () => {
  const auth = usePasswordAuth();
  const isSignUp = auth.mode === 'signup';
  /* The problem names one field: that field is marked invalid and described by it. */
  const invalid = (mode: AuthMode, field: NonNullable<typeof auth.problemField>) =>
    auth.problemField === field
      ? { 'aria-invalid': true, 'aria-describedby': `${mode}-problem` }
      : { 'aria-invalid': false };

  return (
    <Tabs
      value={auth.mode}
      onValueChange={value => {
        const next = MODES.find(mode => mode === value);
        if (next) auth.setMode(next);
      }}
    >
      <TabsList className="w-full">
        <TabsTrigger value="signin">
          <KeyRound /> Sign in
        </TabsTrigger>
        <TabsTrigger value="signup">
          <UserPlus /> Create account
        </TabsTrigger>
      </TabsList>

      {MODES.map(mode => (
        <TabsContent key={mode} value={mode} className="space-y-3">
          <SignUpNotice feedback={auth.signUpFeedback} busy={auth.busy} onResend={auth.resendConfirmation} />
          <div className="space-y-1.5">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={auth.email}
              onChange={event => {
                auth.setEmail(event.target.value);
              }}
              onKeyDown={auth.onKeyDown}
              {...invalid(mode, 'email')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${mode}-password`}>Password</Label>
            <div className="flex gap-2">
              <Input
                id={`${mode}-password`}
                type={auth.showPassword ? 'text' : 'password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder={isSignUp ? `At least ${String(MIN_PASSWORD_LENGTH)} characters` : '••••••••'}
                value={auth.password}
                onChange={event => {
                  auth.setPassword(event.target.value);
                }}
                onKeyDown={auth.onKeyDown}
                {...invalid(mode, 'password')}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={auth.showPassword ? 'Hide password' : 'Show password'}
                onClick={auth.toggleShowPassword}
              >
                {auth.showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          {isSignUp ? (
            <>
              {auth.password.length > 0 ? (
                <PasswordStrengthMeter strength={auth.passwordCheck.strength} />
              ) : null}
              <div className="space-y-1.5">
                <Label htmlFor={`${mode}-confirm`}>Repeat password</Label>
                <Input
                  id={`${mode}-confirm`}
                  type={auth.showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={auth.confirmPassword}
                  onChange={event => {
                    auth.setConfirmPassword(event.target.value);
                  }}
                  onKeyDown={auth.onKeyDown}
                  {...invalid(mode, 'confirm')}
                />
              </div>
            </>
          ) : null}

          {/* Announced once when it appears (role="alert"), not on every keystroke after. */}
          {auth.problem ? (
            <p id={`${mode}-problem`} role="alert" className="text-sm font-medium text-destructive-on-tint">
              {auth.problem}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={auth.submit} disabled={!auth.canSubmit}>
              {auth.busy ? <Loader2 className="animate-spin" /> : isSignUp ? <UserPlus /> : <KeyRound />}
              {auth.busy ? 'Working…' : isSignUp ? 'Create account' : 'Sign in'}
            </Button>
            {isSignUp ? null : (
              <Button variant="link" size="sm" onClick={auth.resetPassword} disabled={auth.busy}>
                Forgot password?
              </Button>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PasswordAuthForm;
