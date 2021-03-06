import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./pages/login/login.component";
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {SignupComponent} from "./pages/signup/signup.component";
import {SaveComponent} from "./pages/save/save.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'save', component: SaveComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule, ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
