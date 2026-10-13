import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@shared/hooks/useTheme.tsx';
import { Button } from '@shared/ui/button.tsx';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
};

export default ThemeToggle;
