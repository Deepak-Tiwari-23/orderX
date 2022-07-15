import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserSigninComponent } from './user-signin/user-signin.component';

const routes: Routes = [
  { path: '', component: UserSigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'register', component: UserRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
