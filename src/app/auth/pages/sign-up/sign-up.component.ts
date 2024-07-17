import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  //inyección de servicios
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  public router = inject(Router);
  public authService=inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  //Declaraciones de variables
  public formNewUser: FormGroup = this.fb.group(
    {
      email: [''],
      nombre: [''],
      password: [''],
      telefono: [''],
      pais: [''],
      provincia: [''],
      foto: [''],
      last_login:[''],
      activo: [0],
    }
  );
  public id = computed(() => this.authService.user()?.id_usuario);
  submit(){
    if (this.formNewUser.valid) {
      const formData = this.formNewUser.getRawValue();
      this.authService.createUser(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Usuario creado correctamente', 'Éxito');
        },
        error: (createError) => {
          this.toastr.error('Error al crear el usuario', 'Error');
        }
      });
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log(this.id());
    if (file) {
      const formData: FormData = new FormData();
      formData.append('foto', file);

      this.authService.uploadPhoto(this.id(), formData).subscribe(
        (data) => {
          console.log(data.message); // Puedes manejar la respuesta del servidor aquí
        },
        (error) => {
          console.error('Error al enviar la foto al servidor:', error);
        }
      );
    }
    this.notificarCambio();

  }
  notificarCambio(): void {
    this.cdr.detectChanges();
  }
}
