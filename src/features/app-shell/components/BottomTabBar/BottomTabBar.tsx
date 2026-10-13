import { Ellipsis } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@shared/lib/cn.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@shared/ui/dropdown-menu.tsx';
import { Pressable } from '@shared/ui/pressable.tsx';

import { useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';
import { NAV_ENTRIES, splitTabBar } from '@features/app-shell/lib/navEntries.ts';

const TAB =
  'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl font-heading text-xs font-bold outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring';
/* The icon sits in a pill that fills in when its tab is the current page. */
const PILL = 'flex h-7 w-12 items-center justify-center rounded-full transition-colors';

/**
 * The phone navigation (< 640px): up to five icon-and-label tabs fixed to the bottom, within
 * thumb reach, clear of the home indicator. Tabs beyond the fifth slot live behind "More".
 * The bottom inset needs `viewport-fit=cover` in index.html (without it iOS reports 0), and
 * `max()` keeps a floor so the tabs never sit flush on the screen edge where it reports 0.
 */
const BottomTabBar = () => {
  const { trainer } = useActiveTrainer();
  const { pathname } = useLocation();
  const { tabs, more, moreActive } = splitTabBar(NAV_ENTRIES[trainer.id], pathname);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-pop backdrop-blur-md sm:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex flex-1">
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(TAB, isActive ? 'text-accent-foreground' : 'text-muted-foreground')
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn(PILL, isActive && 'bg-accent')}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
        {more.length > 0 ? (
          <li className="flex flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Pressable
                  className={cn(TAB, moreActive ? 'text-accent-foreground' : 'text-muted-foreground')}
                >
                  <span className={cn(PILL, moreActive && 'bg-accent')}>
                    <Ellipsis className="size-5" aria-hidden />
                  </span>
                  More
                </Pressable>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-56">
                {more.map(({ to, label, icon: Icon }) => (
                  <DropdownMenuItem key={to} asChild className="min-h-11 font-heading font-bold">
                    <NavLink to={to}>
                      <Icon aria-hidden />
                      {label}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default BottomTabBar;
