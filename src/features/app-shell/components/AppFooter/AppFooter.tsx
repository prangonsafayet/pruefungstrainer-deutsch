import { Link } from 'react-router-dom';

import { APP_BUILD_LABEL } from '@shared/config/appInfo.ts';
import { DATENSCHUTZ_PATH, IMPRESSUM_PATH, INDEPENDENCE_DISCLAIMER } from '@shared/config/legal.ts';
import { APP_NAME } from '@shared/config/trainers.ts';

/**
 * The build label (a stale service worker or a cached bundle otherwise looks identical to a
 * current one), the legal links, and the notice that this is an independent project.
 */
const AppFooter = () => (
  <footer className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-4 text-xs text-muted-foreground">
      <span className="font-heading font-bold">{APP_NAME}</span>
      <nav aria-label="Legal" className="flex gap-4">
        <Link to={IMPRESSUM_PATH} className="underline-offset-4 hover:underline">
          Impressum
        </Link>
        <Link to={DATENSCHUTZ_PATH} className="underline-offset-4 hover:underline">
          Datenschutz
        </Link>
      </nav>
      <span className="font-mono" title="Application version and deployed commit">
        {APP_BUILD_LABEL}
      </span>
    </div>
    <p className="mt-2 text-xs text-muted-foreground">{INDEPENDENCE_DISCLAIMER}</p>
  </footer>
);

export default AppFooter;
