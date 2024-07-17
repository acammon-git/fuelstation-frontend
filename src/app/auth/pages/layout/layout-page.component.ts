import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class NoSesionLayoutPage {
  showFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;
        console.log(currentRoute);

        // Verifica si la ruta actual es "/auth/sign-up" y establece showFooter en false
        this.showFooter = currentRoute !== '/auth/sign-up';
      }
    });
  }
}