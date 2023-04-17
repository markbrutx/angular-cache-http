import { CacheService } from './../cache/cache.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CachedRequest } from '../cache/cache-decorator';
 

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        }
    },
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    }
}
  

@Injectable({ providedIn: 'root' })
export class ApiClientService
{

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string,
    private readonly cache: CacheService
  )
  {
  }

  @CachedRequest(function () { return this.cache; })
  public GetAllusers()
  {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  @CachedRequest(function () { return this.cache; })
  public GetUser(idx: number)
  {
    return this.http.get<User>(`${this.baseUrl}/users/${idx}`);
  }

}