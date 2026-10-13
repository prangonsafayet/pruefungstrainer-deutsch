import { NavLink, Outlet } from 'react-router-dom';

import AccountMenu from '@shared/account-sync/components/AccountMenu/AccountMenu.tsx';
import { SyncContext } from '@shared/account-sync/hooks/useSync.tsx';
import AppLogo from '@shared/components/AppLogo/AppLogo.tsx';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary.tsx';
import ThemeToggle from '@shared/components/ThemeToggle/ThemeToggle.tsx';
import { APP_NAME } from '@shared/config/trainers.ts';
import { cn } from '@shared/lib/cn.ts';
import { Badge } from '@shared/ui/badge.tsx';

import AppFooter from '@features/app-shell/components/AppFooter/AppFooter.tsx';
import BottomTabBar from '@features/app-shell/components/BottomTabBar/BottomTabBar.tsx';
import ExamCountdownBadge from '@features/app-shell/components/ExamCountdownBadge/ExamCountdownBadge.tsx';
import MainNav from '@features/app-shell/components/MainNav/MainNav.tsx';
import OfflineBadge from '@features/app-shell/components/OfflineBadge/OfflineBadge.tsx';
import TrainerSwitcher from '@features/app-shell/components/TrainerSwitcher/TrainerSwitcher.tsx';

import { useAppLayout } from './useAppLayout.tsx';

/**
 * The chrome around every screen. Phones (< 640px): a compact top bar and a bottom tab bar.
 * Tablets and desktops: the top bar plus a pill row beneath it. During an exam sitting the
 * nav, the switcher and the countdown step aside (distraction-free).
 */
const AppLayout = () => {
  const { sync, offline, pathname, headerRef, mainRef, trainer, home, examDate, examMode } = useAppLayout();

  return (
    <SyncContext.Provider value={sync}>
      <div
        className={cn(
          'flex min-h-dvh flex-col',
          /* Room for the fixed tab bar, so the footer never sits underneath it. */
          !examMode && 'max-sm:pb-[calc(4.25rem+env(safe-area-inset-bottom))]',
          /* …and in an exam, room for the module toolbar docked at the bottom. */
          examMode && 'max-sm:pb-[calc(5.5rem+env(safe-area-inset-bottom))]'
        )}
      >
        <a
          href="#main"
          className="sr-only rounded-xl bg-primary px-4 py-2.5 font-heading font-bold text-primary-foreground shadow-pop outline-none focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Skip to content
        </a>

        <header
          ref={headerRef}
          className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75"
        >
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6">
            <NavLink
              to={home}
              className="group -m-1 flex min-w-0 items-center gap-2.5 rounded-xl p-1 leading-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
              aria-label={`${APP_NAME} — dashboard`}
            >
              <AppLogo className="size-9 shrink-0 transition-transform duration-200 ease-out group-hover:-rotate-3 group-hover:scale-105" />
              <span className="hidden min-w-0 md:block">
                <span className="block truncate font-heading text-base font-extrabold tracking-tight">
                  {APP_NAME}
                </span>
                <span className="hidden truncate text-xs text-muted-foreground lg:block">
                  {trainer.name} · {trainer.tagline}
                </span>
              </span>
            </NavLink>

            {examMode ? (
              <Badge variant="info" className="ml-1 py-1">
                Exam in progress · {trainer.short}
              </Badge>
            ) : (
              <TrainerSwitcher />
            )}

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              {examMode ? null : <ExamCountdownBadge examDate={examDate} />}

              {offline ? <OfflineBadge /> : null}

              {examMode ? null : <AccountMenu />}
              <ThemeToggle />
            </div>
          </div>

          {examMode ? null : (
            <div className="mx-auto hidden max-w-6xl px-4 pb-2.5 sm:block sm:px-6">
              <MainNav />
            </div>
          )}
        </header>

        <main
          ref={mainRef}
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 outline-none sm:px-6 sm:pt-8"
        >
          <ErrorBoundary resetKey={pathname} homeHref={home}>
            {/* Re-keying on the path restarts the entrance animation for each screen. Not in an
                exam: a finished transform animation still leaves a transform, which would make
                this div — not the viewport — the containing block of the docked exam toolbar. */}
            <div key={pathname} className={cn(!examMode && 'animate-fade-up')}>
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>

        <AppFooter />

        {examMode ? null : <BottomTabBar />}
      </div>
    </SyncContext.Provider>
  );
};

export default AppLayout;
