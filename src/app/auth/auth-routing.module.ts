import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page.component';
import { NoSesionLayoutPage } from './pages/layout/layout-page.component';
import { LayoutPage } from '../shared/pages/layout/layout-page.component';
import { AuthGuard } from './guards/auth.guard';
import { EditPageComponent } from './pages/edit/edit-page.component';
import { PasswordResetPage } from './pages/password-reset/password-reset.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

// todas estas rutas se cargan por lazyload
// empiezan por la ruta definida en el fichero de rutas principal
// auth/xxxx
const routes: Routes = [
  // pagina editar va a usar el layout full y requiere login
  {
    path:'edit',
    component: LayoutPage,
    children: [
      { path: '', component: EditPageComponent }
    ],
    canActivate: [AuthGuard] // ! < es requerido estar autenticado
  },
  // resto de patchs de auth
  {
    path: '',
    component: NoSesionLayoutPage,
    children: [
      // iniciar sesión
      {
        path:'login',
        component: LoginPage,
      },
      {
        path:'reset-password',
        component: PasswordResetPage,
      },
      {
        path:'sign-up',
        component: SignUpComponent,
      },
      // pagina por defecto, login
      {
        path:'**',
        redirectTo: 'login',
      },
    ]
  },
  
  // pagina por defecto, login
  {
   path:'**',
   redirectTo: 'login'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
