import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, map } from 'rxjs/operators'; // Importa 'catchError' y 'map' de 'rxjs/operators'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPage {
  public myForm: FormGroup;
  public loged!:boolean;
  constructor(private fb: FormBuilder, @Inject(AuthService) private authService: AuthService,  private router: Router, private toastr: ToastrService) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    const { email, password } = this.myForm.value;

    // Llama al método login del servicio de autenticación y devuelve un Observable
    this.authService.login(email, password)
  .pipe(
    map(success => {
      if (success) {
        // Redireccionar al componente deseado
        this.loged=true;
        setTimeout(() => {
          this.router.navigate(['/gasolineras/map']);
          this.toastr.success('Inicio de sesión exitoso', 'Éxito');
        }, 1500);
      } else {
        // Manejar inicio de sesión fallido, mostrar un mensaje de error, etc.
        this.toastr.error('Credenciales incorrectas', 'Error');
        throw new Error('Inicio de sesión fallido');
      }
    }),
    catchError(error => {
      // Manejar errores de la llamada al servicio, por ejemplo, mostrar un mensaje de error en caso de error de red.
      console.error('Error en la llamada al servicio:', error);
      return [];
    })
  )
  .subscribe(
    () => {
      // Esto se ejecutará después de que se complete el flujo exitoso
    },
    error => {
      // Manejar errores que se han propagado desde el operador 'catchError'
      console.error('Error en el flujo de inicio de sesión:', error);
    }
  );
  }

  
}