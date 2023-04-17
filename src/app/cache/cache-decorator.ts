import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

/**
 * Caching decorator
 *
 * @export
 * @param cacheFactory gettings cache object
 * @return {*}
 */
export function cachedRequest(
  cacheFactory: (this: any) =>
    { [key: string]: Observable<any> | undefined }
)
{
  return (target: any, method: string, descriptor: PropertyDescriptor): PropertyDescriptor =>
  {
    // Original function
    const origin = descriptor.value;
    // Prefix for cache key
    const prefix = `${target.constructor.name}.${method}`;

    // Rewrite function by cached
    descriptor.value = function (...args: any[]): Observable<any>
    {
      // Get cache object
      const storage = cacheFactory.call(this)
      // create cache key
      const key = `${prefix}+${JSON.stringify(args)}`;

      // looking for cache
      let observable = storage[key];

      // if cache exists, return it
      if (!!observable) return observable;

      // create new cache
      observable = origin
        .apply(this, args)
        .pipe(shareReplay(1));

      // save cache
      storage[key] = observable;

      // return cache
      return observable as Observable<any>;
    };

    return descriptor;
  }
}
