# Angular-cache-http

## Overview
The `CachedRequest` decorator is a function that provides a simple caching mechanism for API calls. It helps to cache the results of an API request to avoid making multiple unnecessary requests to the server.

It utilizes the `rxjs` library and its operators, namely `Observable` and `shareReplay`.

## Usage
The `CachedRequest` decorator can be applied to methods that return an `Observable`:

```typescript
import { CachedRequest } from './path/to/cached-request.decorator';

class ApiService {
  private cache: { [key: string]: Observable<any> | undefined } = {};

  @CachedRequest(function (this: ApiService) {
    return this.cache;
  })
  public getData(param: string): Observable<any> {
    // API call logic
  }
}

```

## Parameters
The ``CachedRequest`` decorator accepts a single parameter:

- `cacheFactory` (function): A function that returns an object for storing the cache. This function is called with the `this` context of the target object.

## How It Works

1. When the decorated method is called, the decorator checks for an existing cache using the cache key, which is generated based on the class name, method name, and stringified input parameters.
2. If the cache exists, the decorator returns the cached `Observable`.
3. If the cache does not exist, it calls the original method, creates a new cache using the `shareReplay(1)` operator, and stores the cache.
4. Finally, it returns the newly created cache as an `Observable`.

This caching mechanism helps to reduce the number of API calls and improve the performance of an application, especially when dealing with expensive or slow API calls.

## Additional

You can run the project locally to see the implemented CRUD functionality using Angular Material. The example showcases fetching, displaying, and selecting user data using Angular Material components for a visually appealing user interface.

## Running the Project

1. Install the required dependencies by running the following command:
    
    ```bash
    npm install
    ```
2. Start the development server by executing the following command:
    
    ```bash 
    ng serve
    ``` 
3. Open your browser and navigate to http://localhost:4200. You should see the application running with the Angular Material-styled interface.


## Visual Demo

The running application demonstrates:

- Fetching user data using the "Click to response" button.
- Clearing fetched data using the "Clear users" button.
- Displaying a list of fetched users.
- Selecting a user to display detailed user information.
- Adjusting the number of requests with the "Number of Requests" input field.
Explore the visually pleasing Angular Material components and CRUD functionality provided in the example application.

## Note

Remember that this caching mechanism is simple and might not be suitable for all use cases. It is important to consider the specific requirements and constraints of your application when deciding whether to use this decorator.