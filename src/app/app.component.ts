import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-cache-http';


  constructor(private http: HttpClient) {}

  public getUsers() {
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe((res) => {
      console.log(res);
    });
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

}
