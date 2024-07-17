import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPage {
  isSettingsMenuOpen: boolean = false;
  public menuToggle:boolean = false;
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const button = this.el.nativeElement.querySelector('#menubar-toggle-btn');
    if (button) {
      button.addEventListener('click', () => {
        // Agrega aquí la lógica que deseas ejecutar cuando se haga clic en el botón.
        // Por ejemplo, cambiar la clase de un elemento.
        this.switchMenu();
      });
    }
  }
  switchMenu():void{
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
  }
}
