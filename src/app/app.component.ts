import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'credi-compara';
  isLoggedIn = false;
  username: string = '';
  innerWidth: any;
  lessThan500: Boolean = false;
  constructor(private tokenStorageService: TokenStorageService,
             private router: Router,
             public dialog: MatDialog){}

  ngOnInit(): void{
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn){
      const user = this.tokenStorageService.getUser();
      this.username = user.first_name;
    }else{
      this.router.navigate(['/login']);
    }
    this.innerWidth = window.innerWidth;
    if(this.innerWidth <= 500){
      this.lessThan500 = true;
    }else{
      this.lessThan500 = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(){
    this.innerWidth = window.innerWidth;
    if(this.innerWidth <= 500){
      this.lessThan500 = true;
    }else{
      this.lessThan500 = false;
    }
  }
  logout(): void{
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
