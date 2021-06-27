import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {AuthService} from 'src/app/services/auth.service';
import {TokenStorageService} from 'src/app/services/token-storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  roles: string[] = [];

  constructor(private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService,
              private tokenStorageService: TokenStorageService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()){
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  ingresar(): void {
    if(this.form.invalid){
      return;
    }
    this.loading = true;
    this.authService.login(this.form.value).subscribe(
      (data) => {
        this.tokenStorageService.saveToken(data.token);
        this.tokenStorageService.saveUser(data.user);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorageService.getUser().roles;
        return this.router.navigate(['/home']).then(()=>{
          window.location.reload();
        });
      },
      error => {
        this.error();
        this.loading = false;
        this.isLoginFailed = true;
        this.isLoggedIn = false;
        this.form.reset();
      }
    );
  }

  error(): void {
    this._snackBar.open("Usuario o contraseña invalidos", '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  fakeLoading(): void {
    this.loading = true;
    setTimeout(() => { this.router.navigate(['dashboard']) },3000);
  }
}
