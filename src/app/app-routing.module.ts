import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { LayoutPage } from './shared/pages/layout/layout-page.component';



const routes: Routes = [
  // Rutas de inicio
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'gasolineras',
    component: LayoutPage,
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule),
    canActivate: [AuthGuard], // Requerido estar autenticado
  },
  {
    path: 'top',
    component: LayoutPage,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'favorites',
    component: LayoutPage,
    loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule),
  },

  // Página que no existe, redirigir a la página principal
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }