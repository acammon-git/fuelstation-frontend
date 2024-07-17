import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?: number | undefined;

  constructor(private placesService: PlacesService) { }

  onQueryChanged(query: string = '') {

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer as number); // Aquí especificamos que debounceTimer es un número
    }

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query);
    }, 350) as any; // Aquí especificamos que el resultado de setTimeout es de tipo any

  }

}