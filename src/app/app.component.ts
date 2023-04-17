import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ApiClientService, User } from './services/api-client.service';
import * as e from 'cors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  requestsNumber: number = 10;
  loading: boolean = false;


  constructor(public apiClientService: ApiClientService) {}

  public getUsers() {
    for (let i = 0; i < this.requestsNumber; i++) {
      this.loading = true;
      this.apiClientService.GetAllusers().subscribe((
        results => {
        this.users = results;
        this.loading = false;
        console.log(`trying to get users [${i}]`);
      }),
        
        error => {
          this.loading = false;
          console.log(error);
        });
    }

  }

  public clearUsers() {
    this.users = [];
  }

  public selectUser(idx: number) {
    this.loading = true;
    this.apiClientService.GetUser(idx).subscribe((
      result => {
        this.loading = false;
        this.selectedUser = result;
      }),
      error => {
        this.loading = false;
        console.log(error);
      });
  }
  

  ngOnInit() {
    console.log('ngOnInit');
  }

}
