import { Path, PathParams, buildUrl } from '../hooks/paths';
import React, { ComponentType, ReactNode } from 'react';

import { Link } from 'react-router-dom';

type TypedLinkProps<P extends Path> = {
  to: P,
  params: PathParams<P>,
  replace?: boolean,
  component?: ComponentType,
  children?: ReactNode,
};

/**
 * Type-safe version of `react-router-dom/Link`.
 */
export const TypedLink = <P extends Path>({
   to,
   params,
   replace,
   component,
   children,
}: TypedLinkProps<P>) => {
  return (
    <Link
      to={buildUrl(to, params)}
      replace={replace}
      component={component}
    >
      {children}
    </Link>
  );
}
