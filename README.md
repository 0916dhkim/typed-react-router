# Typescript-Friendly React Router Example

This example shows you how to use `react-router` in more type-safe way.

## Problem
1. `react-router` takes any plain string as a path. This makes it difficult to refactor routing when it is required to rename/delete/add routes. Also typos are hard to detect.
2. Developers need to provide types for `useParams` hook (i.e. `useParams<{ id: string }>`). It has the same issue with refactoring. Developers need to update `useParams` hooks whenever there's a change in URL parameter names.

## Solution (Walkthrough)
### `src/hooks/paths.tsx`
The single source of truth for available paths is defined
in this module.
If a route needs to be modified, this `PATHS`
can be fixed, then TypeScript compiler will raise errors where
type incompatibilities are found.
```tsx
const PATHS = [
  '/',
  '/signup',
  '/login',
  '/post/:id',
  '/calendar/:year/:month',
] as const;
```
Utility types can be derived from this readonly array of paths.
```ts
type ExtractRouteParams<T> = string extends T
    ? Record<string, string>
    : T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
    : T extends `${infer _Start}:${infer Param}`
    ? { [k in Param]: string }
    : {};

export type Path = (typeof PATHS)[number];

// Object which has matching parameter keys for a path.
export type PathParams<P extends Path> = ExtractRouteParams<P>;
```
Small amount of TypeScript magic is applied here,
but the end result is quite simple.
Note how `PathParams` type behaves.
- `PathParams<'/post/:id'>` is `{ id: string }`
- `PathParams<'/calendar/:year/:month'>` is `{ year: string, month: string }`
- `PathParams<'/'>` is `{}`

From here, a type-safe utility function is written
for building URL strings.
```ts
/**
 * Build an url with a path and its parameters.
 * @param path target path.
 * @param params parameters.
 */
export const buildUrl = <P extends Path>(
  path: P,
  params: PathParams<P>,
): string => {
  let ret: string = path;

  // Upcast `params` to be used in string replacement.
  const paramObj: { [i: string]: string } = params;

  for (const key of Object.keys(paramObj)) {
    ret = ret.replace(`:${key}`, paramObj[key]);
  }

  return ret;
};
```
`buildUrl` function can be used like this:
```ts
buildUrl(
  '/post/:id',
  { id: 'abcd123' },
); // returns '/post/abcd123'
```
`buildUrl` only takes a known path (from `PATHS`)
as the first argument,
therefore typo-proof. Sweet!

### `src/components/TypedLink`
Now, let's look at `TypedLink` a type-safe alternative to `Link`.
```tsx
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
```
`TypedLink` can be used like this:
```tsx
<TypedLink to='/post/:id' params={{ id: 'abcd123' }} />
```
The `to` props of `TypedLink` only takes a known path,
just like `buildUrl`.

### `src/components/TypedRedirect.tsx`
`TypedRedirect` is implemented in same fashion as `TypedLink`.
```tsx
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
```
### `src/hooks/index.tsx`
Instead of `useParams`
which cannot infer the shape of params object,
`useTypedParams` hook can be used.
It can infer the type of params from `path` parameter.
```ts
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
```
Finally, `useTypedSwitch` allows type-safe `<Switch>` tree.
```tsx
/**
 * A hook for defining route switch.
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
```
Here's how `<Switch>` is usually used:
```tsx
// Traditional approach.
const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/user/:id' component={User} />
    </Switch>
  </BrowserRouter>
);
```
The code above can be replaced with the following code.
```tsx
const App = () => {
  const TypedSwitch = useTypedSwitch([
    { path: '/', component: Home },
    { path: '/user/:id', component: User },
  ]);

  return (
    <BrowserRouter>
      <TypedSwitch />
    </BrowserRouter>
  );
}
```

## Conclusion

Original | Replaced
---------|---------
`<Link to='/user/123' />`|`<TypedLink to='/user/:id' params={ id: '123' } />`
`<Redirect to='/user/123'>`|`<TypedRedirect to='/user/:id' params={ id: '123' } />`
`useParams()`|`useTypedParams('/user/:id')`
`<Switch>`|`useTypedSwitch`

Type-safe alternatives are slightly more verbose than the original syntax,
but I believe this is better for overall integrity of a project.
- Developers can make changes in routes
without worrying about broken links (at least they don't break silently).
- Nice autocompletion while editing code.

## How to Run This Example
1. Clone this repo.
2. `yarn`
3. `yarn start`
