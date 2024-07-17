import { Injectable } from '@angular/core';
import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { FuelStation } from 'src/app/shared/interfaces/fuelStation.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private readonly baseUrl: string = environment.baseUrl;
 public estacionesCercanas: FuelStation[] = [];

  private map?: Map;
  private markers: Marker[] = []

  get isMapReady() {
    return !!this.map;
  }

  constructor(private directionsApi: DirectionsApiClient, private http: HttpClient) { }

  viewNearFuelStations(municipio: string): Observable<FuelStation[]> {
    const headers = new HttpHeaders({
      'municipio': `${municipio}`
    });

    return this.http.get<any>(`${this.baseUrl}/fuel-station/stations-municipality`, { headers, responseType: 'json' }).pipe(
      map(response => {
        console.log('Respuesta completa:', response);
        return response?.data || []; // extraer el array de estaciones de servicio
      }),
      catchError(({ error }) => {
        console.log('Error en la solicitud HTTP:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  obtenerMunicipios(): Observable<string[]> {
    const url = `${this.baseUrl}/fuel-station/municipios`;
    return this.http.get<string[]>(url);
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });

  }
  createMarkersFromFuelStations(fuelStations: FuelStation[], userLocation: [number, number] | undefined) {

    if (!this.map) throw Error('Mapa no inicializado');
    if (!this.isMapReady) {
      throw new Error('El mapa no está inicializado');
    }

    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for (const fuelStation of fuelStations) {
      const { longitud, latitud, rotulo, direccion, precio_gasoleoA, precio_gasoleoB, precio_gasolina95 } = fuelStation;
      console.log([longitud, latitud]);
      const coordenadas = { longitud, latitud };
      const popupContent = `
    <div style="background-color: lightblue">
      <h4>${rotulo}</h6>
      <p>${direccion}</p>
    </div>
    <h5>PRECIOS</h6>
    <div style="background-color: lightblue">
      <p>GASOLEO A: ${precio_gasoleoA} euros/l</p>
      p>GASOLEO B: ${precio_gasoleoB} euros/l</p>
      <p>GASOLINA 95: ${precio_gasolina95} euros/l</p>
    </div>
  `;

      const popup = new Popup().setHTML(popupContent);

      const newMarker = new Marker()
        .setLngLat([longitud, latitud])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
      const buttons = document.getElementsByClassName("ruta");

      // Convierte la colección HTML en un array antes de iterar
      const buttonArray = Array.from(buttons);

      // Itera sobre los botones y asigna el evento de clic programáticamente
      for (const button of buttonArray) {
        button.addEventListener('click', () => {
          // Asegúrate de que userLocation no sea undefined antes de llamar a la función
          if (userLocation) {
            this.alert();
            this.getRouteBetweenPoints([userLocation[0], userLocation[1]], [coordenadas.longitud, coordenadas.latitud]);
          } else {
            console.error('userLocation es undefined');
          }
        });
      }

    }

    // Obtén todos los botones con la clase 'ruta' que acabas de agregar al DOM
    

    this.markers = newMarkers;

    if (userLocation && fuelStations.length > 0) {
      // Limites del mapa
      const bounds = new LngLatBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
      bounds.extend(userLocation);

      this.map.fitBounds(bounds, {
        padding: 200
      });
    }
  }
alert(){
  console.log("fino")
}
  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {

    if (!this.map) throw Error('Mapa no inicializado');
    if (!this.isMapReady) {
      throw new Error('El mapa no está inicializado');
    }

    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      console.log([lng, lat]);
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) return;

    // Limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 200
    })

  }


  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    console.log('Iniciando getRouteBetweenPoints');
    console.log('Start:', start);
    console.log('End:', end);

    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => {
        console.log('Respuesta de la API de direcciones:', resp);
        this.drawPolyline(resp.routes[0]);
      });
  }

  private drawPolyline(route: Route) {

    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });
    const dataToStore = { kms: route.distance / 1000, duration: route.duration / 60 };

    // Convierte el objeto a cadena JSON
    const jsonData = JSON.stringify(dataToStore);

    // Guarda la cadena JSON en el localStorage con una clave específica
    localStorage.setItem('rutaData', jsonData);
    if (!this.map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this.map?.fitBounds(bounds, {
      padding: 200
    });

    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-round-limit': 2.0, // Ajusta este valor para cambiar la suavidad de las curvas
        'line-cap': 'round', // Puedes probar con 'butt' o 'square' también
        'line-join': 'round', // Puedes probar con 'miter' o 'bevel' también
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
      }
    });
  }


}
