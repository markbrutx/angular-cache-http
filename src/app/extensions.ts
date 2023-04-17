import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/operators";

export function delayRetryPipe<T>(delayMs = 1000, maxRetry = 3)
{
  let retries = maxRetry;
  let subError: any[] = [];
  return (src: Observable<T>): Observable<T> =>
    src.pipe(
      retryWhen(error =>
        error.pipe(
          delay(delayMs),
          mergeMap(error =>
          {
            subError.push(error);
            return --retries > 0
              ? of(error)
              : throwError({ error: `Превышено максимальное количество попыток ${maxRetry}`, subError })
          })
        )));
}

export function delayRetryMethod(delayMs = 1000, maxRetry = 3)
{
  return (target: any, method: string, descriptor: PropertyDescriptor) =>
  {
    const origin = descriptor.value;
    descriptor.value = function (...args: any[])
    {

      const result: Observable<any> = origin.apply(this, args);
      return result.pipe(delayRetryPipe(delayMs, maxRetry));
    }
  };
}

export function delayRetryClass(delayMs = 1000, maxRetry = 3)
{
  return (target: Function) =>
  {
    const ds = Object.getOwnPropertyDescriptors(target.prototype);
    for (const propertyName in ds)
    {
      const descriptor = ds[propertyName];
      const original = descriptor.value;

      if (!(original instanceof Function)) continue;
      descriptor.value = function (...args: any[])
      {
        const result = original.apply(this, args);
        if (result instanceof Observable)
          return result.pipe(delayRetryPipe(delayMs, maxRetry));

        return result;

      }

      Object.defineProperty(target.prototype, propertyName, descriptor);
    }
  };
}




/**
 * Decorator for retrying function
 *
 * @param [delayMs=1000] delay between retries
 * @param [maxRetry=3] max count of retries
 * @param [filter=(name: string) => true] filter for methods
 * @return decorator func. Use @delayRetry()
 */
 export function delayRetry(
  delayMs = 1000,
  maxRetry = 3,
  filter: (name: string) => boolean = (name: string) => true
)
{
  return (...args: any[]) =>
  {
    switch (args.length)
    {
      case 1:
        // when class
        const target: Function = args[0];
        const ds = Object.getOwnPropertyDescriptors(target.prototype);
        for (const propertyName in ds)
        {
          if (!filter(propertyName)) continue;
          const descriptor = ds[propertyName];
          const origin = descriptor.value;

          if (!(origin instanceof Function)) continue;
          descriptor.value = function (...args: any[])
          {
            const result = origin.apply(this, args);
            if (result instanceof Observable)
              return result.pipe(delayRetryPipe(delayMs, maxRetry));
            return result;
          }

          Object.defineProperty(target.prototype, propertyName, descriptor);
        }
        break;
      case 3:
        // when function
        const descriptor: PropertyDescriptor = args[2];
        const origin = descriptor.value;
        descriptor.value = function (...args: any[])
        {
          const result: Observable<any> = origin.apply(this, args);
          return result.pipe(delayRetryPipe(delayMs, maxRetry));
        }
        break;
    }
  };
}