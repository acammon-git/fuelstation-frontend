import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'auth-footer',
  templateUrl: './footer-login.component.html',
  styleUrls: ['./footer-login.component.css']
})
export class FooterLoginComponent {
  @Input() showFooter: boolean = true;
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verifica la ruta actual y decide si mostrar o no el footer
        this.showFooter = !event.url.includes('/ruta-a-ocultar-footer');
      }
    });
  }
}
