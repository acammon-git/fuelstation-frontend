import { Component, OnInit, computed, inject } from '@angular/core';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { FuelStation } from 'src/app/shared/interfaces/fuelStation.interface';
import { MapService } from 'src/app/maps/services';
import { Favorite } from 'src/app/shared/interfaces/favorite.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit{
  private navbarService = inject(NavbarService);
  public router = inject(Router);
  private dashboardService = inject(DashboardService);
  public authService = inject(AuthService);
  private mapService = inject(MapService);
  public estacionesGasolina95: FuelStation[] = [];
  public estacionesGasA: FuelStation[] = [];
  public estacionesGasB: FuelStation[] = [];
  public id = computed(() => this.authService.user()?.id_usuario);
  constructor(private toastr: ToastrService) { }
  ngOnInit(): void {
    this.navbarService.title.set("Lo mas barato en España"); // el título será "Líneas"
    this.navbarService.backUrl.set("");
    this.dashboardService.viewTopGasoline95().subscribe(
      (response) => {
        if (Array.isArray(response)) {
        console.log(response);
        this.estacionesGasolina95 = [...response];
        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.dashboardService.viewTopGasA().subscribe(
      (response) => {
        if (Array.isArray(response)) {
        console.log(response);
        this.estacionesGasA = [...response];
        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.dashboardService.viewTopGasB().subscribe(
      (response) => {
        if (Array.isArray(response)) {
        console.log(response);
        this.estacionesGasB = [...response];
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  agregarAFavoritos(gasStation: any) {
    const id_usuario = this.id();
    gasStation = { id_usuario, ...gasStation };
    console.log("id:", this.id, "station: ", gasStation);

    this.dashboardService.añadirFavorito(gasStation).subscribe(
      (response) => {
        console.log('Gasolinera agregada a Favoritos:', response);
     
      },
      (error) => {
        console.error('Error al agregar a Favoritos:', error);

        // Verificar si el error tiene un código 500
        if (error.status === 500) {
          // Realizar acciones específicas para el código 500
          console.log('Error interno del servidor (código 500)');
          // Puedes mostrar un mensaje diferente, redirigir, etc.
        }

        this.toastr.error('No se ha podido añadir', 'Error');
      }
    );
  }
}

