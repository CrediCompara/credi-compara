import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TokenStorageService} from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'credi-compara';
  isLoggedIn = false;
  username: string = '';
  constructor(private tokenStorageService: TokenStorageService,
             private router: Router){}

  ngOnInit(): void{
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn){
      const user = this.tokenStorageService.getUser();
      this.username = user.first_name;
    }else{
      this.router.navigate(['/login']);
    }
  }
  logout(): void{
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
