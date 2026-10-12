import { Compass, LayoutDashboard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@shared/ui/button.tsx';

import { useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';

/** A dead link: say so kindly, and offer the way back into the trainer the URL was in. */
const NotFoundPage = () => {
  const { trainer, home } = useActiveTrainer();

  return (
    <div className="mx-auto max-w-md py-16 text-center sm:py-24">
      <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Compass className="size-8" aria-hidden />
      </span>
      <h1 className="text-3xl font-extrabold sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        That link doesn&apos;t lead anywhere in the trainer. Nothing is lost — your progress is where you left
        it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to={home}>
            <LayoutDashboard /> {trainer.short} dashboard
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/settings">
            <Settings /> Settings
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
