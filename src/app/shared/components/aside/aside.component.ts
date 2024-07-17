import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from '../../../../environments/environment.development';
import { MapService, PlacesService } from 'src/app/maps/services';
import { FuelStation } from '../../interfaces/fuelStation.interface';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { Favorite } from '../../interfaces/favorite.interface';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';


@Component({
  selector: 'shared-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit{ // Debes implementar OnInit para utilizar ngOnInit
  // inyección de servicios
  public authService = inject(AuthService);
  private cdr= inject(ChangeDetectorRef);
  // datos de usuario autenticado
  public nombre = computed(() => this.authService.user()?.nombre);
  public id = computed(() => this.authService.user()?.id_usuario);
  
  public foto = computed(() => {
    const imageName = this.authService.user()?.foto;
    return `${environment.baseUrl}/serve-images/${imageName}`;
  }); 
  public estacionesCercanas: FuelStation[] = [];
  public distanciasCargadas:string='';
  public tiempoCargado:string='';
  public municipios: Observable<string[]> | undefined;
  //constructor
  constructor(private mapService: MapService, private placesService: PlacesService, private dashboardService: DashboardService, private toastr: ToastrService){}
  async ngOnInit(): Promise<void> {
   this.municipios= await this.mapService.obtenerMunicipios();
   console.log(this.municipios)
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
        

          // Utiliza la función createMarkersFromPlaces para crear los marcadores
    
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
  
  // Rutas de nuestro menú
  public menuItems: MenuItem[] = [
    { route: '/top', name: 'Top más económico', icon: 'bi bi-hand-thumbs-up-fill' },
    { route: '/gasolineras', name: 'Gasolineras', icon: 'zmdi-reader' },
    { route: '/favorites', name: 'Favoritos', icon: 'bi bi-star-fill' },
    
  ];
  // configuraciones/opciones del menu
  public isSettingsMenuOpen: boolean = false;
  public mostrarOpcionFoto: boolean = false;
  agregarAFavoritos(gasStation: any) {
    const id_usuario = this.id();
    gasStation = { id_usuario, ...gasStation };
    console.log("id:", this.id, "station: ", gasStation);
    // Puedes usar el servicio correspondiente para agregar a favoritos
    this.dashboardService.añadirFavorito(gasStation).subscribe(
      (response) => {
        console.log('Gasolinera agregada a Favoritos:', response);
        
      },
      (error) => {
        console.error('Error al agregar a Favoritos:', error);
       
      }
    );
  }
  onMunicipioSeleccionado(event: any): void {
    // Verificar que event y event.target no sean null
    if (event && event.target) {
      const valorSeleccionado = event.target.value;

      this.mapService.viewNearFuelStations(valorSeleccionado).subscribe(
        (response) => {
          this.estacionesCercanas = [...response];
        

          // Utiliza la función createMarkersFromPlaces para crear los marcadores
          this.mapService.createMarkersFromFuelStations(this.estacionesCercanas, this.placesService.useLocation);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  seleccionarEstacion(estacion: FuelStation): void {
   
    this.placesService.getUserLocation().then(coordenadas => {
      const [latitude, longitude] = coordenadas;
      const start = coordenadas;
      const estacionCoordenadas: [number, number] = [estacion.longitud, estacion.latitud,];

      // Llama a getRouteBetween con la ubicación actual y la estación seleccionada
      console.log("start:", start, "coords:", [latitude, longitude] )
      this.mapService.getRouteBetweenPoints(start, estacionCoordenadas);
     
      // Verifica si hay datos almacenados y parsea la cadena JSON
      // Obtén el valor almacenado en localStorage
      const storedDataString = localStorage.getItem('rutaData');

      // Verifica si hay datos almacenados y parsea la cadena JSON
      const storedData = JSON.parse(localStorage.getItem('rutaData') || '{}');

      // Desestructura el objeto
      const { kms, duration } = storedData;

      // Asigna los valores a las propiedades
      const distanciaRedondeada = kms ? parseFloat(kms.toFixed(2)) : 0;
      const tiempoRedondeado = duration ? parseFloat(duration.toFixed(2)) : 0;

      // Asigna los valores redondeados a las propiedades
      this.distanciasCargadas = distanciaRedondeada.toString();
      this.tiempoCargado = tiempoRedondeado.toString();

     
    });
  }
  mostrarOpcionCambiarFoto() {
    this.mostrarOpcionFoto = !this.mostrarOpcionFoto;
  }
  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
  }
  notificarCambio(): void {
    this.cdr.detectChanges();
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
}
