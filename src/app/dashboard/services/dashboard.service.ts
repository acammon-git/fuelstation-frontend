import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, catchError } from 'rxjs';
import { of } from 'rxjs';
import { Favorite } from 'src/app/shared/interfaces/favorite.interface';
import { FuelStation } from 'src/app/shared/interfaces/fuelStation.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  viewTopGasoline95(): Observable<FuelStation[]> {
    return this.http.get<any>(`${this.baseUrl}/fuel-station/top-fuel95-stations`).pipe(
      map(response => response?.data), // Ajusta esta línea según la estructura de tu respuesta
      catchError(({ error }) => {
        console.log(error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  viewTopGasA(): Observable<FuelStation[]> {
    return this.http.get<any>(`${this.baseUrl}/fuel-station/top-fuelGasA-stations`).pipe(
      map(response => response?.data), // Ajusta esta línea según la estructura de tu respuesta
      catchError(({ error }) => {
        console.log(error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  viewTopGasB(): Observable<FuelStation[]> {
    return this.http.get<any>(`${this.baseUrl}/fuel-station/top-fuelGasB-stations`).pipe(
      map(response => response?.data), // Ajusta esta línea según la estructura de tu respuesta
      catchError(({ error }) => {
        console.log(error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  
  
  añadirFavorito(formData: Favorite): Observable<boolean> {

    return this.http.post<any>(`${this.baseUrl}/favorites`, formData).pipe(
      map(response => {
        console.warn("respuesta del post", response);
        console.log(response)
        this.toastr.success('Sitio añadido de favoritos', 'Éxito');
        // this.serviceToast.showToast('bg-green-600', 'Éxito', response.message);
        return true;
      }),
      catchError(({ error }) => {
        console.log(error)
        this.toastr.error('Ya tienes esta gasolinera en favoritos.', 'Error');
        return of(false);
      })
    );
  }
}