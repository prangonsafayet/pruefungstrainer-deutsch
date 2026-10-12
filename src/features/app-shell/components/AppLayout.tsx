import { CloudOff } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { ErrorBoundary, AppLogo, ThemeToggle } from '@shared/components';
import { APP_NAME } from '@shared/config/trainers.ts';
import { Badge } from '@shared/ui';

import { AccountMenu, SyncContext } from '@features/account-sync';

import { useAppLayout } from '../hooks/useAppLayout.ts';

import AppFooter from './AppFooter.tsx';
import ExamCountdownBadge from './ExamCountdownBadge.tsx';
import MainNav from './MainNav.tsx';
import TrainerSwitcher from './TrainerSwitcher.tsx';

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
