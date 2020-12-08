const PATHS = [
  '/',
  '/signup',
  '/login',
  '/post/:id',
  '/calendar/:year/:month',
] as const;

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
  const requiredParams = path
    .split('/')
    .filter((s) => s.startsWith(':'))
    .map((s) => s.substr(1));
  console.log(requiredParams);

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

  for (const key of Object.keys(paramObj)) {
    ret = ret.replace(`:${key}`, paramObj[key]);
  }

  return ret;
};