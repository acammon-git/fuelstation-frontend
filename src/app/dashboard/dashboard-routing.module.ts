import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { MapScreenComponent } from '../maps/screens/map-screen/map-screen.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LayoutPage } from '../shared/pages/layout/layout-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainDashboardComponent, // Página principal
  },
  {
    path: 'top',
    component: MainDashboardComponent,
  },
  
  {
    path: '**',
    redirectTo: 'gasolineras',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
