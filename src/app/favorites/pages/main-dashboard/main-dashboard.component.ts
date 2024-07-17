import { FavoriteService } from './../../services/favorite.service';
import { Component, OnInit, inject } from '@angular/core';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { Router } from '@angular/router';
import { FuelStation } from 'src/app/shared/interfaces/fuelStation.interface';
import { MapService } from 'src/app/maps/services';
import { Favorite } from 'src/app/shared/interfaces/favorite.interface';
import { ToastrService } from 'ngx-toastr';
@Component({
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit{
  private navbarService = inject(NavbarService);
  public router = inject(Router);
  private favoriteService = inject(FavoriteService);
  public favoritos: Favorite[] = [];
  public verMas: boolean=false;
  constructor(private toastr: ToastrService) { }
  ngOnInit(): void {
    this.navbarService.title.set("Guardado en favoritos"); // el título será "Líneas"
    this.navbarService.backUrl.set("");
    
    this.favoriteService.obtenerFavs().subscribe(
      (response) => {
        
        console.log(response);
          this.favoritos = [...response];
        console.log(this.favoritos.length);
      },
      (error) => {
        console.error(error);
      }
    );
 
}
cambiarVerMas(){
  this.verMas=!this.verMas;
}
existenFavs():boolean{
  if (this.favoritos.length===0) {
    return false;
  }else{
    return true;
  }
}
  eliminarFav(campo1: number, campo2: number): void {
    this.favoriteService.eliminarFav(campo1, campo2).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success('Sitio eliminado de favoritos', 'Éxito');
        // Realiza las operaciones necesarias después de la eliminación
      },
      (error) => {
        console.error(error);
        this.toastr.error('No se ha podido eliminar', 'Error');
      }
    );
  }
}
