import { Component, computed, effect, inject } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // inyección de dependencias
  private navbarService = inject(NavbarService);
  private toastr = inject(ToastrService);
  public router = inject(Router);
  // definición de variables
  public title = ""; // por defecto el titulo está vacío
  public backUrl = ""; // por defecto no hay url para volver atrás

  constructor(){
    // escuchamos los cambios del titulo en el servicio
    effect(() => this.title = this.navbarService.title());
    // escuchamos los cambios de la url anterior en el servicio
    effect(() => this.backUrl = this.navbarService.backUrl());
  }
  cerrarSesion() {
    Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Saliendo de su sesión...",
          icon: "success"
        });

        // Agrega un retraso de 2 segundos antes de realizar las acciones
        setTimeout(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.router.navigate(['/contactos/edit']);
        }, 2000);
      }
    });
  }
}
