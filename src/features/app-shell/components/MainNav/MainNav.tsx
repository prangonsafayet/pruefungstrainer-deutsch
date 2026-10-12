import { NavLink } from 'react-router-dom';

import { cn } from '@shared/lib/cn.ts';

import { useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';
import { NAV_ENTRIES } from '@features/app-shell/lib/navEntries.ts';

/**
 * The pill row under the header on tablets and desktops (≥ 640px; phones get the bottom tab
 * bar). Pills stay 44px tall until 1024px because tablets are touch; icons join the labels
 * from 768px, where all six fit on one row.
 */
const MainNav = () => {
  const { trainer } = useActiveTrainer();

  return (
    <nav aria-label="Main">
      <ul className="flex gap-1">
        {NAV_ENTRIES[trainer.id].map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 font-heading text-sm font-bold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring lg:min-h-9',
                  isActive && 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="hidden size-4 md:block" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
