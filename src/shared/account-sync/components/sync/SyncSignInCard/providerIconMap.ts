import GitHubIcon from '@shared/account-sync/components/icons/GitHubIcon/GitHubIcon.tsx';
import GoogleIcon, {
  type ProviderIconProps
} from '@shared/account-sync/components/icons/GoogleIcon/GoogleIcon.tsx';
import { type OAuthProvider } from '@shared/account-sync/lib/oauthProviders.ts';

/** Brand mark per provider, used by the sign-in buttons. */
export const PROVIDER_ICONS: Readonly<
  Record<OAuthProvider, (props: ProviderIconProps) => React.JSX.Element>
> = {
  google: GoogleIcon,
  github: GitHubIcon
};
