import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient } from "@/utils/auth";

export function BetterAuthUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  // Wrapper function to adapt TanStack Router's navigate to AuthUIProvider's expected interface
  const navigateWrapper = (href: string) => {
    navigate({ to: href });
  };

  // Wrapper function for replace navigation
  const replaceWrapper = (href: string) => {
    navigate({ to: href, replace: true });
  };

  // Wrapper component to adapt TanStack Router's Link to AuthUIProvider's expected interface
  const LinkWrapper = ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <AuthUIProviderTanstack
      authClient={authClient}
      navigate={navigateWrapper}
      replace={replaceWrapper}
      Link={LinkWrapper}
    >
      {children}
    </AuthUIProviderTanstack>
  );
}
