import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { UserApiService } from "../../services/user-api.service"
import { User } from "../../models/user"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  userData: User;
  loading: boolean = false;


  constructor(private fb: FormBuilder, private router: Router, private userService: UserApiService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required]
    });
    this.userData = {} as User;
  }

  ngOnInit(): void {
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  createUser(): void {
    this.userData.email = this.registerForm.value.email;
    this.userData.password = this.registerForm.value.password;
    this.userData.first_name = this.registerForm.value.name;
    this.userData.last_name = this.registerForm.value.lastname;
    this.userService.registerUser(this.userData)
      .subscribe(() => {
        this.navigateToLogin()
      })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.createUser();
    } else {
      console.log('Invalid Data');
    }
  }

}
