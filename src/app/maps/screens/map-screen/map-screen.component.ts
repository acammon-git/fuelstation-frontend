import { Component, OnInit, computed, inject } from '@angular/core';
import { PlacesService } from '../../services';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent implements OnInit{
  
  
  constructor( private placesService: PlacesService ) { }
  ngOnInit(): void {
   
  }


  get isUserLocationReady() {
    return this.placesService.isUserLocationReady;
  }

  
}
