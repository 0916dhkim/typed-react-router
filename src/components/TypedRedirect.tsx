import { Path, PathParams, buildUrl } from '../hooks/paths';

import React from 'react';
import { Redirect } from 'react-router-dom';

type TypedRedirectProps<P extends Path, Q extends Path> = {
  to: P,
  params: PathParams<P>,
  push?: boolean,
  from?: Q,
};

/**
 * Type-safe version of `react-router-dom/Redirect`.
 */
export const TypedRedirect = <P extends Path, Q extends Path>({
  to,
  params,
  push,
  from,
}: TypedRedirectProps<P, Q>) => {
  return (
    <Redirect
      to={buildUrl(to, params)}
      push={push}
      from={from}
    />
  );
};
