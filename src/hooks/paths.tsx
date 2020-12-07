const PATH_SPECS = [
  {
    path: '/',
    params: [],
  },
  {
    path: '/signup',
    params: [],
  },
  {
    path: '/login',
    params: [],
  },
  {
    path: '/post/:id',
    params: ['id'],
  },
  {
    path: '/calendar/:year/:month',
    params: ['year', 'month'],
  },
] as const;

type PathSpec = (typeof PATH_SPECS)[number];
export type Path = PathSpec['path'];

// Find a path spec with the matching path.
type MatchPath<T, P> = T extends { path: P } ? T : never;

// Object which has matching parameter keys for a path.
export type PathParams<P extends Path> = {
  [X in MatchPath<PathSpec, P>['params'][number]]: string;
};

/**
 * Type predicate for checking whether params match the path specs.
 * @example
 * isParams(
 *   '/something/:id',
 *   { id: 'abcd' },
 * ) // returns true.
 * 
 * isParams(
 *   '/else/:one',
 *   { two: 'efg' },
 * ) // returns false.
 * @param path target path.
 * @param params params to be checked.
 */
export function isParams<P extends Path>(path: P, params: unknown): params is PathParams<P> {
  if (!(params instanceof Object)) {
    return false;
  }

  const paramSet = new Set(Object.keys(params));

  // Validate params.
  const requiredParams = PATH_SPECS.find((x) => x.path === path)?.params ?? [];

  for (const x of requiredParams) {
    if (!paramSet.has(x)) {
      return false;
    }
  }

  return true;
}

/**
 * Build an url with a path and its parameters.
 * @example
 * buildUrl(
 *   '/a/:first/:last',
 *   { first: 'p', last: 'q' },
 * ) // returns '/a/p/q'
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

  for (const spec of PATH_SPECS) {
    if (spec.path === path) {
      for (const key of spec.params) {
        ret = ret.replace(`:${key}`, paramObj[key]);
      }

      break;
    }
  }

  return ret;
};