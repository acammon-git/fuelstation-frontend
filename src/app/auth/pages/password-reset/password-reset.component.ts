import { Component } from '@angular/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetPage {
    public newPassword?:string;

    validateData(newPassword:string) {
      // Implementa validación de datos, como longitud de contraseña, etc.
      // Retorna true si los datos son válidos, de lo contrario, muestra un mensaje de error al usuario.
      return true;
    }
}
