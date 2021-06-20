import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) {
    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ingresar(): void {
    const user = this.form.value.user;
    const password = this.form.value.password;

    if (user == 'miguel' && password == '123456789') {
      console.log("Se logeo correctamente");
      this.loading = true;
      this.fakeLoading();
    }
    else {
      console.log("Se logeo incorrectamente");
      this.error();
      this.loading = false;
      this.form.reset();
    }
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
