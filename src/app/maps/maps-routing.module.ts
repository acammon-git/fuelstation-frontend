import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapScreenComponent } from './screens/map-screen/map-screen.component';
import { MainDashboardComponent } from '../dashboard/pages/main-dashboard/main-dashboard.component';


// todas estas rutas se cargan por lazyload
// empiezan por la ruta definida en el fichero de rutas principal
// /fuentes
const routes: Routes = [
  // listado de formaciones del usuario
  {
    path: '',
    component: MapScreenComponent, // Página principal
  },
  {
    path: 'map',
    component: MapScreenComponent,
  },
  {
    path: 'viewFuelService',
    component: MainDashboardComponent,
  },
  

  
  // página que no existe, a la pagina principal
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
