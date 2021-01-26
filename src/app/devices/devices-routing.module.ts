import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCanActivateGuard } from '../shared/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscoverComponent } from './discover/discover.component';
const routes: Routes = [
  {
    path: 'devices',
    component: DashboardComponent,
    canActivate: [AuthCanActivateGuard],
  },
  {
    path: 'discover',
    component: DiscoverComponent,
    canActivate: [AuthCanActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule {}
