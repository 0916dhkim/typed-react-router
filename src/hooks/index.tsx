import { Path, PathParams, isParams } from "./paths";
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { ComponentType } from "react";

/**
 * Type-safe version of `react-router-dom/useParams`.
 * @param path Path to match route.
 * @returns parameter object if route matches. `null` otherwise.
 */
export const useTypedParams = <P extends Path>(
  path: P
): PathParams<P> | null => {
  // `exact`, `sensitive` and `strict` options are set to true
  // to ensure type safety.
  const match = useRouteMatch({
    path,
    exact: true,
    sensitive: true,
    strict: true,
  });

  if (!match || !isParams(path, match.params)) {
    return null;
  }
  return match.params;
}

/**
 * A hook for defining route switch.
 * @example
 * const TypedSwitch = useTypedSwitch([
 *   { path: '/', component: Home },
 *   { path: '/user/:id', component: User },
 * ]);
 * @param routes 
 * @param fallbackComponent 
 */
export const useTypedSwitch = (
  routes: ReadonlyArray<{ path: Path, component: ComponentType }>,
  fallbackComponent?: ComponentType,
): ComponentType => {
  const Fallback = fallbackComponent;
  return () => (
    <Switch>
      {routes.map(({ path, component: RouteComponent }, i) => (
        <Route exact strict sensitive path={path}>
          <RouteComponent />
        </Route>
      ))}
      {Fallback && <Fallback />}
    </Switch>
  );
}
