import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/shared/services/navbar.service';

import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { ValidatorsService } from '../../../shared/services/validators.service';
import { EmailValidator } from '../../../shared/validators/email-validator.service';

@Component({
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {
  // inyección de servicios
  private navbarService = inject(NavbarService);
  public authService = inject(AuthService);
  public router = inject(Router);
  public fb = inject(FormBuilder);
  public validatorsService = inject(ValidatorsService);
  public emailValidator = inject(EmailValidator);
  public toastr = inject(ToastrService);

  // buscamos el usuario actual
  public user = computed(() => {
    if (this.authService.user()) {
      // asignamos los datos del usuario logueado al formulario
      this.profileForm.patchValue({
        nombre: this.authService.user()?.nombre,
        //foto:this.authService.user()?.foto,
        email: this.authService.user()?.email,
        pais: this.authService.user()?.pais,
        provincia: this.authService.user()?.provincia,
        telefono: this.authService.user()?.telefono,
      });
    }
    return this.authService.user();
  });

  // controlador del formulario / formbuilder
  public profileForm: FormGroup = this.fb.group(
    {
      
      email: [''],
      nombre: [''],
      pais: [''],
      provincia: [''],
      telefono: [''],
      password: [''],
      newPass1: [''],
      newPass2: [''],
    }
  );
  // configuraciones de la pagina
  public showChangePassword = false; // checkbox para controlar el cambio de contraseña

  ngOnInit(): void {
    // cambiamos el titulo del navbar
    this.navbarService.title.set("Editar mi cuenta");
    this.navbarService.backUrl.set("");
    console.log("pagina de editar usuario", this.authService.user());
    // ejecutamos la computada para forzar el cambio de los inputs
    this.user();
  }

  // comprueba si el campo es válido
  isValidField(field: string) {
    return this.validatorsService.isValidField(this.profileForm, field);
  }

  toggleAdditionalFields() {
    this.showChangePassword = !this.showChangePassword;
  }

  // controlador al enviar el formulario
  submit() {
    const formData = this.profileForm.getRawValue();
    if (this.showChangePassword) {
      this.authService.checkActualPass().subscribe(
        (response) => {
          if (formData.newPass1 === formData.newPass2) {
            formData.password = formData.newPass1;
            delete formData.newPass1;
            delete formData.newPass2;

            this.authService.updateUser(formData).subscribe({
              next: (response) => {
                console.log(response);
                this.toastr.success('Campo actualizado correctamente', 'Éxito');
                this.router.navigate(['/gasolineras/map']);
              },
              error: (updateError) => {
                this.toastr.error('Error al actualizar los campos', 'Error');
                console.log(updateError);
              }
            });
          }

        },
        (error) => {
          console.error(error);
        });
    } else {
      if (this.profileForm.valid) {
        console.log("fino")
        delete formData.password;
        delete formData.newPass1;
        delete formData.newPass2;
        console.log('Datos a cambiar:', this.profileForm);
        this.authService.updateUser(formData).subscribe({
          next: (response) => {
            console.log(response);

            this.toastr.success('Campo actualizado correctamente', 'Éxito');
          },
          error: (updateError) => {
            this.toastr.error('Error al actualizar los campos', 'Error');
            console.log(updateError);
          }
        });
      }else{
        console.log("fino")
      }
    }
  }
}
