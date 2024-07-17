import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './pages/login/login-page.component';
import { NoSesionLayoutPage } from './pages/layout/layout-page.component';
import { EditPageComponent } from './pages/edit/edit-page.component';
import { FooterLoginComponent } from './components/footer-login/footer-login.component';
import { LogoComponent } from './components/logo/logo.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmerWindowComponent } from './components/emer-window/emer-window.component';



@NgModule({
  declarations: [
    LoginPage,
    NoSesionLayoutPage,
    EditPageComponent,
    FooterLoginComponent,
    LogoComponent,
    SignUpComponent,
    EmerWindowComponent,
   

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    
  ]
})
export class AuthModule { }
