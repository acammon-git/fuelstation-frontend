import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Favorite } from 'src/app/shared/interfaces/favorite.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  obtenerFavs(): Observable<Favorite[]> {
    return this.http.get<any>(`${this.baseUrl}/favorites`).pipe(
      map(response => response),
       // Ajusta esta línea según la estructura de tu respuesta
      catchError(({ error }) => {
        console.log(error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  eliminarFav(campo1: number, campo2: number) {
    // Realiza la llamada HTTP para eliminar el usuario con el ID proporcionado
    return this.http.delete<any>(`${this.baseUrl}/favorites/${campo1}/${campo2}`).pipe(
      map(response => response),
      // Ajusta esta línea según la estructura de tu respuesta
      catchError(({ error }) => {
        console.log(error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

}
