import { CloudOff } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import AccountMenu from '@shared/account-sync/components/AccountMenu/AccountMenu.tsx';
import { SyncContext } from '@shared/account-sync/hooks/useSync.tsx';
import AppLogo from '@shared/components/AppLogo/AppLogo.tsx';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary.tsx';
import ThemeToggle from '@shared/components/ThemeToggle/ThemeToggle.tsx';
import { APP_NAME } from '@shared/config/trainers.ts';
import { Badge } from '@shared/ui/badge.tsx';

import AppFooter from '@features/app-shell/components/AppFooter/AppFooter.tsx';
import ExamCountdownBadge from '@features/app-shell/components/ExamCountdownBadge/ExamCountdownBadge.tsx';
import MainNav from '@features/app-shell/components/MainNav/MainNav.tsx';
import TrainerSwitcher from '@features/app-shell/components/TrainerSwitcher/TrainerSwitcher.tsx';

import { useAppLayout } from './useAppLayout.tsx';

const AppLayout = () => {
  const { sync, offline, pathname, headerRef, trainer, home, examDate } = useAppLayout();

  return (
    <SyncContext.Provider value={sync}>
      <div className="min-h-screen bg-background">
        <header
          ref={headerRef}
          className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
            <NavLink
              to={home}
              className="group flex items-center gap-2.5 leading-tight"
              aria-label={`${APP_NAME} — dashboard`}
            >
              <AppLogo className="size-9 shrink-0 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
              <span>
                <span className="block text-base font-bold tracking-tight">{APP_NAME}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {trainer.name} · {trainer.tagline}
                </span>
              </span>
            </NavLink>

            <div className="mr-auto">
              <TrainerSwitcher />
            </div>

            <ExamCountdownBadge examDate={examDate} />

            {offline ? (
              <Badge variant="warning" className="gap-1.5 py-1" title={sync.chip?.title}>
                <CloudOff className="size-3" aria-hidden /> offline
              </Badge>
            ) : null}

            <AccountMenu />
            <ThemeToggle />
            <MainNav />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">
          <ErrorBoundary resetKey={pathname}>
            {/* Re-keying on the path restarts the entrance animation for each screen. */}
            <div key={pathname} className="animate-fade-up">
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>

        <AppFooter />
      </div>
    </SyncContext.Provider>
  );
};

export default AppLayout;
