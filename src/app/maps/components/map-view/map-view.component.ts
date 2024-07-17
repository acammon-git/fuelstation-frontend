import { Component, AfterViewInit, ViewChild, ElementRef, inject, computed } from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService, PlacesService } from '../../services';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { FuelStation } from 'src/app/shared/interfaces/fuelStation.interface';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  private navbarService = inject(NavbarService);
  public authService = inject(AuthService);
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef
  public estacionesCercanas: FuelStation[] = [];
  public contador =0;
  public foto = computed(() => this.authService.user()?.foto);

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) { }

  async ngAfterViewInit(): Promise<void> {
    if (this.foto() === '' || this.foto() == undefined) {
      console.log(this.foto());
      Swal.fire({
        title: "¡Foto no disponible! Suba su foto.",
        text: "",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vale"
      })
    }
    if (this.contador==0) {
      Swal.fire({
        title: "¡Mostrando las gasolineras más cercanas a tu localización!",
        text: "",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vale"
      })
    }
    
    this.navbarService.title.set("Mapa de gasolineras");
    this.navbarService.backUrl.set("");
    if (!this.placesService.useLocation) throw Error('No hay placesService.userLocation');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/light-v10',
      center: this.placesService.useLocation,
      zoom: 14,
    });

    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.useLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.setMap(map);
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
          this.estacionesCercanas = [...response];
          console.log(this.estacionesCercanas);

          // Utiliza la función createMarkersFromPlaces para crear los marcadores
          this.mapService.createMarkersFromFuelStations(this.estacionesCercanas, this.placesService.useLocation);
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