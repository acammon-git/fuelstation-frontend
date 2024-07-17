import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { FavoritesRoutingModule } from './favorites-routing.module';



@NgModule({
  declarations: [
    MainDashboardComponent
  ],
  imports: [
    CommonModule,
    FavoritesRoutingModule
  ]
})
export class FavoritesModule { }
