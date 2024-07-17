import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
// import { LoadingService } from '../services/loading.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private countRequest = 0;

  // // inyección de dependencias
  // private loadingService = inject(LoadingService);

  // para interceptar las peticiones http
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // si existe alguna petición en curso, muestro el loader
    // if (!this.countRequest) {
    //   this.loadingService.on();
    // }
    this.countRequest++;
    const token = localStorage.getItem('token');
    const modifiedRequest = req.clone({
      setHeaders: {
        'x-token': `${token}`
      }
    });
 
    return next.handle(modifiedRequest)
      .pipe(
        // cuando finalizan las peticiones http apago el loader
        finalize(() => {
          this.countRequest--;
          // if (!this.countRequest) {
          //   this.loadingService.off();
          // }
        }),
        // por aqui pasan todas las peticiones http de la aplicación
        tap((event: HttpEvent<any>) => {
          // Capturar las respuestas exitosas (200) y realizar acciones si es necesario
          if (event instanceof HttpResponse && event.status === 200) {
            // Si en una petición exitosa recibo un Unauthorized cierro la sesión
            if (event.body && event.body.result && event.body.result.Unauthorized && event.body.result.Unauthorized === '1') {

            }
          }
        }),
        // control de errores en las peticiones
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Error en la solicitud HTTP', error);
          }
          return throwError(() => error);
        }),
      );
  }
}
