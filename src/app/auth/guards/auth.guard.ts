
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Pregunta si encuentra el token y avanza a la ruta sino saca al login
    if (this.authService.getToken()) {
      return true;
    } else {
      // Si no hay token, redirige al login
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}