import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  // declaración de variables
  public title = signal<string>("");
  public backUrl = signal<string>("");
}
