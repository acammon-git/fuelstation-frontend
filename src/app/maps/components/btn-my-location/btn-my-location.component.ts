import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { FuelStation } from 'src/app/shared/interfaces/fuelStation.interface';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent  {
  public estacionesCercanas: FuelStation[] = [];
  constructor(
    private placesService: PlacesService,
    private mapService: MapService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef 
  ) { }

  async goToMyLocation() {

    if ( !this.placesService.isUserLocationReady ) throw Error('No hay ubicación de usuario');
    if ( !this.mapService.isMapReady ) throw Error('No hay mapa disponible');
    
    
    this.mapService.flyTo( this.placesService.useLocation! );
    const coordenadas = await this.placesService.getUserLocationSeparate();
    const [longitude, latitude] = coordenadas;
    console.log(`Longitud: ${longitude}, Latitud: ${latitude}`);

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Ajusta esto según la estructura específica de la respuesta
      const municipio = data.address?.town;
      this.mapService.viewNearFuelStations(municipio).subscribe(
        (response) => {
          this.ngZone.run(() => {
            this.estacionesCercanas = [...response];
            this.mapService.estacionesCercanas = [...response];
            console.log(this.estacionesCercanas);

            // Utiliza la función createMarkersFromPlaces para crear los marcadores
            this.mapService.createMarkersFromFuelStations(this.estacionesCercanas, this.placesService.useLocation);
          });
          this.cdr.detectChanges();
        },
        (error) => {
          console.error(error);
        }
      );
      console.log(`Municipio: ${municipio}`);
    } catch (error) {
      console.error('Error al obtener el municipio:', error);
    }
  }

  
}
