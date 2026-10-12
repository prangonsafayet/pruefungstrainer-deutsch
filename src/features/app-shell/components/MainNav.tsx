import { NavLink } from 'react-router-dom';

import { cn } from '@shared/lib/cn.ts';

import { useActiveTrainer } from '../hooks/useActiveTrainer.ts';
import { NAV_ENTRIES } from '../lib/navEntries.ts';

const MainNav = () => {
  const { trainer } = useActiveTrainer();

  return (
    <nav className="flex w-full flex-wrap gap-1 sm:w-auto" aria-label="Main">
      {NAV_ENTRIES[trainer.id].map(({ to, label, icon: Icon, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground'
            )
          }
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default MainNav;
