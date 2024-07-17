import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { User } from './shared/interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MailerAdmin';
  // inyectamos el servicio de autentificación
  public authService = inject(AuthService);
  
  
  ngOnInit(): void {
    // obtener el usuario que está logueado actualmente
    this.authService.getUserInfo().subscribe((user:User | null) => {
      if(this.authService.user() ==  null) console.warn("Nulo - sin datos");
      else console.error("Usuario actual:", this.authService.user());
    });
  }
}
