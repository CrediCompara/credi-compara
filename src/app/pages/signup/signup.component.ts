import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserApiService} from "../../services/user-api.service"
import {User} from "../../models/user"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  userData: User;


  constructor(private fb: FormBuilder, private router: Router, private userService: UserApiService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required]
    });
    this.userData = {} as User;

  }

  ngOnInit(): void {
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  createUser(): void {
    const newUser = { email: this.userData.email,
      password: this.userData.email,
      name: this.userData.first_name,
      lastName: this.userData.last_name,
      username: this.userData.username,
      id: 0 }
    this.userService.registerUser(newUser)
      .subscribe(() => {
        this.navigateToLogin()
      })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.createUser();
    } else {
      console.log('Invalid Data');
    }
  }

}
